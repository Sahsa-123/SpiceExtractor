from PyQt6 import uic
from PyQt6.QtWidgets import *
from PyQt6.QtGui import *
from PyQt6.QtCore import *
import sys, os, json, numpy, time
import sqlite3
import pyqtgraph as pg
from plotCONST import *

def makedb():
    file_name = "db0.db"
    if not os.path.exists(file_name):
        with open(file_name, "w"):
            pass

def delDb():
    file_name = "db0.db"
    if os.path.exists(file_name):
        os.remove(file_name)

def find_mdm_files(folder_path):
    mdm_files = []  # Создаем пустой список для хранения путей к .mdm файлам

    # Используем os.walk() для рекурсивного обхода всех файлов и папок в указанной директории
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(".mdm"):  # Проверяем, что файл имеет расширение .mdm (регистронезависимо)
                mdm_files.append(os.path.join(root, file))  # Добавляем путь к .mdm файлу в список

    return mdm_files

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
    column_names = data['column_names'][1:].split()
    
    # Определение структуры таблицы
    columns = ", ".join([f"{col} REAL" for col in column_names])
    
    # Создание таблицы
    create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns});"
    cursor.execute(create_table_query)
    
    # Вставка данных измерений
    for measurement in data['measurements_list']:
        row = measurement
        if None not in row and len(measurement) > 0:
            insert_query = f"INSERT INTO {table_name} ({', '.join(column_names)}) VALUES ({', '.join(['?' for _ in range(len(row))])})"
            cursor.execute(insert_query, row)

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
            cursor.execute(f"INSERT INTO {table_name} (INPUTS, VALUES_KEYS, VALUES_VAL) VALUES (?, ?, ?)", values_row)
    
    # Сохранение изменений и закрытие соединения
    conn.commit()
    conn.close()

def parse_mdm(file_path):
    main_dict = {
        "ICCAP_INPUTS": [],
        "ICCAP_VALUES": {},
        "measurements_list": [],
        "column_names": ""
    }

    with open(file_path, 'r') as file:
        lines = file.readlines()

    section = None
    measurement = None
    for line in lines:
        line = line.strip()

        if line == "BEGIN_HEADER":
            section = "header"
            continue
        elif line == "END_HEADER":
            section = None
            continue
        elif line == "BEGIN_DB":
            section = "db"
            measurement = {
                "ICCAP_VARs": {},
                "data": []
            }
            continue
        elif line == "END_DB":
            main_dict["measurements_list"].extend(measurement["data"])
            section = None
            continue

        if section == "header":
            if line.startswith("ICCAP_INPUTS"):
                subsection = "ICCAP_INPUTS"
                continue
            elif line.startswith("ICCAP_OUTPUTS"):
                subsection = "ICCAP_OUTPUTS"
                continue
            elif line.startswith("ICCAP_VALUES"):
                subsection = "ICCAP_VALUES"
                continue

            if subsection == "ICCAP_INPUTS" and section == 'header':
                if line and not line.startswith("ICCAP_OUTPUTS"):
                    main_dict["ICCAP_INPUTS"].append(line)
            elif subsection == "ICCAP_VALUES" and section == 'header':
                if line and not line.startswith("ICCAP_INPUTS"):
                    parts = line.split("\t", 1)
                    if len(parts) == 2:
                        key, value = parts
                        main_dict["ICCAP_VALUES"][key] = value
                    elif len(parts) == 1:
                        key = parts[0]
                        main_dict["ICCAP_VALUES"][key] = None

        elif section == "db":
            if line.startswith("#"):
                if not main_dict["column_names"]:
                    main_dict["column_names"] = line
            elif not line.startswith("ICCAP_VAR"):
                data_values = line.split()
                processed_values = []
                for val in data_values:
                    if val:  # Проверка на пустую строку
                        if "E" in val or "." in val or 'e' in val:
                            processed_values.append(float(val))
                        else:
                            processed_values.append(int(val))
                    else:
                        processed_values.append(None)  # Или любое другое значение для пустых полей
                measurement["data"].append(processed_values)
    path = file_path
    filename = path.split('\\')[-1]
    sections = filename.split("~")  # Разделяем название файла по символу "~"
    keys = ["chip_number", "transistor_type", "characteristic", "temperature", "radiation_intensity"]
    parsed_info = dict(zip(keys, sections))  # Создаем словарь из ключей и значений

    # Исключаем расширение файла из значений температуры и интенсивности радиации
    parsed_info["temperature"] = parsed_info["temperature"].split(".")[0]
    if "radiation_intensity" in parsed_info:
        parsed_info["radiation_intensity"] = parsed_info["radiation_intensity"].split(".")[0]
    parsed_info = parsed_info | main_dict
    parsed_info["path"] = '_'.join(sections)
    return parsed_info

