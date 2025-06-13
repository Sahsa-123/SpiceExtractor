from optimize.optimize_base import Optimization
from counts.count import MOSFET
import matplotlib.pyplot as plt
import numpy as np
a = Optimization('213342')
a.checkDB()
print(a.steps_available())
# step1 = {"name": "Шаг 1", "index": 1}
# step2 = {"name": "Шаг 2", "index": 2}
# step3 = {"name": "Шаг 3", "index": 3}
# step4 = {"name": "Шаг 4", "index": 4}
# a.steps_add(step1)
# a.steps_add(step2)
# a.steps_add(step3)
# a.steps_add(step4)
# a.steps_delete('otCO8')
swap_steps = [
    {"name": "Шаг 2", "index": 3, "id": 'gVwPP'},
    {"name": "Шаг 3", "index": 2, "id": 'raAgY'}
]
# a.steps_updateIndexes(swap_steps)
update = {
    'L': {'value': 1e-08, 'min': 2.0, 'max': 1.0, 'checked': False},
    'W': {'value': 1.6e-07, 'min': 3.0, 'max': 16, 'checked': True}
}
a.global_table_get()
# print(a.global_table_update(update))
# a.global_table_download()
# a.step_param_table_get('gVwPP')
# a.step_param_table_update('gVwPP', update)
# update_charact ={"IDVD": {
#                 "checked": True,
#                 "xmin": -1.0,
#                 "xmax": -4.0,
#                 "ymin": 0.0,
#                 "ymax": -3.0
#             },}
# a.step_charact_get('gVwPP')
# a.step_charact_update('gVwPP', update_charact)
# a.step_stop_cond_get('gVwPP')
update_cond = {
            'iterNum': 200,
            'relMesErr': 5.0,
            'absMesErr': 0.005,
            'paramDelt': 0
        }
# a.step_stop_cond_update('gVwPP', update_cond)
#params = a.step_get_params_for_model()
# b = MOSFET("Kristal_0p6_waf0chip1_D19n_W100_L1p7_soi_dc_idvd_300K", r"C:\Users\mbudo48\AppData\Local\Programs\ADI\LTspice\LTspice.exe")
# # c.convert_code(a.steps_download_model(), b.get_start_stop_step(), b.vgs)
# b.type = "NMOS"
# # c.callspiceidvd()
# params = {'LEVEL': 1,'VTO':-1.0,'KP':50e-6,'LAMBDA':0.02}
# b.convert_code(fixed_params=params, typ='idvg')
# b.callspice('idvg')
# idvd = b.get_model_results('idvg')
# b.set_measured_data()

# plt.scatter(idvd[:, 0], idvd[:, 1])
# plt.scatter(b.measured_data['IDVG'][:, 0], b.measured_data['IDVG'][:, 1])
# plt.show()
# o = a.step_run('gVwPP')
# b = a.addFiles()
# plt.scatter(b['pointIDVD'][:, 0], b['pointIDVD'][:, 1])
# plt.scatter(o['pointIDVD'][:, 0], o['pointIDVD'][:, 1])
# plt.show()

# print(a.elem_list())
b = a.addFiles('Kristal_0p6_waf0chip10_D16n_W35_L3p5_soi_dc_idvd_300K')
# print(a.upget_name('get'))
o = a.step_run('UELWG')
plt.scatter(o['pointIDVD'][:, 0], o['pointIDVD'][:, 1], label='mod')
plt.scatter(b['pointIDVD'][:, 0], b['pointIDVD'][:, 1], label='real')
plt.legend()
plt.show()