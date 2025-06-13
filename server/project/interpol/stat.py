import numpy as np
from scipy import stats
from scipy.interpolate import make_interp_spline, BSpline
import time

def measure_time(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()  # Засекаем время начала выполнения
        result = func(*args, **kwargs)  # Вызываем целевую функцию
        end_time = time.time()  # Засекаем время окончания выполнения
        execution_time = end_time - start_time  # Вычисляем время выполнения
        print(f"Функция '{func.__name__}' выполнилась за {execution_time:.6f} секунд")
        return result
    return wrapper

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


def interpolate_2d_array_bspline(data, new_x, k=3, s=None):
    """
    Интерполирует двумерный массив с использованием B-spline.

    Параметры:
    ----------
    data : ndarray, shape (N, 2)
        Исходные данные, где первый столбец — X, второй — Y.
    new_x : ndarray
        Новые значения X, для которых вычисляется интерполяция.
    k : int, optional (default=3)
        Степень сплайна (рекомендуется 1 <= k <= 5).
    s : float or None, optional (default=None)
        Параметр сглаживания. Если None — интерполяция точная.
        Если s > 0 — сглаживающий сплайн (чем больше s, тем сильнее сглаживание).

    Возвращает:
    -----------
    interpolated_data : ndarray, shape (M, 2)
        Интерполированные данные, где M = len(new_x).
    """
    x_original = data[:, 0]
    y_original = data[:, 1]

    # Проверка на уникальность и сортировку X (B-spline требует упорядоченных X)
    if not np.all(np.diff(x_original) > 0):
        sort_idx = np.argsort(x_original)
        x_original = x_original[sort_idx]
        y_original = y_original[sort_idx]

    # Создание B-spline интерполятора
    spline = make_interp_spline(x_original, y_original, k=k, bc_type=None)

    # Если задан параметр сглаживания s, используем сглаживающий сплайн
    if s is not None:
        from scipy.interpolate import splrep, splev
        tck = splrep(x_original, y_original, k=k, s=s)
        new_y = splev(new_x, tck)
    else:
        new_y = spline(new_x)

    # Формируем результат
    interpolated_data = np.column_stack((new_x, new_y))

    return interpolated_data

def find_outliers_and_mean(arr1, arr2, confidence=0.95):
    # Извлечение значений X и Y из массивов
    X1, Y1 = arr1[:, 0], arr1[:, 1]
    X2, Y2 = arr2[:, 0], arr2[:, 1]
    
    # Вычисление среднего значения и стандартного отклонения для Y
    mean_Y1, std_Y1 = np.mean(Y1), np.std(Y1)
    mean_Y2, std_Y2 = np.mean(Y2), np.std(Y2)
    
    # Определение доверительных интервалов для Y
    ci_Y1 = stats.norm.interval(confidence, loc=mean_Y1, scale=std_Y1)
    ci_Y2 = stats.norm.interval(confidence, loc=mean_Y2, scale=std_Y2)
    
    # Поиск выбросов в значениях Y
    non_outliers_Y1 = Y1[(Y1 >= ci_Y1[0]) & (Y1 <= ci_Y1[1])]
    non_outliers_Y2 = Y2[(Y2 >= ci_Y2[0]) & (Y2 <= ci_Y2[1])]
    
    # Вычисление среднего значения Y для соответствующих значений X, исключая выбросы
    mean_Y_for_X = []
    for x in np.unique(X1):
        y_values = [y for i, y in enumerate(Y1) if X1[i] == x and (Y1[i] >= ci_Y1[0]) and (Y1[i] <= ci_Y1[1])] + \
                   [y for i, y in enumerate(Y2) if X2[i] == x and (Y2[i] >= ci_Y2[0]) and (Y2[i] <= ci_Y2[1])]
        mean_y = np.mean(y_values)
        mean_Y_for_X.append([x, mean_y])
    
    return np.array(mean_Y_for_X)
# Загрузка данных из файлов
data = load_data_from_txt('interpol\source_05.txt')  # Исходные данные
additional_data = load_data_from_txt('interpol/source.txt')  # Дополнительные данные


interpolated_bspline = interpolate_2d_array_bspline(data, additional_data[:, 0])
np.savetxt('interpol/interpolated_bspline.txt', interpolated_bspline)
interpol_bspline = load_data_from_txt('interpol/interpolated_bspline.txt')
source = load_data_from_txt('interpol/source_v1.txt')
xy_mean6 = find_outliers_and_mean(source, interpol_bspline)
np.savetxt('interpol/averaged.txt', interpolated_bspline)
# выбросы через доверительную вероятность (доверительную вероятность указывать можно, по умолчанию 95%)
# уменьшить количество точек в характеристике и восстановить её разными методами
# тестирование разных способов интерполяции
#RBF AKIMA B-SPLINE -- проверить
#вычисление среднего характеристик с одной сеткой
#объединение кусков в одну систему
