
import matplotlib.pyplot as plt
import numpy as np
from os.path import exists
from counts.count import MOSFET
import time

from ltspice import Ltspice
from PyLTSpice import RawRead
def analyze_spice_raw(raw_file):


    # Загрузка .raw файла
    raw_data = RawRead(raw_file)
    # Проверяем количество запусков (шагов)
    n_steps = len(raw_data.steps)



    
    # Создаем список для хранения данных всех запусков
    vd_all = []
    id_all = []
    
    # Считываем данные для каждого запуска
    for step in range(n_steps):
        try:
            # Получаем данные для текущего шага
            
            vd_values = raw_data.get_wave('V(d)', step=step)
            id_values = raw_data.get_wave('Id(M1)', step=step)

            
            vd_all.append(vd_values)
            id_all.append(id_values)
            
        except Exception as e:
            print(f"Ошибка при обработке шага {step}: {e}")
            continue
    
    # Построение графика
    plt.figure(figsize=(10, 6))
    
    for i, (vd, id_) in enumerate(zip(vd_all, id_all)):
        plt.plot(vd, id_, label=f'Запуск {i+1}')
    
    plt.xlabel('V(d) [V]', fontsize=12)
    plt.ylabel('Id(M1) [A]', fontsize=12)
    plt.title('Зависимость Id(M1) от V(d)', fontsize=14)
    
    if n_steps > 1:
        plt.legend()
    
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.show()




params = {'LEVEL': 1,'VTO':-1.0,'KP':50e-6,'LAMBDA':0.02}
b = MOSFET("Kristal_0p6_waf0chip1_D19n_W100_L1p7_soi_dc_idvd_300K", r"C:\Users\mbudo48\AppData\Local\Programs\ADI\LTspice\LTspice.exe")
b.type = "NMOS"
b.convert_code(fixed_params=params, typ='idvd')
b.callspice('idvd')
analyze_spice_raw('modidvd.raw')