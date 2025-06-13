
import ltspice
import matplotlib.pyplot as plt

# Загрузка .raw файла
raw_file = "modidvd.raw"  # Или "generated_rc.raw"
l = ltspice.Ltspice(raw_file)
l.parse()

print(l.get_data('V(vd)'))
print(l.get_data('Id(M1)'))
