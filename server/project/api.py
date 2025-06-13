import uvicorn
from fastapi import FastAPI, Query, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import sqlite3
import plotly.express as px
import plotly.io as pio
import plotly.offline as py
import plotly.graph_objects as go
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import json
import numpy as np
import zipfile
import os
from pathlib import Path
from dbwork import process_mdm_files_in_directory
from optimize.optimize_base import Optimization

from fastapi.staticfiles import StaticFiles

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

    process_mdm_files_in_directory(EXTRACT_DIR)    

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

    # Получение всех таблиц с нужным префиксом
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE ?", (f'{table_name}%',))
    tables = [row[0] for row in cursor.fetchall()]

    all_data = []

    for table in tables:
        cursor.execute(f"SELECT * FROM {table}")
        data = cursor.fetchall()
        all_data.extend(data)  # Добавляем все строки из таблицы

    conn.close()
    return all_data


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


def add_average_lines_to_figure(fig, df):
    grouped = df.groupby("label")
    for label, group in grouped:
        mean_df = group.groupby("x").agg({"y": "mean"}).reset_index()
        fig.add_trace(go.Scatter(
            x=mean_df["x"],
            y=mean_df["y"],
            mode="lines",
            name=f"{label} (avg)",
            line=dict(dash="dash")
        ))


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
                    except Exception:
                        continue

    if not all_data:
        return {"error": "No valid data found for provided parameters"}

    combined_data = pd.concat(all_data)
    fig = px.scatter(
        combined_data,
        x="x",
        y="y",
        color="label",
        labels={"x": "V", "y": "I", "label": "legend"}
    )

    # Добавление средних линий
    # add_average_lines_to_figure(fig, combined_data)

    # fig.show()

    plot_json = json.loads(pio.to_json(fig))
    return {"plot_json": plot_json}

@app.get("/interpol")
def get_interpol():
    pass


@app.get("/steps")
def get_steps():
    optimiz = Optimization(
        userID=213342
    )
    steps = optimiz.steps_available()
    return steps


@app.get("/steps/params")
def get_steps_params(id: str):
    optimiz = Optimization(
        userID=213342
    )
    params = optimiz.step_param_table_get(id=id)
    return params


@app.post("/steps/params")
def set_steps_params(id: str, step: dict):
    optimiz = Optimization(
        userID=213342
    )
    params = optimiz.step_param_table_update(id=id, dic=step)
    return params


@app.get("/steps/characteristics")
def get_steps_characteristics(id: str):
    optimiz = Optimization(
        userID=213342
    )
    characts = optimiz.step_charact_get(id=id)
    return characts


@app.post("/steps/characteristics")
def set_steps_characteristics(id: str, charact: dict):
    optimiz = Optimization(
        userID=213342
    )
    characts = optimiz.step_charact_update(id=id, dic=charact)
    return characts


@app.get("/steps/stopcond")
def get_steps_stopcond(id: str):
    optimiz = Optimization(
        userID=213342
    )
    stop_conds = optimiz.step_stop_cond_get(id=id)
    return stop_conds


@app.post("/steps/stopcond")
def set_steps_stopcond(id: str, stopcond: dict):
    optimiz = Optimization(
        userID=213342
    )
    stop_conds = optimiz.step_stop_cond_update(id=id, dic=stopcond)
    return stopcond


@app.post("/steps/add")
def add_step(step: dict):
    optimiz = Optimization(
        userID=213342
    )
    steps = optimiz.steps_add(dic=step)
    return steps


@app.delete("/steps/delete")
def delete_step(id: str):
    optimiz = Optimization(
        userID=213342
    )
    steps = optimiz.steps_delete(id=id)
    return steps


@app.post("/steps/change_index")
def change_index(step: dict):
    optimiz = Optimization(
        userID=213342
    )
    steps = optimiz.steps_updateIndexes(step['steps'])
    return steps


@app.get("/download_model")
def get_model():
    optimiz = Optimization(
        userID=213342
    )
    model = optimiz.steps_download_model()
    return model


@app.get("/ParamTable")
def get_param_table():
    optimiz = Optimization(
        userID=213342
    )
    param_table = optimiz.global_table_get()
    return param_table


@app.get("/download_ParamTable")
def download_param_table():
    optimiz = Optimization(
        userID=213342
    )
    t = optimiz.global_table_download()
    
    file_path = f'optimize/downloads/{optimiz.userID}_table.csv'
    
    return FileResponse(
        path=file_path,
        filename=f"{optimiz.userID}_table.csv",
        media_type="text/csv"
    )


@app.post("/update_ParamTable")
def update_param_table(param: dict):
    optimiz = Optimization(
        userID=213342
    )
    up = optimiz.global_table_update(param)
    return up


global_figures = {
    "figures_idvd": [],
    "figures_idvg": []
}


