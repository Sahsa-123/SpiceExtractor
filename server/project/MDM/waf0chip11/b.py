import re
import json

def read_mdm_file(file_path):
    with open(file_path, 'r') as mdm_file:
        content = mdm_file.read()
    return content

def find_sections(content):
    iccap_inputs_match = re.search(r'ICCAP_INPUTS(.*?)ICCAP_OUTPUTS', content, re.DOTALL)
    iccap_values_match = re.search(r'ICCAP_VALUES(.*?)measurements_list', content, re.DOTALL)
    measurements_list_match = re.findall(r'BEGIN_DB(.*?)END_DB', content, re.DOTALL)
    
    iccap_inputs_section = iccap_inputs_match.group(1).strip() if iccap_inputs_match else None
    iccap_values_section = iccap_values_match.group(1).strip() if iccap_values_match else None
    measurements_list = [m.strip() for m in measurements_list_match] if measurements_list_match else []

    return iccap_inputs_section, iccap_values_section, measurements_list

def organize_data(iccap_inputs, iccap_values, measurements_list):
    data_dict = {}
    data_dict['ICCAP_INPUTS'] = iccap_inputs.split('\n')
    # Разберем iccap_values на параметры и добавим их в словарь
    # ...
    data_dict['measurements_list'] = measurements_list
    return data_dict

def save_to_json(data_dict, output_file):
    with open(output_file, 'w') as json_file:
        json.dump(data_dict, json_file, indent=4)

if __name__ == "__main__":
    mdm_file_path = "F:\project\MDM\waf0chip11\Kristal_0p6_waf0chip11~D06p_W35_L3p5~soi_dc_idvd~300K.mdm"
    output_json_file = "output.json"

    mdm_content = read_mdm_file(mdm_file_path)
    iccap_inputs, iccap_values, measurements_list = find_sections(mdm_content)
    organized_data = organize_data(iccap_inputs, iccap_values, measurements_list)
    save_to_json(organized_data, output_json_file)
