import numpy as np
import sqlite3
import dbwork
from scipy.signal import convolve
from scipy.signal.windows import gaussian
from PyLTSpice import SimRunner, SpiceEditor, RawRead
from collections import defaultdict
import matplotlib.pyplot as plt
import os


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
        self.steps_idvd = self.get_steps()
        self.mes_idvg = dbwork.get_plots(f"{name.replace('idvd', 'idvg')}_DATA")
        self.vds = [str(i['Inputs']['vd']) for i in self.mes_idvg]
        self.vgs = [str(i['Inputs']['vg']) for i in self.mes_idvd]
        self.steps_idvg = self.get_steps('1')
        self.idvd = ''
        self.idvg = ''
        self.spisePath = path
        self.fill_params()
        self.type = "NMOS" if self.params['TYPE'] == 1 else "PMOS"
        self.runner = SimRunner(output_folder="./temp")  # Папка для временных файло

        plt.style.use('seaborn-v0_8')
        self.fig_size = (10, 6)
        self.font_size = 12
    
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
        i = 0
        while True:
            if None not in results[i]:
                res.append(results[i])
                i += 1
            else:
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
        elif param == 'vg':
            for i in self.steps_idvd:
                if 'vg' in i[0]:
                    i = i[0].split()
                    out[0], out[1], out[2] = float(i[-4]), float(i[-3]), float(i[-1])
        return list(map(str, out))

    def generate_mosfet_model(self, fixed_params, variable_params=None, x=None):
        """
        Генерирует параметры модели MOSFET для LTspice
        
        Args:
            fixed_params (dict): Фиксированные параметры модели
            variable_params (list): Список имен оптимизируемых параметров
            x (np.array): Текущие значения оптимизируемых параметров
            
        Returns:
            dict: Словарь параметров модели
        """
        if variable_params is not None and x is not None:
            variable_dict = dict(zip(variable_params, x))
            return {**fixed_params, **variable_dict}
        return fixed_params

    def create_netlist(self, sim_type, model_params):
        """Создание и сохранение netlist с использованием SpiceEditor"""
        # Создаем временный файл
        netlist_path = os.path.join(self.runner.output_folder, "temp_sim.net")
        
        # Создаем редактор (файл будет создан при сохранении)
        editor = SpiceEditor(netlist_path)
        editor.set_component_value('VD', 'DC 0')  # Источник напряжения
        editor.set_component_value('VG', 'DC 0')  # Источник напряжения
        
        # Добавляем модель MOSFET
        model_def = f".model MOS {self.type}(" + \
                   " ".join(f"{k}={v}" for k, v in model_params.items()) + \
                   ")"
        editor.add_instruction(model_def)
        
        # Добавляем транзистор
        editor.add_instruction(f"M1 D G 0 0 MOS W={self.params['W']} L={self.params['L']}")
        
        # Настройка анализа
        if sim_type == 'idvd':
            vd_start, vd_stop, vd_step = self.get_start_stop_step('vd')
            editor.add_dc_analysis('VD', vd_start, vd_stop, vd_step)
            editor.add_instruction(f".dc VG LIST {' '.join(map(str, self.vgs))}")
        elif sim_type == 'idvg':
            vg_start, vg_stop, vg_step = self.get_start_stop_step('vg')
            editor.add_dc_analysis('VG', vg_start, vg_stop, vg_step)
            editor.add_instruction(f".dc VD LIST {' '.join(map(str, self.vds))}")
        
        editor.add_instruction(".options plotwinsize=0 noopiter")
        
        # Сохраняем netlist
        editor.write_netlist()
        return netlist_path

    def run_simulation(self, sim_type, fixed_params, variable_params=None, x=None):
        """Запуск симуляции с обработкой ошибок"""
        try:
            model_params = self.generate_mosfet_model(fixed_params, variable_params, x)
            netlist_path = self.create_netlist(sim_type, model_params)
            
            # Запускаем симуляцию
            raw_file, log_file = self.runner.run_now(netlist_path, timeout=30)
            
            # Читаем результаты
            if os.path.exists(raw_file):
                return RawRead(raw_file)
            else:
                print(f"Ошибка: файл результатов {raw_file} не создан")
                return None
                
        except Exception as e:
            print(f"Ошибка симуляции: {str(e)}")
            return None

    def _process_results(self, raw_data, sim_type):
        """Обработка результатов симуляции для нового API"""
        results = {}
        
        if sim_type == 'idvd':
            vd = raw_data.get_trace('V(d)').get_time_axis()  # Ось X - напряжение стока
            ids = raw_data.get_trace('Id(M1)').get_wave()    # Ток стока
            
            # Группируем по значениям Vg
            vg_values = set(raw_data.get_trace('V(g)').get_wave())
            results['Vd'] = vd
            
            for vg in sorted(vg_values):
                mask = np.isclose(raw_data.get_trace('V(g)').get_wave(), vg)
                results[f"Vg={vg:.2f}V"] = ids[mask]
                
        elif sim_type == 'idvg':
            vg = raw_data.get_trace('V(g)').get_time_axis()  # Ось X - напряжение затвора
            ids = raw_data.get_trace('Id(M1)').get_wave()    # Ток стока
            
            # Группируем по значениям Vd
            vd_values = set(raw_data.get_trace('V(d)').get_wave())
            results['Vg'] = vg
            
            for vd in sorted(vd_values):
                mask = np.isclose(raw_data.get_trace('V(d)').get_wave(), vd)
                results[f"Vd={vd:.2f}V"] = ids[mask]
        
        return results

    def _plot_idvd(self, results, title):
        """График ID-VD характеристик с проверкой структуры данных"""
        if not isinstance(results, dict):
            raise ValueError("Results должен быть словарём")
        
        if 'Vd' not in results:
            raise KeyError("Отсутствует ключ 'Vd' в результатах")
        
        plt.figure(figsize=self.fig_size)
        
        for label, ids in results.items():
            if label == 'Vd':
                continue
                
            if not isinstance(ids, (np.ndarray, list)):
                print(f"Пропуск {label}: неверный тип данных")
                continue
                
            if len(results['Vd']) != len(ids):
                print(f"Пропуск {label}: несоответствие размеров данных")
                continue
                
            plt.plot(results['Vd'], np.array(ids)*1e6, 
                    label=label, 
                    linewidth=2)
        
        plt.xlabel('Drain Voltage (V)', fontsize=self.font_size)
        plt.ylabel('Drain Current (μA)', fontsize=self.font_size)
        plt.title(title or 'ID-VD Characteristics', fontsize=self.font_size+2)
        plt.grid(True, linestyle='--', alpha=0.6)
        plt.legend()
        plt.xlim(left=0)
        plt.ylim(bottom=0)

    def plot_results(self, results, sim_type, title=None):
        if results is None:
            print("Нет данных для построения графика")
            return
        
        plt.figure(figsize=self.fig_size)
        
        if sim_type == 'idvd':
            self._plot_idvd(results, title)
        elif sim_type == 'idvg':
            self._plot_idvg(results, title)
        else:
            raise ValueError(f"Неизвестный тип симуляции: {sim_type}")
        
        plt.tight_layout()
        if title:
            plt.savefig(f"{title.replace(' ', '_')}.png")
        plt.show()

    def _plot_idvg(self, results, title):
        """График ID-VG характеристик"""
        for label, ids in results.items():
            if label == 'Vg':
                continue
            plt.plot(results['Vg'], ids*1e6, label=label, linewidth=2)
            
        plt.xlabel('Gate Voltage (V)', fontsize=self.font_size)
        plt.ylabel('Drain Current (μA)', fontsize=self.font_size)
        plt.title(title or 'ID-VG Characteristics', fontsize=self.font_size+2)
        plt.grid(True, linestyle='--', alpha=0.6)
        plt.legend()
        plt.xlim(left=0)
        plt.ylim(bottom=0)



fixed_params = {
    'VTO': 0.5,
    'KP': 120e-6,
    'LAMBDA': 0.05,
    'GAMMA': 0.3,
    'PHI': 0.7
}
simulator = MOSFET("Kristal_0p6_waf0chip1_D19n_W100_L1p7_soi_dc_idvd_300K", r"C:\Users\mbudo48\AppData\Local\Programs\ADI\LTspice\LTspice.exe")
print("Running ID-VD simulation...")
idvd_results = simulator.run_simulation('idvd', fixed_params)
simulator.plot_results(idvd_results, 'idvd', 'NMOS ID-VD Characteristics')

# print("Running ID-VG simulation...")
# idvg_results = simulator.run_simulation('idvg', fixed_params)
# simulator.plot_results(idvg_results, 'idvg', 'NMOS ID-VG Characteristics')
