import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
def load_data_from_txt(filename):
    """
    Загружает двумерный массив из текстового файла, извлекая только первые два столбца.

    :param filename: Имя файла.
    :return: Двумерный массив NumPy формы (N, 2), где N — количество строк.
    """
    # Загружаем все данные из файла
    all_data = np.loadtxt(filename)
    
    # Извлекаем только первые два столбца (x и y)
    data = all_data[:, :2]
    return data 

interpol_bspline = load_data_from_txt('interpol/interpolated_bspline.txt')
source = load_data_from_txt('interpol/source_v1.txt')
xy_mean6 =  load_data_from_txt('interpol/averaged.txt')

#оставляем только Pдов
#оставляем только b-spline
#вспомнить понимание работы оптимизации, подготовиться к разъяснению 

plt.figure(6)  # Создаем первое окно
plt.scatter(source[:, 0], source[:, 1], color='green', label='source data', marker='^')
plt.scatter(interpol_bspline[:, 0], interpol_bspline[:, 1], label='Interpolated (bspline)', color='red', marker='o')
plt.scatter(xy_mean6[:, 0], xy_mean6[:, 1], color='blue', label='Averaged', marker='x')
plt.xlabel('X')
plt.ylabel('Y')
plt.legend()
plt.grid()

plt.show()
#взять разные пластинки для тестов 

