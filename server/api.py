from fastapi import FastAPI, Query, File, UploadFile, HTTPException
import sqlite3
import plotly.express as px
import plotly.io as pio
import plotly.offline as py
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import json
import numpy as np
import zipfile
import os
from pathlib import Path
from main import makedb, find_mdm_files, insert_info_to_table_0, create_table_data, create_table_header, parse_mdm

app = FastAPI()

UPLOAD_DIR = "uploads"
EXTRACT_DIR = "extracted"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(EXTRACT_DIR, exist_ok=True)

@app.post("/upload-zip/")
async def upload_zip(file: UploadFile = File(...)):
    # Проверяем, что загруженный файл - это zip
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a .zip archive")

    # Путь для сохранения загруженного архива
    archive_path = Path(UPLOAD_DIR) / file.filename

    # Сохраняем файл
    with open(archive_path, "wb") as buffer:
        buffer.write(await file.read())

    # Папка для извлечения файлов
    extract_path = Path(EXTRACT_DIR) / file.filename.rsplit(".", 1)[0]
    os.makedirs(extract_path, exist_ok=True)

    # Распаковываем архив
    try:
        with zipfile.ZipFile(archive_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Failed to extract the archive. Invalid zip file.")

    makedb()
    files = find_mdm_files(EXTRACT_DIR)
    for i in range(len(files)):
        file = files[i]
        data = parse_mdm(file)
        insert_info_to_table_0(data)
        create_table_data(data)
        create_table_header(data)
    
    delete_folders()
    
    return {"message": "File uploaded and extracted successfully", "extracted_to": str(extract_path)}


def delete_folders():
    # Удаляем папки и их содержимое
    for folder in [UPLOAD_DIR, EXTRACT_DIR]:
        for root, dirs, files in os.walk(folder, topdown=False):
            for file in files:
                os.remove(Path(root) / file)
            for dir in dirs:
                os.rmdir(Path(root) / dir)
        os.rmdir(folder)

    # Пересоздаем пустые папки
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    os.makedirs(EXTRACT_DIR, exist_ok=True)


# Добавляем CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # или ["http://10.110.126.170:5500"] для ограниченного доступа
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ваши маршруты API
@app.get("/all_params")
def get_all_params():
    data1 = {
        'chip-number-fieldset': [],
        'inner-nominal-fieldset': [],
        'electric-fieldset': [],
        'temperature-fieldset': []
    }
    conn = sqlite3.connect('db0.db')
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT chip_number FROM zero")
        chip_numbers = cursor.fetchall()
        for chip_number in chip_numbers:
            data1['chip-number-fieldset'].append({'value': chip_number[0]})
        cursor.execute("SELECT DISTINCT transistor_type FROM zero")
        transistor_types = cursor.fetchall()
        for transistor_type in transistor_types:
            data1['inner-nominal-fieldset'].append({'value': transistor_type[0]})
        cursor.execute("SELECT DISTINCT characteristic FROM zero")
        characteristics = cursor.fetchall()
        for characteristic in characteristics:
            data1['electric-fieldset'].append({'value': characteristic[0]})
        cursor.execute("SELECT DISTINCT temperature FROM zero")
        temperatures = cursor.fetchall()
        for temperature in temperatures:
            data1['temperature-fieldset'].append({'value': temperature[0]})
        return data1
    except sqlite3.OperationalError:
        pass
    finally:
        conn.close()

# Остальной код остаётся без изменений

@app.get("/chip_numbers")
def get_all_chip_numbers():
    res = []
    conn = sqlite3.connect('db0.db')
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT chip_number FROM zero")
        chip_numbers = cursor.fetchall()
        for chip_number in chip_numbers:
            res.append(chip_number[0])
        return res
    except sqlite3.OperationalError:
        pass
    finally:
        conn.close()

@app.get("/transistor_type")
def get_transistor_types(chip_number: str):
    res = []
    conn = sqlite3.connect('db0.db')
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT transistor_type FROM zero WHERE chip_number = ?", (chip_number,))
    transistor_types = cursor.fetchall()

    for transistor_type in transistor_types:
        res.append(transistor_type[0])
    
    conn.close()

    return res

@app.get("/characteristic")
def get_characteristic(chip_number: str, transistor_type: str):
    res = []
    conn = sqlite3.connect('db0.db')
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT characteristic FROM zero WHERE chip_number = ? AND transistor_type = ?", (chip_number, transistor_type,))
    characteristics = cursor.fetchall()

    for characteristic in characteristics:
        res.append(characteristic[0])
    
    conn.close()

    return res

@app.get("/temperature")
def get_temperatures(chip_number: str, transistor_type: str, characteristic: str):
    res = []
    conn = sqlite3.connect('db0.db')
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT temperature FROM zero WHERE chip_number = ? AND transistor_type = ? AND characteristic = ?", (chip_number, transistor_type, characteristic,))
    temperatures = cursor.fetchall()

    for temperature in temperatures:
        res.append(temperature[0])
    
    conn.close()

    return res

@app.get("/radiancy")
def get_radiancys(chip_number: str,
                   transistor_type: str,
                     characteristic: str,
                       temperature: str):
    res = []
    conn = sqlite3.connect('db0.db')
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT radiation_intensity FROM zero WHERE chip_number = ? AND transistor_type = ? AND characteristic = ? AND temperature = ?", (chip_number, transistor_type, 
                                                                                                                                                            characteristic,temperature,))
    radiancys = cursor.fetchall()

    for radiancy in radiancys:
        res.append(radiancy[0])
    
    conn.close()

    return res