@app.get("/steps/model")
def step_model():
    optimiz = Optimization(
        userID=213342
    )
    res = optimiz.steps_model()
    df = pd.DataFrame({"x": res["pointIDVD"][:,0], "y": res["pointIDVD"][:,1]})
    df['label'] = res["label"]
    df_idvg = pd.DataFrame({"x": res['pointIDVG'][:,0], "y": res["pointIDVG"][:,1]})
    df_idvg['label'] = res["label"]
    fig_idvd = px.scatter(
        df,
        x="x",
        y="y",
        color="label",
        color_discrete_sequence=['red'],
        labels={"x": "V", "y": "I"},
        title=res["label"]
    )
    fig_idvd.update_layout(legend_title_text="legend")
    
    fig_idvg = px.scatter(
        df_idvg,
        x="x",
        y="y",
        color="label",
        color_discrete_sequence=['red'],
        labels={"x": "V", "y": "I"},
        title=res["label"]
    )
    fig_idvg.update_layout(legend_title_text="legend")

    res["pointIDVD"] = json.loads(pio.to_json(fig_idvd))
    res["pointIDVG"] = json.loads(pio.to_json(fig_idvg))

    del(res["label"])
    
    return res


@app.get("/run_step")
def run_step(id: str):
    optimiz = Optimization(
        userID=213342
    )
    res = optimiz.step_run(id)
    df = pd.DataFrame({"x": res["pointIDVD"][:,0], "y": res["pointIDVD"][:,1]})
    df['label'] = res["label"]
    df_idvg = pd.DataFrame({"x": res['pointIDVG'][:,0], "y": res["pointIDVG"][:,1]})
    df_idvg['label'] = res["label"]
    fig_idvd = px.scatter(
        df,
        x="x",
        y="y",
        color="label",
        color_discrete_sequence=['red'],
        labels={"x": "V", "y": "I"},
        title=res["label"]
    )
    fig_idvd.update_layout(legend_title_text="legend")
    
    fig_idvg = px.scatter(
        df_idvg,
        x="x",
        y="y",
        color="label",
        color_discrete_sequence=['red'],
        labels={"x": "V", "y": "I"},
        title=res["label"]
    )
    fig_idvg.update_layout(legend_title_text="legend")
    
    res["pointIDVD"] = json.loads(pio.to_json(fig_idvd))
    res["pointIDVG"] = json.loads(pio.to_json(fig_idvg))

    del(res["label"])

    return res


@app.get("/elem_list")
def get_elem_list():
    optimiz = Optimization(
        userID=213342
    )
    res = optimiz.elem_list()
    return res


@app.get("/add_files")
def add_files_sec_2(name: str):
    optimiz = Optimization(
        userID=213342
    )

    res = optimiz.addFiles(name)
    df = pd.DataFrame({"x": res["pointIDVD"][:,0], "y": res["pointIDVD"][:,1]})
    df['label'] = res["label"]
    df_idvg = pd.DataFrame({"x": res['pointIDVG'][:,0], "y": res["pointIDVG"][:,1]})
    df_idvg['label'] = res["label"]
    fig_idvd = px.scatter(
        df,
        x="x",
        y="y",
        color="label",
        color_discrete_sequence=['blue'],
        labels={"x": "Напряжение на стоке, V", "y": "Ток стока, I"},
        title=res["label"]
    )
    fig_idvd.update_layout(legend_title_text="legend")
    
    fig_idvg = px.scatter(
        df_idvg,
        x="x",
        y="y",
        color="label",
        color_discrete_sequence=['blue'],
        labels={"x": "Напряжение на затворе, V", "y": "Ток стока, I"},
        title=res["label"]
    )
    fig_idvg.update_layout(legend_title_text="legend")
    global_figures["figures_idvd"] = []
    global_figures["figures_idvg"] = []

    res["pointIDVD"] = json.loads(pio.to_json(fig_idvd))
    res["pointIDVG"] = json.loads(pio.to_json(fig_idvg))
    del(res["label"])
    

    return res


def get_combined_plot():
    # Создаем объединенные графики
    combined_idvd = go.Figure()
    combined_idvg = go.Figure()
    
    # Добавляем все графики из хранилища
    for fig in global_figures["figures_idvd"]:
        for trace in fig.data:
            combined_idvd.add_trace(trace)
    
    for fig in global_figures["figures_idvg"]:
        for trace in fig.data:
            combined_idvg.add_trace(trace)
    
    # Обновляем layout (по желанию)
    combined_idvd.update_layout(
        title="Выходная характеристика",
        xaxis_title="Напряжение сток-исток, Vds (В)",
        yaxis_title="Ток стока, Id (А)"
    )
    
    combined_idvg.update_layout(
        title="Зависимость тока стока от напряжения на затворе",
        xaxis_title="Напряжение затвор-исток, Vgs (В)",
        yaxis_title="Ток стока, Id (А)"
    )
    
    # Возвращаем JSON представление графиков
    return {
        "combined_idvd": json.loads(pio.to_json(combined_idvd)),
        "combined_idvg": json.loads(pio.to_json(combined_idvg))
    }


def main():
    uvicorn.run(app, host="127.0.0.1", port=8010)


if __name__ == "__main__":
    main()
