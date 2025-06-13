import json
import os

def parse_mdm(file_path):
    main_dict = {
        "ICCAP_INPUTS": [],
        "ICCAP_VALUES": {},
        "column_names": None,
        "measurements_list": []
    }

    with open(file_path, 'r') as file:
        lines = file.readlines()
    nnvars = []

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
            measurement["data"] = measurement["data"][1:]
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
                    splited_line = line.split()
                    if not ("CON" in splited_line and float(splited_line[-1]) == 0):
                        main_dict["ICCAP_INPUTS"].append(line)
                    else:
                        nnvars.append(splited_line[0])
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
                parts = line.split()
                if len(parts) == 3 and parts[1] not in nnvars:
                    var_name = parts[1]
                    var_value = parts[2]
                    measurement["ICCAP_VARs"][var_name] = var_value
            elif line.startswith("#") and main_dict["column_names"] is None:
                main_dict["column_names"] = line
            elif line.startswith("#") and main_dict["column_names"] is not None:
                continue
            else:
                data_values = line.split("\t")
                processed_values = []
                for val in data_values:
                    if val:
                        processed_values.append(float(val))
                measurement["data"].append(processed_values)

    filename = os.path.basename(file_path)
    sections = filename.split("~")
    keys = ["chip_number", "transistor_type", "characteristic", "temperature", "radiation_intensity"]
    parsed_info = dict(zip(keys, sections))
    parsed_info["temperature"] = parsed_info["temperature"].split(".")[0]
    if "radiation_intensity" in parsed_info:
        parsed_info["radiation_intensity"] = parsed_info["radiation_intensity"].split(".")[0]
    parsed_info["path"] = '_'.join(sections)
    parsed_info = parsed_info | main_dict
    return parsed_info