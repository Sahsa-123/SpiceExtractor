import sqlite3
import numpy
import json, csv
import os, random, string
from counts.count import MOSFET
import matplotlib.pyplot as plt

def fstf(s):
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
    # Ищем приставку в начале строки (например, "k" в "kg")
    for prefix in sorted(unit_multipliers.keys(), key=len, reverse=True):
        if s.endswith(prefix):
            number = float(s[:-len(prefix)])
            return number * unit_multipliers[prefix]
    return float(s)  # если приставки нет

spicepath = os.path.abspath(os.path.join(os.path.dirname(__file__), "LTSpice/LTspice.exe"))

class Optimization:
    def __init__(self, userID):
        self.baseName = f'optimize/databases/{userID}_second.db'
        self.userID = userID
        self.stepsIDs = []
        self.checkDB()
        self.transName = None

    def checkDB(self):
        if not os.path.exists(self.baseName):
                # Создаём все необходимые директории, если их нет
                os.makedirs(os.path.dirname(self.baseName), exist_ok=True)
                
                # Создаём файл
                with open(self.baseName, 'w') as f:
                    pass  # Просто создаём пустой файл
                
                return True
        return False
    
    def steps_available(self):
        conn = None
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # Проверяем существование таблицы
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='steps';")
            table_exists = cursor.fetchone()
            
            if not table_exists:
                # Создаём таблицу, если её нет
                cursor.execute("""
                    CREATE TABLE steps (
                        name TEXT,
                        "index" INTEGER,
                        id TEXT
                    );
                """)
                conn.commit()
                return []
            
            # Получаем все данные из таблицы
            cursor.execute('SELECT name, "index", id FROM steps;')
            rows = cursor.fetchall()
            self.stepsIDs = [i[2] for i in rows]
            # Преобразуем строки в список словарей
            result = [
                {"name": row[0], "index": row[1], "id": row[2]}
                for row in rows
            ]
            
            return result
            
        except sqlite3.Error as e:
            print(f"Ошибка при работе с SQLite: {e}")
            return []
        finally:
            if conn:
                conn.close()

    def steps_add(self, dic):
        conn = None
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            # Генерируем уникальный индекс
            self.steps_available()
            while True:
                # Генерируем случайный индекс (буквы и цифры)
                Id = ''.join(random.choices(string.ascii_letters + string.digits, k=5))
                if Id not in self.stepsIDs:
                    break
            
            # Вставляем новую запись
            cursor.execute(
                'INSERT INTO steps (name, "index", id) VALUES (?, ?, ?)',
                (dic["name"], dic["index"], Id)
            )
            conn.commit()
            
            return 0
        except sqlite3.Error as e:
            return {
                'success': False,
                'message': f'Ошибка SQLite: {str(e)}',
                'index': '',
                'id': id
            }
        finally:
            if conn:
                conn.close()

    def steps_delete(self, id):
        conn = None
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()

            # 1. Удаление таблиц, содержащих target_id в названии
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            all_tables = [row[0] for row in cursor.fetchall()]
            
            for table in all_tables:
                if id in table:
                    cursor.execute(f"DROP TABLE IF EXISTS \"{table}\";")

            # 2. Получаем индекс удаляемой строки из таблицы steps
            cursor.execute('SELECT "index" FROM steps WHERE id = ?;', (id,))
            row = cursor.fetchone()
            deleted_index = row[0] if row else None

            # 3. Удаляем строку из таблицы steps
            if deleted_index is not None:
                cursor.execute('DELETE FROM steps WHERE id = ?;', (id,))

                # 4. Обновляем индексы для строк с бОльшими индексами
                cursor.execute('UPDATE steps SET "index" = "index" - 1 WHERE "index" > ?;', (deleted_index,))
            conn.commit()

        except sqlite3.Error as e:
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()

        return 0
    
    def steps_updateIndexes(self, l):
        conn = None
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # Получаем все существующие ID из базы
            cursor.execute('SELECT id FROM steps;')    
            # Обновляем записи по одному
            for item in l:
                cursor.execute(
                    'UPDATE steps SET "index" = ?, name = ? WHERE id = ?',
                    (item['index'], item['name'], item['id']))
            conn.commit()     
        except sqlite3.Error as e:
            conn.rollback()
        finally:
            if conn:
                conn.close()
        
        return 0

    def global_table_get(self):
        result = {}
        conn = None
        
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # Проверяем существование таблицы
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='global_table';")
            table_exists = cursor.fetchone()
            
            if not table_exists:
                # Создаем таблицу если ее нет
                cursor.execute("""
                    CREATE TABLE global_table (
                        name TEXT PRIMARY KEY,
                        value REAL,
                        min REAL,
                        max REAL
                    );
                """)
                
                # Заполняем таблицу данными из CSV файла

                with open('optimize/init.csv', mode='r', encoding='utf-8') as csv_file:
                    csv_reader = csv.DictReader(csv_file, delimiter=';')
                    for row in csv_reader:
                        cursor.execute(
                            "INSERT INTO global_table (name, value, min, max) VALUES (?, ?, 0, 0)",
                            (row['name'], float(row['value'])))
                    conn.commit()

            
            # Получаем все данные из таблицы
            cursor.execute("SELECT name, value, min, max FROM global_table;")
            rows = cursor.fetchall()
            
            # Формируем результат
            result = {
                row[0]: {
                    'value': row[1],
                    'min': row[2],
                    'max': row[3]
                }
                for row in rows
            }
            
        except sqlite3.Error as e:
            print(f"Ошибка базы данных: {e}")
        except Exception as e:
            print(f"Ошибка при обработке CSV файла: {e}")
        finally:
            if conn:
                conn.close()
        
        return result
    
    def global_table_update(self, dic):
        conn = None
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
 
            # Обновляем записи по одной
            for name, values in dic.items():
                cursor.execute(
                    """UPDATE global_table 
                    SET value = ?, min = ?, max = ? 
                    WHERE name = ?""",
                    (values['value'], values['min'], values['max'], name)
                )

            conn.commit()
            
        except sqlite3.Error as e:
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()
        return 0
    
    def global_table_download(self):
        conn = None
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # Получаем все данные из таблицы
            cursor.execute("SELECT name, value, min, max FROM global_table ORDER BY name;")
            rows = cursor.fetchall()
            
            # Записываем данные в CSV файл
            with open(f'optimize/downloads/{self.userID}_table.csv', 'w', newline='', encoding='utf-8-sig') as csvfile:
                # Используем разделитель точка с запятой
                writer = csv.writer(csvfile, delimiter=';')
                
                # Записываем заголовки
                writer.writerow(['name', 'value', 'min', 'max'])
                
                # Записываем данные
                for row in rows:
                    writer.writerow(row)
            
        finally:
            if conn:
                conn.close()
        
        return 0
    
    def step_param_table_get(self, id):
        result = {}
        table_name = f"{id}_paramtable"
        conn = None
        
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # Проверяем существование целевой таблицы
            cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (table_name,))
            table_exists = cursor.fetchone()
            
            if not table_exists:
                # Создаем новую таблицу как копию global_table с добавлением поля checked
                cursor.execute(f"""
                    CREATE TABLE "{table_name}" (
                        name TEXT PRIMARY KEY,
                        value REAL NOT NULL,
                        min REAL DEFAULT 0,
                        max REAL DEFAULT 0,
                        checked INTEGER DEFAULT 0
                    );
                """)
                
                # Копируем данные из global_table
                self.global_table_get()
                cursor.execute(f"""
                    INSERT INTO "{table_name}" (name, value, min, max)
                    SELECT name, value, min, max FROM global_table;
                """)
                conn.commit()
            
            # Получаем все данные из таблицы
            cursor.execute(f'SELECT name, value, min, max, checked FROM "{table_name}";')
            rows = cursor.fetchall()
            
            # Формируем результат
            result = {
                row[0]: {
                    'checked': bool(row[4]),
                    'value': row[1],
                    'min': row[2],
                    'max': row[3]
                }
                for row in rows
            }
            
        finally:
            if conn:
                conn.close()
        
        return result

    def step_param_table_update(self, id, dic):
        table_name = f"{id}_paramtable"
        conn = None     
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # 2. Получаем текущие значения из param_table для сравнения
            cursor.execute(f'SELECT name, value FROM "{table_name}";')
            current_values = {row[0]: row[1] for row in cursor.fetchall()}
            
            # 4. Обновляем данные
            for name, data in dic.items():
                try:
                    # Проверяем, изменилось ли значение value
                    
                    # Обновляем param_table
                    cursor.execute(
                        f"""UPDATE "{table_name}" 
                        SET checked = ?, value = ?, min = ?, max = ? 
                        WHERE name = ?""",
                        (int(data['checked']), data['value'], data['min'], data['max'], name)
                    )

                    # Если value изменилось, обновляем global_table
                    if data['value'] != current_values[name]:
                        cursor.execute(
                            "UPDATE global_table SET value = ? WHERE name = ?",
                            (data['value'], name)
                        )

                except sqlite3.Error as e:
                    return f"Ошибка при обновлении {name}: {str(e)}"
            
            conn.commit()
            
        except sqlite3.Error as e:
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()
        
        return 0

    def step_charact_get(self, id):
        # Стандартные параметры для инициализации таблицы
        DEFAULT_VALUES = {
            "IDVD": {
                "checked": False,
                "xmin": 0.0,
                "xmax": 0.0,
                "ymin": 0.0,
                "ymax": 0.0
            },
            "IDVG": {
                "checked": False,
                "xmin": 0.0,
                "xmax": 0.0,
                "ymin": 0.0,
                "ymax": 0.0
            }
        }
        
        result = {}
        table_name = f"{id}_charact"
        conn = None
        
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # Проверяем существование таблицы
            cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (table_name,))
            table_exists = cursor.fetchone()
            
            if not table_exists:
                # Создаем новую таблицу
                cursor.execute(f"""
                    CREATE TABLE "{table_name}" (
                        name TEXT PRIMARY KEY,
                        checked INTEGER DEFAULT 0,
                        xmin REAL DEFAULT 0.0,
                        xmax REAL DEFAULT 0.0,
                        ymin REAL DEFAULT 0.0,
                        ymax REAL DEFAULT 0.0
                    );
                """)
                
                # Заполняем стандартными значениями
                for name, params in DEFAULT_VALUES.items():
                    cursor.execute(
                        f"""INSERT INTO "{table_name}" 
                        (name, checked, xmin, xmax, ymin, ymax)
                        VALUES (?, ?, ?, ?, ?, ?)""",
                        (name, int(params['checked']), params['xmin'], params['xmax'], 
                        params['ymin'], params['ymax']))
                conn.commit()
            
            # Получаем все данные из таблицы
            cursor.execute(f'SELECT name, checked, xmin, xmax, ymin, ymax FROM "{table_name}";')
            rows = cursor.fetchall()
            
            # Формируем результат
            result = {
                row[0]: {
                    'checked': bool(row[1]),
                    'xmin': row[2],
                    'xmax': row[3],
                    'ymin': row[4],
                    'ymax': row[5]
                }
                for row in rows
            }
            
        finally:
            if conn:
                conn.close()
        
        return result
    
    def step_charact_update(self, id, dic):
        table_name = f"{id}_charact"
        conn = None
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # Получаем список существующих имен в таблице
            cursor.execute(f'SELECT name FROM "{table_name}";')

            # Обновляем данные для существующих имен
            for name, data in dic.items():
                cursor.execute(
                    f"""UPDATE "{table_name}" 
                    SET checked = ?, 
                        xmin = ?, 
                        xmax = ?, 
                        ymin = ?, 
                        ymax = ?
                    WHERE name = ?""",
                    (
                        int(data['checked']),
                        data['xmin'],
                        data['xmax'],
                        data['ymin'],
                        data['ymax'],
                        name
                    )
                )           
            conn.commit()
            
        except sqlite3.Error as e:
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()
        return 0
    
    def step_stop_cond_get(self, id):
        # Стандартные значения для инициализации таблицы
        DEFAULT_VALUES = {
            'iterNum': 0,
            'relMesErr': 0.0,
            'absMesErr': 0.0,
            'paramDelt': 0.0
        }
        
        result = {}
        table_name = f"{id}_stopcond"
        conn = None
        
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # Проверяем существование таблицы
            cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (table_name,))
            table_exists = cursor.fetchone()
            
            if not table_exists:
                # Создаем новую таблицу с одной строкой
                cursor.execute(f"""
                    CREATE TABLE "{table_name}" (
                        iterNum INTEGER DEFAULT 0,
                        relMesErr REAL DEFAULT 0.0,
                        absMesErr REAL DEFAULT 0.0,
                        paramDelt REAL DEFAULT 0.0
                    );
                """)
                
                # Вставляем стандартные значения
                cursor.execute(
                    f"""INSERT INTO "{table_name}" 
                    (iterNum, relMesErr, absMesErr, paramDelt)
                    VALUES (?, ?, ?, ?)""",
                    (
                        DEFAULT_VALUES['iterNum'],
                        DEFAULT_VALUES['relMesErr'],
                        DEFAULT_VALUES['absMesErr'],
                        DEFAULT_VALUES['paramDelt']
                    )
                )
                conn.commit()
            
            # Получаем данные из таблицы (должна быть только одна строка)
            cursor.execute(f'SELECT iterNum, relMesErr, absMesErr, paramDelt FROM "{table_name}" LIMIT 1;')
            row = cursor.fetchone()
            
            if row:
                result = {
                    'iterNum': row[0],
                    'relMesErr': row[1],
                    'absMesErr': row[2],
                    'paramDelt': row[3]
                }
            else:
                # Если по какой-то причине строк нет, возвращаем значения по умолчанию
                result = DEFAULT_VALUES.copy()
            
        except sqlite3.Error as e:
            result = DEFAULT_VALUES.copy()
        except Exception as e:
            result = DEFAULT_VALUES.copy()
        finally:
            if conn:
                conn.close()
        
        return result
    
    def step_stop_cond_update(self, id, dic):
        table_name = f"{id}_stopcond"
        conn = None
        try:
            conn = sqlite3.connect(self.baseName)
            cursor = conn.cursor()
            
            # Обновляем параметры (в таблице всегда одна строка)
            cursor.execute(
                f"""UPDATE "{table_name}" 
                SET iterNum = ?,
                    relMesErr = ?,
                    absMesErr = ?,
                    paramDelt = ?
                """,
                (
                    int(dic['iterNum']),
                    float(dic['relMesErr']),
                    float(dic['absMesErr']),
                    float(dic['paramDelt'])
                )
            )
            
            conn.commit()
            
        except sqlite3.Error as e:
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()
        
        return 0
    
    def steps_download_model(self):
        conn = sqlite3.connect(self.baseName)
        cursor = conn.cursor()
        
        # Получаем все параметры из таблицы
        cursor.execute("SELECT name, value FROM global_table")
        rows = cursor.fetchall()
        conn.close()
        params = {name: value for name, value in rows}

        
        if not params:
            return ""
        
        # Формируем заголовок модели
        lines = [f".model nchs nmos "]
        current_line = lines[0]
        
        for name, value in params.items():
            # Обрабатываем пустые значения (None или пустая строка)
            if value is None or value == "":
                param_str = f"{name}=0"  # LTspice обычно требует значения для всех параметров
            else:
                param_str = f"{name}={value}"
            
            # Проверяем, нужно ли начинать новую строку
            if len(current_line) + len(param_str) > 70:  # Ограничение длины строки
                lines.append(f"+ {param_str}")
                current_line = lines[-1]
            else:
                if lines[-1] == current_line:
                    # Первый параметр после заголовка
                    lines[-1] += f" {param_str}"
                else:
                    # Добавляем к последней строке
                    lines[-1] += f" {param_str}"
                current_line = lines[-1]
        
        model_text = '\r\n'.join(lines)
        
        with open(f'optimize/downloads/{self.userID}_model.mod', 'w') as f:
            f.write(model_text)
        
        return model_text
    
    def steps_model_param_get(self):
        conn = sqlite3.connect(self.baseName)
        cursor = conn.cursor()
        
        # Получаем все параметры из таблицы
        cursor.execute("SELECT name, value FROM global_table")
        rows = cursor.fetchall()
        conn.close()
        params = {name: value for name, value in rows}
        return params
    
    def steps_model(self):
        a = MOSFET(self.upget_name('get'), spicepath)
        idvd = None
        idvg = None
        a.convert_code(self.steps_model_param_get(), typ='idvd')
        idvd = a.run_ltspice(typ='idvd')
        a.convert_code(self.steps_model_param_get(), typ='idvg')
        idvg = a.run_ltspice(typ='idvg')
        return {
            'label': 'Global model',
            "pointIDVD": idvd,
            "pointIDVG": idvg,
        } #нумберы я пока ещё не делал, передавай 0 на серв #да и графики с текущей базой он какие-то херовые рисует
    
    def step_run(self, id):
        a = MOSFET(self.upget_name('get'), spicepath)
        # Запрашиваем из таблицы параметры, выбранные для оптимизации
        table_name = f'"{id}_paramtable"'
        params = dict()
        conn = sqlite3.connect(self.baseName)
        cursor = conn.cursor()
        query = f'SELECT name, min, max FROM {table_name} WHERE checked = 1'
        cursor.execute(query) 
        # Формируем результат
        for name, min_val, max_val in cursor.fetchall():
            params[name] = (min_val, max_val)
        conn.close()
        
        fixed_params = dict()
        conn = sqlite3.connect(self.baseName)
        cursor = conn.cursor()
        query = f'SELECT name, value FROM {table_name} WHERE checked = 0'
        cursor.execute(query) 
        for name, value in cursor.fetchall():
            fixed_params[name] = value
        # Формируем результат
        conn.close()

        table_name = f'"{id}_charact"'
        charact_list = []
        charact_dict = {}
        conn = sqlite3.connect(self.baseName)
        cursor = conn.cursor()
        
        # Выбираем все записи с checked=1 (TRUE)
        query = f'SELECT name, xmin, xmax, ymin, ymax FROM {table_name} WHERE checked = 1'
        cursor.execute(query)
        
        for name, xmin, xmax, ymin, ymax in cursor.fetchall():
            charact_list.append(name)
            charact_dict[name] = {
                'x': (xmin, xmax),
                'y': (ymin, ymax)
            }
        conn.close()

        table_name = f'"{id}_stopcond"'
        conn = sqlite3.connect(self.baseName)
        cursor = conn.cursor()
        stop_cond = {
            'max_iter': 0,
            'abs_tol': 0.0,
            'rel_tol': 0.0,
            'param_change_percent': 0.0
        }
        # Получаем первую запись из таблицы (предполагаем, что она одна)
        query = f'SELECT iterNum, relMesErr, absMesErr, paramDelt FROM {table_name} LIMIT 1'
        cursor.execute(query)
        
        row = cursor.fetchone()
        if row:
            stop_cond = {
                'max_iter': row[0],
                'rel_tol': row[1],
                'abs_tol': row[2],
                'param_change_percent': row[3]
            }

        out = a.optimize(fixed_params=fixed_params,
                         params_dict=params,
                    char_types=charact_list,
                    segments=charact_dict,
                    stop_conditions=stop_cond
        )
        paramstomodel = {}
        for i in out.keys():
            paramstomodel[i] = float(out[i])
            params[i] = {'checked': 1, 'value': float(out[i]), 'min': list(params[i])[0], 'max': list(params[i])[1]}
        self.step_param_table_update(id, params)
        
        simidvg = {
            'label': 'LTspice result',
            'pointIDVD': self.steps_model()["pointIDVD"],
            'errIDVD': 0.01,
            'pointIDVG': self.steps_model()["pointIDVG"],
            'errIDVG': 0.01
        }


        return simidvg

    #пока вместо загрузки файлов такая заглушка стоит
    def addFiles(self, name):
        a = MOSFET(name, spicepath)
        self.upget_name(mov='upload', name=name)
        a.set_measured_data()
        out = {
            'label': 'uploaded',
            'pointIDVD': a.measured_data["IDVD"],
            'errIDVD': 0.01,
            'pointIDVG': a.measured_data['IDVG'],
            'errIDVG': 0.01
        }
        return out
    
    def elem_list(self):
        from collections import defaultdict
        conn = sqlite3.connect('db0.db')
        cursor = conn.cursor()
        
        # Получаем все таблицы из базы данных
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        # Словарь для хранения информации о наличии таблиц
        measurements = defaultdict(lambda: {
            'idvd_data': False,
            'idvg_data': False,
            'idvd_header': False,
            'idvg_header': False
        })
        
        # Анализируем каждую таблицу
        for table in tables:
            if '_soi_dc_idvd_' in table:
                if '_DATA_' in table:
                    base_name = table.split('_DATA_')[0]
                    measurements[base_name]['idvd_data'] = True
                elif '_HEADER' in table:
                    base_name = table.split('_HEADER')[0]
                    measurements[base_name]['idvd_header'] = True
            elif '_soi_dc_idvg_' in table:
                if '_DATA_' in table:
                    base_name = table.replace('_idvg_', '_idvd_').split('_DATA_')[0]
                    measurements[base_name]['idvg_data'] = True
                elif '_HEADER' in table:
                    base_name = table.replace('_idvg_', '_idvd_').split('_HEADER')[0]
                    measurements[base_name]['idvg_header'] = True
        
        # Фильтруем имена, для которых есть все 4 типа таблиц
        valid_measurements = [
            name for name, flags in measurements.items()
            if flags['idvd_data'] and flags['idvg_data'] 
            and flags['idvd_header'] and flags['idvg_header']
        ]
        
        conn.close()
        return sorted(valid_measurements)

    def upget_name(self, mov='upload', name=None):
        basename = self.baseName
        if mov == 'upload' and name is not None:
            # Режим загрузки имени
            conn = sqlite3.connect('db0.db')
            cursor = conn.cursor()
            
            # Проверяем существование таблицы
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='uploadedmes'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                # Таблица существует - обновляем значение
                cursor.execute("UPDATE uploadedmes SET name = ?", (name,))
            else:
                # Таблица не существует - создаем и вставляем значение
                cursor.execute("CREATE TABLE uploadedmes (name TEXT)")
                cursor.execute("INSERT INTO uploadedmes (name) VALUES (?)", (name,))
            
            conn.commit()
            conn.close()
            
        elif mov == 'get':
            # Режим получения имени
            conn = sqlite3.connect('db0.db')
            cursor = conn.cursor()
            
            try:
                # Пытаемся получить имя из таблицы
                cursor.execute("SELECT name FROM uploadedmes LIMIT 1")
                result = cursor.fetchone()
                
                if result:
                    return result[0]
                else:
                    raise ValueError("Не загружены измерения (таблица пуста)")
                    
            except sqlite3.OperationalError:
                # Таблица не существует
                raise ValueError("Не загружены измерения (таблица отсутствует)")
                
            finally:
                conn.close()