def parse_mdm_filename(path):

    filename = path.split('\\')[-1]

    sections = filename.split("~")  # Разделяем название файла по символу "~"
    keys = ["chip_number", "transistor_type", "characteristic", "temperature", "radiation_intensity"]
    parsed_info = dict(zip(keys, sections))  # Создаем словарь из ключей и значений

    # Исключаем расширение файла из значений температуры и интенсивности радиации
    parsed_info["temperature"] = parsed_info["temperature"].split(".")[0]
    if "radiation_intensity" in parsed_info:
        parsed_info["radiation_intensity"] = parsed_info["radiation_intensity"].split(".")[0]
    parsed_info["path"] = path
    
    return parsed_info

def get_data_from_table(table_name):
    conn = sqlite3.connect('db0.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    data = cursor.fetchall()
    conn.close()
    return data

def get_inputs_from_table(table_name):
    conn = sqlite3.connect('db0.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT INPUTS FROM {table_name} WHERE INPUTS IS NOT NULL")
    data = cursor.fetchall()
    conn.close()
    return data


def compiledload(files, i):
    file = files[i]
    data = parse_mdm(file)
    insert_info_to_table_0(data)
    create_table_data(data)
    create_table_header(data)

class LoadFolderThread(QThread):
    progress = pyqtSignal(int)

    def __init__(self, files):
        super().__init__()
        self.files = files
        self.stop = False
        self.somel = 0

    def run(self):
        for i in range(len(self.files)):
            if self.stop:
                break
            # Здесь выполняется загрузка файлов
            compiledload(self.files, i)
            self.progress.emit(int((i + 1) / len(self.files) * 100))
            self.somel = 1

class Characteristics_chose_widget(QWidget):
    def __init__(self):
        super().__init__()
        uic.loadUi("characteristics_chose_widget.ui", self)
        self.loaded = 0
        self.chip_number_box.currentIndexChanged.connect(self.populate_transistor_type_box)
        self.transistor_type_box.currentIndexChanged.connect(self.populate_characteristic_box)
        self.characteristic_box.currentIndexChanged.connect(self.populate_temperature_box)
        self.temperature_box.currentIndexChanged.connect(self.populate_radiancy_box)

    def populate_chip_number_box(self):
        conn = sqlite3.connect('db0.db')
        try:
            self.chip_number_box.clear()
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT chip_number FROM zero")
            chip_numbers = cursor.fetchall()
            for chip_number in chip_numbers:
                self.chip_number_box.addItem(chip_number[0])
            self.loaded = 1
        except sqlite3.OperationalError:
            pass
        finally:
            conn.close()

    def populate_transistor_type_box(self):
        selected_chip_number = self.chip_number_box.currentText()
        if selected_chip_number:
            self.transistor_type_box.setEnabled(True)
            self.transistor_type_box.clear()

            conn = sqlite3.connect('db0.db')
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT transistor_type FROM zero WHERE chip_number = ?", (selected_chip_number,))
            transistor_types = cursor.fetchall()
            conn.close()

            # Заполняем transistor_type_box значениями transistor_type для выбранного chip_number
            for transistor_type in transistor_types:
                self.transistor_type_box.addItem(transistor_type[0])

    def populate_characteristic_box(self):
        selected_chip_number = self.chip_number_box.currentText()
        selected_transistor_type = self.transistor_type_box.currentText()
        if selected_chip_number and selected_transistor_type:
            self.characteristic_box.setEnabled(True)
            self.characteristic_box.clear()

            conn = sqlite3.connect('db0.db')
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT characteristic FROM zero WHERE chip_number = ? AND transistor_type = ?", (selected_chip_number, selected_transistor_type,))
            characteristics = cursor.fetchall()
            conn.close()

            # Заполняем characteristic_box значениями characteristic для выбранных chip_number и transistor_type
            for characteristic in characteristics:
                self.characteristic_box.addItem(characteristic[0])

    def populate_temperature_box(self):
        selected_chip_number = self.chip_number_box.currentText()
        selected_transistor_type = self.transistor_type_box.currentText()
        selected_characteristic = self.characteristic_box.currentText()
        
        if selected_chip_number and selected_transistor_type and selected_characteristic:
            self.temperature_box.setEnabled(True)
            self.temperature_box.clear()

            conn = sqlite3.connect('db0.db')
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT temperature FROM zero WHERE chip_number = ? AND transistor_type = ? AND characteristic = ?", (selected_chip_number, selected_transistor_type, selected_characteristic,))
            temperatures = cursor.fetchall()
            conn.close()

            # Заполняем temperature_box значениями temperature для выбранных chip_number, transistor_type и characteristic
            for temperature in temperatures:
                self.temperature_box.addItem(temperature[0])

    def populate_radiancy_box(self):
        selected_chip_number = self.chip_number_box.currentText()
        selected_transistor_type = self.transistor_type_box.currentText()
        selected_characteristic = self.characteristic_box.currentText()
        selected_temperature = self.temperature_box.currentText()
        
        if selected_chip_number and selected_transistor_type and selected_characteristic and selected_temperature:
            self.radiancy_box.setEnabled(True)
            self.radiancy_box.clear()
            conn = sqlite3.connect('db0.db')
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT radiation_intensity FROM zero WHERE chip_number = ? AND transistor_type = ? AND characteristic = ? AND temperature = ?", (selected_chip_number, selected_transistor_type, 
                                                                                                                                           selected_characteristic,selected_temperature,))
            radiancys = cursor.fetchall()
            conn.close()

            # Заполняем radiancy_box значениями radiancy для выбранных chip_number, transistor_type, characteristic и temperature
            for radiancy in radiancys:
                self.radiancy_box.addItem(radiancy[0])
                
    def make_url_for_data(self):
        selected_chip_number = self.chip_number_box.currentText()
        selected_transistor_type = self.transistor_type_box.currentText()
        selected_characteristic = self.characteristic_box.currentText()
        selected_temperature = self.temperature_box.currentText()
        selected_radiancy = self.radiancy_box.currentText()
        if selected_chip_number and selected_transistor_type and selected_characteristic and selected_characteristic and selected_temperature:
            if selected_radiancy == '':
                return '_'.join([selected_chip_number, selected_transistor_type, selected_characteristic, selected_temperature]) + '_DATA'
            else:
                return '_'.join([selected_chip_number, selected_transistor_type, selected_characteristic, selected_temperature, selected_radiancy]) + '_DATA'
        return -1  

    def get_transistor_type(self): return self.transistor_type_box.currentText()
    
    def get_chip_number(self): return self.chip_number_box.currentText()
    
    def get_characteristic(self): return self.characteristic_box.currentText()

    def get_temperature(self): return self.temperature_box.currentText()

    def get_radiancy(self): return self.radiancy_box.currentText()

