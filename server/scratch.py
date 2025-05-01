def family(Data,Heder): # работал будто получил Хедер из этой функции "def parse_mdm(file_path)":
    family_dict = {} # словарь
    NUMBER_ICCAP_INPUT = [] # ключи к нему (не ебу где они у тебя и как выглядят)
    space = None # колличесво измерений
    for line in Heder["ICCAP_INPUTS"]: # ищет колличесво измерений беря строку из словаря
        Array = [] # массив из строки
        Part = line.split()
        Array.extend(Part)
        for i in range(len(Array)-1): # нахожу совпадение с линейностью и главной линией
            if Array[i] == "LIN" and Array[i + 1] == "1":
                space = Array[i + 4]
    delay = 1
    amount = 1
    for string in Data: # Прохожу по всему массиву дата
        NUMBER_ICCAP_INPUT[amount] = "ICCAP_INPUT" + str(amount) # создаю новый ключь к словарю
        family_dict[NUMBER_ICCAP_INPUT[amount]] = string
        if delay == space:
            dela = 0
            amount = amount + 1
        delay = delay + 1