def make_url_for_database(chip_number: str,
                            transistor_type: str,
                            characteristic: str,
                            temperature: str):
    if chip_number and transistor_type and characteristic and temperature:
        return '_'.join([chip_number, transistor_type, characteristic, temperature]) + '_DATA'
    return -1

def get_data_from_table(table_name):
    conn = sqlite3.connect('db0.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    data = cursor.fetchall()
    conn.close()
    return data


@app.get("/plot")
def get_plot(chip_number: str, transistor_type: str, characteristic: str, temperature: str):
    url = make_url_for_database(chip_number, transistor_type, characteristic, temperature)
    if url != -1:
        data = np.array(get_data_from_table(url))
        t_data = data.transpose()
        print(t_data[:2])
        fig = px.scatter(t_data[:2], x=t_data[0], y=t_data[1], labels={'x': characteristic[-2:], 'y': characteristic[-4:-2]})

        # Сериализация графика в JSON
        plot_json = json.loads(pio.to_json(fig))
        
        return {"plot_json": plot_json}
    
    return {"error": "Invalid parameters"}


@app.get("/plots")
def get_plots(
    chip_numbers: list = Query(), 
    transistor_types: list = Query(), 
    characteristics: list = Query(), 
    temperatures: list = Query()):
    
    all_data = []

    for chip_number in chip_numbers:
        for transistor_type in transistor_types:
            for characteristic in characteristics:
                for temperature in temperatures:
                    table_name = make_url_for_database(chip_number, transistor_type, characteristic, temperature)
                    if table_name == -1:
                        continue

                    try:
                        data = np.array(get_data_from_table(table_name))
                        if data.size == 0:
                            continue
                        t_data = data.transpose()
                        df = pd.DataFrame({
                            "x": t_data[0],
                            "y": t_data[1],
                            "label": f"{chip_number}_{transistor_type}_{characteristic}_{temperature}"
                        })
                        all_data.append(df)
                    except Exception as e:
                        continue

    if not all_data:
        return {"error": "No valid data found for provided parameters"}

    combined_data = pd.concat(all_data)
    fig = px.scatter(
        combined_data, 
        x="x", 
        y="y", 
        color="label", 
        labels={"x": "V", "y": "I", "label": "Data Source"}
    )

    # Сериализация графика в JSON
    plot_json = json.loads(pio.to_json(fig))

    return {"plot_json": plot_json}