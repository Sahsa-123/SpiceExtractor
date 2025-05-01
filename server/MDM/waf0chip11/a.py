import json

def parse_mdm_file(file_path):
    # Создаем главный словарь
    main_dict = {}

    with open(file_path, 'r') as mdm_file:
        content = mdm_file.read()

        # Разделяем заголовок и измерения
        header, measurements = content.split('BEGIN_DB')

        # Обработка заголовка
        header_dict = {}
        for line in header.split('\n'):
            if line.startswith('ICCAP_INPUTS'):
                inputs_data = line.split('\t')[1:]
                header_dict['ICCAP_INPUTS'] = inputs_data
            elif line.startswith('ICCAP_VALUES'):
                values_data = dict(item.split() for item in line.split('\t')[1:])
                header_dict['ICCAP_VALUES'] = values_data

        main_dict.update(header_dict)

        # Обработка измерений
        measurements_list = []
        for measurement in measurements.split('END_DB'):
            if measurement.strip():
                measurement_dict = {}
                var_lines, data_lines = measurement.strip().split('\n\n')
                var_data = dict(item.split() for item in var_lines.split('\n'))
                measurement_dict['ICCAP_VAR'] = var_data

                column_names = data_lines.split('\n')[0].split('\t')
                data_values = [line.split('\t') for line in data_lines.split('\n')[1:]]
                measurement_dict['column_names'] = column_names
                measurement_dict['data_values'] = data_values

                measurements_list.append(measurement_dict)

        main_dict['measurements'] = measurements_list

    return main_dict

def save_to_json(data, output_file):
    with open(output_file, 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == '__main__':
    input_mdm_file = 'F:\project\MDM\waf0chip11\Kristal_0p6_waf0chip11~D06p_W35_L3p5~soi_dc_idvd~300K.mdm'
    output_json_file = 'output.json'

    parsed_data = parse_mdm_file(input_mdm_file)
    save_to_json(parsed_data, output_json_file)
    print(f"Data saved to {output_json_file}")
