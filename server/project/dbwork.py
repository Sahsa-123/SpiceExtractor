import sqlite3, os, json
from parse import parse_mdm

def insert_info_to_table_0(data_dict):
    # Define the structure of the table and the expected dictionary keys
    table_columns = ['chip_number', 'transistor_type', 'characteristic', 'temperature', 'radiation_intensity', 'HEADER', 'DATA']
    
    # Extract values from the data_dict or use None if the key is not present
    values = [data_dict.get(column, None) for column in table_columns[:-2]]
    
    # Add values for HEADER and DATA
    values.append(os.path.splitext(os.path.basename(data_dict['path']))[0]+'_HEADER')
    values.append(os.path.splitext(os.path.basename(data_dict['path']))[0]+'_DATA')
    
    # Connect to the SQLite database (creates the database file if it does not exist)
    conn = sqlite3.connect('db0.db')
    cursor = conn.cursor()
    
    # Create the table if it does not exist
    cursor.execute(f'''
    CREATE TABLE IF NOT EXISTS zero (
        chip_number TEXT,
        transistor_type TEXT,
        characteristic TEXT,
        temperature TEXT,
        radiation_intensity TEXT,
        HEADER TEXT,
        DATA TEXT
    )
    ''')
    
    # Check if a similar record already exists in the table
    select_query = f'''
    SELECT 1 FROM zero WHERE 
    chip_number = ? AND 
    transistor_type = ? AND 
    characteristic = ? AND 
    temperature = ? AND 
    radiation_intensity = ?
    '''
    
    cursor.execute(select_query, values[:-2])
    if cursor.fetchone() is None:
        # If no similar record is found, insert the new record into the table
        placeholders = ', '.join(['?' for _ in table_columns])
        cursor.execute(f'''
        INSERT INTO zero ({', '.join(table_columns)}) 
        VALUES ({placeholders})
        ''', values)
    
    # Commit the changes and close the database connection
    conn.commit()
    conn.close()

def create_table_data(data):
    table_name = os.path.splitext(os.path.basename(data['path']))[0]+'_DATA'

    # Подключение к базе данных SQLite
    conn = sqlite3.connect("db0.db")
    cursor = conn.cursor()
    # Извлечение заголовков столбцов из column_names
    column_names = data['column_names'][1:].split() + list(data["measurements_list"][0]["ICCAP_VARs"].keys())
    
    # Определение структуры таблицы
    columns = ", ".join([f"{col} REAL" for col in column_names])
    temp = 0
    for fam in data["measurements_list"]:

        # Создание таблицы
        create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name + f'_{temp}'} ({columns});"
        cursor.execute(create_table_query)

        # Вставка данных измерений
        for measurement in fam['data']:
            if fam['data'].index(measurement) == 0:
                row = measurement + [float(fam["ICCAP_VARs"][i]) for i in fam["ICCAP_VARs"].keys()]
            else:
                row = measurement + [None for i in range(len(list(data["measurements_list"][0]["ICCAP_VARs"].keys())))]
            if len(measurement) > 0:
                insert_query = f"INSERT INTO {table_name + f'_{temp}'} ({', '.join(column_names)}) VALUES ({', '.join(['?' for _ in range(len(row))])})"
                cursor.execute(insert_query, row)
        temp += 1
    # Сохранение изменений и закрытие соединения
    conn.commit()
    conn.close()

def create_table_header(data):
    table_name = os.path.splitext(os.path.basename(data['path']))[0]+'_HEADER'
    # Подключение к базе данных SQLite
    conn = sqlite3.connect("db0.db")
    cursor = conn.cursor()

    # Создание таблицы с нужными столбцами
    create_table_query = f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        INPUTS TEXT,
        VALUES_KEYS TEXT,
        VALUES_VAL TEXT
    );
    """
    cursor.execute(create_table_query)
    
    # Заполнение столбца INPUTS
    for input_data in data['ICCAP_INPUTS']:
        input_row = (input_data, None, None)
        cursor.execute(f"INSERT INTO {table_name} (INPUTS, VALUES_KEYS, VALUES_VAL) VALUES (?, ?, ?)", input_row)
    
    # Заполнение столбцов VALUES_KEYS и VALUES_VAL
    if 'ICCAP_VALUES' in data:
        for key, value in data['ICCAP_VALUES'].items():
            values_row = (None, key, value)
            if value is not None:
                cursor.execute(f"INSERT INTO {table_name} (INPUTS, VALUES_KEYS, VALUES_VAL) VALUES (?, ?, ?)", values_row)
    
    # Сохранение изменений и закрытие соединения
    conn.commit()
    conn.close()

def get_table_data(db_name, table_name):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    # Извлечение всех данных из таблицы
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    
    # Извлечение названий столбцов
    column_names = [description[0] for description in cursor.description]
    
    # Закрытие соединения
    conn.close()
    
    # Разделение данных
    inputs = {}
    data = []
    
    # Проверка, есть ли значения None в остальных строках для каждого столбца
    for col_index, col_name in enumerate(column_names):
        has_none = any(row[col_index] is None for row in rows[1:])
        if has_none:
            # Если есть значения None в остальных строках, добавляем в "Inputs"
            inputs[col_name] = rows[0][col_index]
        else:
            # Если нет значений None в остальных строках, добавляем в "data"
            for row in rows:
                if len(data) < len(rows):
                    data.append([None] * len(column_names))
                data[rows.index(row)][col_index] = row[col_index]
    
    # Удаление пустых строк и столбцов с None из "data"
    data = [[value for value in row if value is not None] for row in data if any(value is not None for value in row)]
    
    # Формирование результирующего словаря
    result = {
        "columns": column_names,
        "Inputs": inputs,
        "data": data
    }
    
    return result

def get_similar_tables(db_name, table_prefix):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    # Запрос для получения всех таблиц с указанным префиксом
    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '{table_prefix}_%'")
    tables = cursor.fetchall()
    
    conn.close()
    
    # Преобразование списка кортежей в список строк
    table_names = [table[0] for table in tables]
    return table_names

def make_url_for_database(chip_number: str,
                            transistor_type: str,
                            characteristic: str,
                            temperature: str):
    if chip_number and transistor_type and characteristic and temperature:
        return '_'.join([chip_number, transistor_type, characteristic, temperature]) + '_DATA'
    return -1

def get_plots(url):
    # url = make_url_for_database(chip_number, transistor_type, characteristic, temperature)
    family = []
    if url != -1:
        urls = get_similar_tables('db0.db', url)
        for url in urls:
            family.append(get_table_data("db0.db", url))

    return family

def process_mdm_files_in_directory(root_dir):
    for root, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.mdm'):
                full_path = os.path.join(root, file)
                try:
                    data = parse_mdm(full_path)
                    insert_info_to_table_0(data)
                    create_table_data(data)
                    create_table_header(data)
                except Exception as e:
                    print(f'❌ Ошибка при обработке файла {file}: {e}')