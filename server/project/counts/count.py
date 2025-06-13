import numpy as np
import sqlite3
import dbwork
from scipy.optimize import minimize
from scipy.signal import convolve
from scipy.signal.windows import gaussian
from subprocess import call
from PyLTSpice import RawRead
import matplotlib.pyplot as plt


unit_multipliers = {
    # Стандартные приставки СИ (степени 10)
    'Y': 1e24,   # йотта-
    'Z': 1e21,   # зетта-
    'E': 1e18,   # экса-
    'P': 1e15,   # пета-
    'T': 1e12,   # тера-
    'G': 1e9,    # гига-
    'M': 1e6,    # мега-
    'k': 1e3,    # кило-
    'h': 1e2,    # гекто-
    'da': 1e1,   # дека-
    'd': 1e-1,   # деци-
    'c': 1e-2,   # санти-
    'm': 1e-3,   # милли-
    'μ': 1e-6,   # микро- (символ U+03BC)
    'u': 1e-6,   # микро- (альтернатива для 'μ')
    'n': 1e-9,   # нано-
    'p': 1e-12,  # пико-
    'f': 1e-15,  # фемто-
    'a': 1e-18,  # атто-
    'z': 1e-21,  # зепто-
    'y': 1e-24,  # йокто-
    }
def fstf(s):
    # Ищем приставку в начале строки (например, "k" в "kg")
    for prefix in sorted(unit_multipliers.keys(), key=len, reverse=True):
        if s.endswith(prefix):
            number = float(s[:-len(prefix)])
            return number * unit_multipliers[prefix]
    return float(s)  # если приставки нет

