import os

import os

class MdmFiles:
    def __init__(self):
        self.files = {}
    
    def find_mdm_files(self, folder_path):
        mdm_files = {}  # Создаем пустой словарь для хранения путей к .mdm файлам и их времени изменения

        # Используем os.walk() для рекурсивного обхода всех файлов и папок в указанной директории
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                if file.lower().endswith(".mdm"):  # Проверяем, что файл имеет расширение .mdm (регистронезависимо)
                    file_path = os.path.join(root, file)
                    mdm_files[file_path] = os.path.getmtime(file_path)  # Добавляем путь к .mdm файлу и его время изменения в словарь

        # Определение новых и изменённых файлов
        new_or_modified_files = {file: mtime for file, mtime in mdm_files.items() if file not in self.files or self.files[file] != mtime}
        
        # Обновление self.files
        self.files.update(new_or_modified_files)
        
        return list(new_or_modified_files.keys())