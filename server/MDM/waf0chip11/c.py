import json

def parse_mdm(file_path):
    main_dict = {
        "ICCAP_INPUTS": [],
        "ICCAP_VALUES": {},
        "measurements_list": []
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
                "column_names": "",
                "data": []
            }
            continue
        elif line == "END_DB":
            main_dict["measurements_list"].append(measurement)
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
            if line.startswith("ICCAP_VAR"):
                parts = line.split("\t", 2)
                if len(parts) == 3:
                    var_name = parts[1]
                    var_value = parts[2]
                    measurement["ICCAP_VARs"][var_name] = var_value
            elif line.startswith("#"):
                measurement["column_names"] = line
            else:
                data_values = line.split("\t")
                processed_values = []
                for val in data_values:
                    if val:  # Проверка на пустую строку
                        if "E" in val or "." in val:
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
    parsed_info["path"] = path
    parsed_info = parsed_info | main_dict
    return parsed_info

def save_to_json(data, output_file):
    with open(output_file, 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    mdm_file_path = input("Enter the path to the .mdm file: ")
    output_json_path = input("Enter the path to the output JSON file: ")
    
    data_dict = parse_mdm(mdm_file_path)
    save_to_json(data_dict, output_json_path)
    print(f"Data has been successfully saved to {output_json_path}")