class MOSFET:
    def __init__(self, name: str, path: str):
        self.name = name
        self.params = {}
        self.mes_idvd = dbwork.get_plots(f"{name}_DATA")
        self.measured_data = {}
        self.steps_idvd = self.get_steps()
        self.mes_idvg = dbwork.get_plots(f"{name.replace('idvd', 'idvg')}_DATA")
        self.vds = [str(i['Inputs']['vd']) for i in self.mes_idvg]
        self.vgs = [str(i['Inputs']['vg']) for i in self.mes_idvd]
        self.steps_idvg = self.get_steps('1')
        self.idvd = ''
        self.idvg = ''
        self.spisePath = path
        self.fill_params()
        self.type = "NMOS" if self.params['TYPE'] == '1' else "PMOS"
        self.optimization_history = []
    
    def fill_params(self):
        connection = sqlite3.connect("db0.db")
        cursor = connection.cursor()

        # Выполняем SQL-запрос
        query = f"SELECT VALUES_KEYS, VALUES_VAL FROM {f'{self.name}_HEADER'}"
        cursor.execute(query)
        

        # Получаем все результаты
        results = cursor.fetchall()
        for index in range(len(results)):
            if results[index][0] is not None:
                if "MAIN" in results[index][0]:
                    self.params[results[index][0].split('.')[1]] = results[index][1]
                else:
                    self.params[results[index][0]] = results[index][1]
        
        idvg = self.name.replace("idvd", "idvg")
        query = f"SELECT INPUTS FROM {f'{idvg}_HEADER'}"
        cursor.execute(query)
        results = cursor.fetchall()
        self.steps_idvg = results

    def get_steps(self, typ='idvd'):
        name = self.name + "_HEADER"
        if typ != 'idvd':
            name = name.replace('idvd', 'idvg')
        connection = sqlite3.connect("db0.db")
        cursor = connection.cursor()
        query = f"SELECT INPUTS FROM {name}"
        cursor.execute(query)
        results = cursor.fetchall()
        res = []
        for i in results:
            res.append(i)
        return res 

    def calculate_vto(self):
        """
        Вычисление порогового напряжения (VTO) по передаточным характеристикам транзистора.
        
        Возвращает:
            Рассчитанное значение порогового напряжения VTO
        """
        # Извлекаем данные по осям X и Y
        data = np.array(sorted(self.mes_idvg, key=lambda mes: mes["Inputs"]["vd"])[0]['data'])[:, :2] #самое маленькое по модулю
        x = data[:, 0]  # Напряжения на затворе
        y = data[:, 1]  # Токи стока
        
        # Вычисляем производную dY/dX (разностный метод)
        diff_y = np.diff(y)
        # Создаем равномерно распределенные значения X для производной
        x_diff = np.linspace(0, x[-1], len(diff_y))
        
        # Сглаживание производной с помощью гауссова окна
        window_size = 10  # Размер окна сглаживания
        # Создаем гауссово окно (колоколообразная кривая)
        g = gaussian(window_size, std=window_size/3)
        g = g / np.sum(g)  # Нормализуем окно
        # Применяем свертку для сглаживания производной
        diff_y_smoothed = convolve(diff_y, g, mode='same')
        
        # Находим точку с максимальной производной (крутизной характеристики)
        ind = np.argmax(diff_y_smoothed)
        
        # Вычисляем параметры касательной в этой точке:
        dx = x[ind+1] - x[ind]  # Дельта по напряжению
        dy = y[ind+1] - y[ind]  # Дельта по току
        tang = dx / dy  # Тангенс угла наклона касательной
        
        # Находим точку пересечения касательной с осью X (V1)
        v1 = x[ind] - tang * y[ind]
        
        vto = v1 # + param
        self.params["VTO"] = vto
    
        return vto

    def calculate_rs(self):
        data = np.array(sorted(self.mes_idvd, key=lambda mes: -mes["Inputs"]["vg"])[0]['data'])[:, :2] #самое большое по модулю
        """
        Вычисляет сопротивление истока (RS) для полевого транзистора.
        
        Параметры:
        data : ndarray
            Массив данных формы (N, 2), где первый столбец - напряжение, второй - ток.
        
        Возвращает:
        RS : float
            Расчетное сопротивление истока.
        poly_coeff : ndarray
            Коэффициенты аппроксимирующей прямой [k, b].
        """
        # Вычисление производной тока по напряжению
        diffY = np.diff(data[:, 1])
        
        # Создание оси X для производной (исключаем последнюю точку, так как diff уменьшает размер на 1)
        X_diff = np.linspace(0, data[-1, 0], len(diffY))
        
        # Нормировка производной (максимальное значение = 1)
        max1 = np.max(diffY)
        diffY_norm = diffY / max1
        
        # Находим крутой участок (первую точку, где производная < 0.5)
        ind_slope = np.argmax(diffY_norm < 0.5)
        if ind_slope == 0:  # Если все точки удовлетворяют условию
            ind_slope = len(diffY_norm) - 1
        
        # Выбираем данные крутого участка
        X_slope = data[:ind_slope+1, 0]
        Y_slope = data[:ind_slope+1, 1]
        
        # Аппроксимация прямой (y = kx + b)
        poly_coeff = np.polyfit(X_slope, Y_slope, 1)
        
        # Расчет RS (обратное значение наклона)
        RS = abs(1 / poly_coeff[0])
        self.params["RS"] = RS
        return RS
    
    def get_start_stop_step(self, param='vd'):
        out = [0, 0 ,0]
        if param == 'vd':
            for i in self.steps_idvd:
                if 'vd' in i[0]:
                    i = i[0].split()
                    out[0], out[1], out[2] = float(i[-4]), float(i[-3]), float(i[-1])
                    return list(map(str, out))
        elif param == 'vg':
            for i in self.steps_idvd:
                if 'vg' in i[0]:
                    i = i[0].split()
                    out[0], out[1], out[2] = float(i[-4]), float(i[-3]), float(i[-1])
                    return list(map(str, out))

    def generate_mosfet_model(self, fixed_params=None, variable_params=None, x=None):
        """
        Генерирует строку .model для LTspice в одну строку, комбинируя фиксированные и оптимизируемые параметры.
        
        Args:
            model_name (str): Имя модели (например 'NMOS_MODEL')
            model_type (str): Тип модели ('NMOS' или 'PMOS')
            fixed_params (dict): Фиксированные параметры модели
            variable_params (list): Список имен оптимизируемых параметров (None если все фиксированы)
            x (np.array): Текущие значения оптимизируемых параметров (None если все фиксированы)
            
        Returns:
            str: Строка .model для LTspice (в одну строку)
        """
        # Объединяем фиксированные и оптимизируемые параметры
        if variable_params is not None and x is not None:
            variable_dict = dict(zip(variable_params, x))
            all_params = {**fixed_params, **variable_dict}
        else:
            all_params = fixed_params
        
        # Генерация строки модели в одну строку
        param_str = " ".join(f"{k}={v:g}" for k, v in all_params.items())
        model_line = f".model MOS {self.type}({param_str})"
        return model_line

    def convert_code(self, fixed_params=None, variable_params=None, x=None, typ='idvd'):
        if typ == 'idvd':
            asc = f"""

*IDVD
{self.generate_mosfet_model(fixed_params, variable_params, x)}

VD D 0 DC 0

VG G 0 DC 0

M1 D G 0 0 MOS

.dc VD {' '.join(self.get_start_stop_step('vd'))} VG LIST {' '.join(self.vgs)}
.option plotwinsize=0
.options noopiter

.end

"""
            with open('spicefiles/modidvd.cir', 'w') as F:
                F.write(asc)
        elif typ == "idvg":
            asc = f"""
*IDVG
{self.generate_mosfet_model(fixed_params, variable_params, x)}

VD D 0 DC 0

VG G 0 DC 0

M1 D G 0 0 MOS

.dc VG {' '.join(self.get_start_stop_step('vg'))} VD LIST {' '.join(self.vds)}
.option plotwinsize=0
.options noopiter   

.end

"""
            with open('spicefiles/modidvg.cir', 'w') as F:
                F.write(asc)
    
    def run_ltspice(self, typ='idvd'):
        if typ == 'idvd':
            call([self.spisePath, '-b', 'spicefiles/modidvd.cir'])
            return self.get_model_results(typ='idvd')
        elif typ == 'idvg':
            call([self.spisePath, '-b', 'spicefiles/modidvg.cir'])
            return self.get_model_results(typ='idvg')

    def get_model_results(self, typ='idvd'):
            if typ == 'idvd':
                # Загрузка .raw файла
                raw_data = RawRead('spicefiles/modidvd.raw')
                # Проверяем количество запусков (шагов)
                n_steps = len(raw_data.steps)
                vd_all = []
                id_all = []
                # Считываем данные для каждого запуска
                for step in range(n_steps):
                    try:
                        # Получаем данные для текущего шага            
                        vd_all = np.hstack((vd_all, raw_data.get_wave('V(d)', step=step)))
                        id_all = np.hstack((id_all, raw_data.get_wave('Id(M1)', step=step)))
                    except Exception as e:
                        print(f"Ошибка при обработке шага {step}: {e}")
                        continue
            elif typ == 'idvg':
                # Загрузка .raw файла
                raw_data = RawRead('spicefiles/modidvg.raw')
                # Проверяем количество запусков (шагов)
                n_steps = len(raw_data.steps)
                vg_all = []
                id_all = []
                # Считываем данные для каждого запуска
                for step in range(n_steps):
                    try:
                        # Получаем данные для текущего шага            
                        vg_all = np.hstack((vg_all, raw_data.get_wave('V(g)', step=step)))
                        id_all = np.hstack((id_all, raw_data.get_wave('Id(M1)', step=step)))
                    except Exception as e:
                        print(f"Ошибка при обработке шага {step}: {e}")
                        continue
            return np.column_stack((vd_all, id_all)) if typ == 'idvd' else np.column_stack((vg_all, id_all))

    def set_measured_data(self):
        """Установка измеренных данных для характеристики"""
        idvd = []
        for i in self.mes_idvd:
            idvd.extend(np.column_stack((np.array(i['data'])[:, 0], np.array(i['data'])[:, 1])))
        idvg = []
        for i in self.mes_idvg:
            idvg.extend(np.column_stack((np.array(i['data'])[:, 0], np.array(i['data'])[:, 1])))
        self.measured_data = {
            'IDVD': np.array(idvd),
            'IDVG': np.array(idvg)
        }

    def error_function(self, params_values, params_names, fixedparams, char_types, segments, weights=None):
        if weights is None:
            weights = {ct: 1.0 for ct in char_types}
        
        total_error = 0.0

        for char_type in char_types:
            # Получаем сегменты для текущей характеристики
            char_segments = segments.get(char_type, {})
            x_min, x_max = char_segments.get('x', (None, None))
            y_min, y_max = char_segments.get('y', (None, None))
            
            # Генерируем .cir и запускаем LTspice
            self.convert_code(fixedparams, params_names, params_values, char_type.lower())
            simulated_data = self.run_ltspice(char_type.lower())

            if simulated_data is None or np.isnan(simulated_data).any():
                print(f"Ошибка: LTspice не вернул данные для {char_type}!")
                return float('inf')
            
            measured = self.measured_data.get(char_type.upper())
            if measured is None:
                print(f"Ошибка: Нет измеренных данных для {char_type}!")
                continue
            
            # Фильтрация данных по сегментам
            mask_measured = np.ones(len(measured), dtype=bool)
            mask_simulated = np.ones(len(simulated_data), dtype=bool)
            
            if x_min is not None:
                mask_measured &= (measured[:, 0] >= x_min)
                mask_simulated &= (simulated_data[:, 0] >= x_min)
            if x_max is not None:
                mask_measured &= (measured[:, 0] <= x_max)
                mask_simulated &= (simulated_data[:, 0] <= x_max)
            
            if y_min is not None:
                mask_measured &= (measured[:, 1] >= y_min)
                mask_simulated &= (simulated_data[:, 1] >= y_min)
            if y_max is not None:
                mask_measured &= (measured[:, 1] <= y_max)
                mask_simulated &= (simulated_data[:, 1] <= y_max)
            
            measured_segment = measured[mask_measured]
            simulated_segment = simulated_data[mask_simulated]
            
            if len(measured_segment) == 0 or len(simulated_segment) == 0:
                print(f"⚠️ Для {char_type} нет точек в сегменте!")
                continue

            # Создаем словари {x: y} для быстрого поиска
            measured_dict = {x: y for x, y in measured_segment}
            simulated_dict = {x: y for x, y in simulated_segment}

            # Находим общие X точки
            common_x = set(measured_dict.keys()).intersection(simulated_dict.keys())
            
            if not common_x:
                print(f"Ошибка: Нет общих точек X для {char_type}!")
                continue

            # Собираем Y значения для общих X
            y_measured = np.array([measured_dict[x] for x in common_x])
            y_simulated = np.array([simulated_dict[x] for x in common_x])

            # Вычисляем ошибку (MSE или другая метрика)
            error = np.sqrt(np.mean((y_measured - y_simulated)**2))
            total_error += weights[char_type] * error
            
            print(f"{char_type}: error = {error:.3e} (вес {weights[char_type]})")

        return total_error
    
    def optimize(self,fixed_params=dict(), params_dict=dict(), char_types=list(), stop_conditions=dict(), segments=dict):
        self.set_measured_data()
        """
        Основная функция оптимизации
        """
        if stop_conditions is None:
            stop_conditions = {
                'max_iter': 100,
                'abs_tol': 1e-6,
                'rel_tol': 1e-4,
                'param_change_percent': 1.0
            }
        # Подготовка параметров
        param_names = list(params_dict.keys())
        initial_guess = [0.5 * (v[0] + v[1]) for v in params_dict.values()]  # Среднее значение
        bounds = [(v[0], v[1]) for v in params_dict.values()]
        
        # Настройки оптимизации
        options = {
            'maxiter': stop_conditions.get('max_iter', 100),
            'ftol': stop_conditions.get('abs_tol', 1e-6),
            'gtol': stop_conditions.get('rel_tol', 1e-4),
            'eps': 1e-6,  # Меньший шаг для численных производных
            'maxcor': 20  # Больше кривых для оценки гессиана
        }
        # Запуск оптимизации
        result = minimize(
            fun=self.error_function,
            x0=initial_guess,
            args=(param_names, fixed_params,  [char_types] if isinstance(char_types, str) else char_types, segments),
            bounds=bounds,
            method='L-BFGS-B',  # Хорошо работает с граничными условиями
            options=options
        )
        
        # Проверка условий остановки по изменению параметров
        if 'param_change_percent' in stop_conditions:
            threshold = stop_conditions['param_change_percent']
            for i, (name, val) in enumerate(zip(param_names, result.x)):
                change = 100 * abs(val - initial_guess[i]) / (bounds[i][1] - bounds[i][0])
                if change < threshold:
                    print(f"Optimization stopped: parameter {name} changed less than {threshold}%")
        
        return dict(zip(param_names, result.x))