class FolderLoadProgressWidget(QWidget):
    def __init__(self):
        super().__init__()
        uic.loadUi("FolderLoadProgress.ui", self)
        self.current = 0
        self.maxi = 0
        self.progressBar.setValue(0)

class Application(QMainWindow):
    def __init__(self):
        super().__init__()
        uic.loadUi("untitled.ui", self)
        self.Characteristics_chose_widget = None
        self.knopka.triggered.connect(self.loadFolder)
        self.characteristics_chose.aboutToShow.connect(self.show_Characteristics_chose_widget)
        self.clearplot.clicked.connect(self.clear_plot)
        self.plotwidget.setBackground('w')
        self.plotwidget.scene().sigMouseMoved.connect(self.mouse_moved)
        self.someLoaded = 0
        self.plots = list()

        self.filtration = self.findChild(QWidget, 'filtration')
        self.filtration_groups = []
        self.filtrationlist = list()

    def mouse_moved(self, pos):
        mouse_point = self.plotwidget.plotItem.vb.mapSceneToView(pos)
        x = mouse_point.x()
        y = mouse_point.y()
        
        self.position.setText(f"x: {x:.6f}\ny: {y:.6f}")

    def loadFolder(self):
        path = QFileDialog.getExistingDirectory()
        files = find_mdm_files(path)
        self.ProgressWidget = FolderLoadProgressWidget()
        self.ProgressWidget.stopButton.clicked.connect(self.stopLoad)
        self.ProgressWidget.show()
        self.loadFolderThread = LoadFolderThread(files)
        self.loadFolderThread.progress.connect(self.updateProgress)
        self.loadFolderThread.start()

    def updateProgress(self, value):
        self.ProgressWidget.progressBar.setValue(value)
        self.someLoaded = self.loadFolderThread.somel
        if value == 100:
            self.ProgressWidget.hide()

    def stopLoad(self):
        self.loadFolderThread.stop = True
        self.ProgressWidget.hide()

    def show_Characteristics_chose_widget(self):
        if self.Characteristics_chose_widget is None:
            self.Characteristics_chose_widget = Characteristics_chose_widget()
            self.Characteristics_chose_widget.plotButton.clicked.connect(self.add_plot)
        if self.someLoaded == 1:
            self.Characteristics_chose_widget.populate_chip_number_box()
            self.Characteristics_chose_widget.show() 
        else:
            error_box = QMessageBox()
            error_box.setIcon(QMessageBox.Icon.Warning)
            error_box.setWindowTitle("Ошибка")
            error_box.setText("Загрузите измерения.")
            error_box.setStandardButtons(QMessageBox.StandardButton.Ok)
            error_box.exec()
        
    def add_plot(self):
        url = self.Characteristics_chose_widget.make_url_for_data()
        if url != -1:
            data = numpy.array(get_data_from_table(url))
            print(data)
            self.plots.append({
                    "transistor_type": self.Characteristics_chose_widget.get_transistor_type(),
                    "chip_number": self.Characteristics_chose_widget.get_chip_number(),
                    "characteristic": self.Characteristics_chose_widget.get_characteristic(),
                    "temperature": self.Characteristics_chose_widget.get_temperature(),
                    "radiancy": self.Characteristics_chose_widget.get_radiancy(),
                    "INPUTS": get_inputs_from_table(url.replace("DATA", "HEADER")),
                    "measures": data
                })
            self.update_filtrationlist()
            self.populate_filtration()

    def update_filtrationlist(self):
        self.filtrationlist = [
            [], [], [], []
        ]
        for i in self.plots:
            if i["transistor_type"] not in self.filtrationlist[0]:
                self.filtrationlist[0].append(i["transistor_type"])
            if i["chip_number"] not in self.filtrationlist[1]:
                self.filtrationlist[1].append(i["chip_number"])
            if i["characteristic"] not in self.filtrationlist[2]:
                self.filtrationlist[2].append(i["characteristic"])
            if i["temperature"] not in self.filtrationlist[3]:
                self.filtrationlist[3].append(i["temperature"])

    def populate_filtration(self):
        layout = QHBoxLayout(self.filtration)
        self.filtration_groups = []
        for i, checkbox_list in enumerate(self.filtrationlist):
            scroll_area = QScrollArea(self.filtration)
            scroll_area.setWidgetResizable(True)
            
            content_widget = QWidget()
            content_layout = QVBoxLayout(content_widget)
            
            checkboxes = []
            if i == 2: 
                button_group = QButtonGroup(content_widget)
                button_group.setExclusive(True)
                
                for text in checkbox_list:
                    checkbox = QCheckBox(text)
                    checkbox.stateChanged.connect(self.checkbox_state_changed)
                    content_layout.addWidget(checkbox)
                    button_group.addButton(checkbox)
                    checkboxes.append(checkbox)
            else:  # Для остальных групп используем обычные QCheckBox
                for text in checkbox_list:
                    checkbox = QCheckBox(text)
                    checkbox.stateChanged.connect(self.checkbox_state_changed)
                    content_layout.addWidget(checkbox)
                    checkboxes.append(checkbox)
            if len(checkboxes) == 1:
                checkboxes[0].setChecked(True)
                checkboxes[0].setEnabled(False)
            elif len(checkboxes) != 0:
                checkboxes[0].setChecked(True)
                if i != 2:
                    btn_layout = QHBoxLayout()
                    select_all_btn = QPushButton("Выбрать все")
                    select_all_btn.clicked.connect(lambda state, checkboxes=checkboxes: self.toggle_checkboxes(checkboxes, True))
                    deselect_all_btn = QPushButton("Снять выделение")
                    deselect_all_btn.clicked.connect(lambda state, checkboxes=checkboxes: self.toggle_checkboxes(checkboxes, False))
                    btn_layout.addWidget(select_all_btn)
                    btn_layout.addWidget(deselect_all_btn)
                    content_layout.addLayout(btn_layout)
            
            self.filtration_groups.append(checkboxes)
            
            content_widget.setLayout(content_layout)
            scroll_area.setWidget(content_widget)
            layout.addWidget(scroll_area)

        if self.filtration.layout() is not None:
            self.filtration.layout().deleteLater()
        
        self.filtration.setLayout(layout)

    def toggle_checkboxes(self, checkboxes, checked):
        for checkbox in checkboxes:
            checkbox.setChecked(checked)
            
    def checkbox_state_changed(self, state):
        self.plotwidget.clear()

        for measurenum, measure in enumerate(self.plots):
            checks = []
            checkgroup = [measure["chip_number"], measure["transistor_type"], measure["temperature"], measure["characteristic"]]
            for i, group in enumerate(self.filtration_groups):
                checked = [checkbox.text() if checkbox.isChecked() else None for checkbox in group]
                checks.append(True if len(set(checked) & set(checkgroup)) else False)
            if all(checks):
                self.plotwidget.plot(measure["measures"][:,0], measure["measures"][:,1], symbol='o', pen=None, symbolBrush = COLORS[measurenum],
                                    name='_'.join([measure["chip_number"], measure["transistor_type"], measure["temperature"]]))
        self.plotwidget.addLegend()

    def clear_plot(self):
        self.filtrationlist = [
            [], [], [], []
        ]
        self.plots = []
        self.populate_filtration()
        self.plotwidget.clear()

    def closeEvent(self, event):
        delDb()


if __name__ == '__main__':
    makedb()
    app = QApplication(sys.argv)
    ex = Application()
    ex.show()
    sys.exit(app.exec())