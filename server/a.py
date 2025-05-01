import numpy as np
from math import *
import matplotlib.pyplot as plt

def signal(x):
    return 1.0 + sin(2.0*pi*x) + 2.0 * cos(4.0*pi*x) + 0.5 * cos(6.0*pi*x)

def quant(arr, disc):
    delta=(np.max(arr)-np.min(arr))/disc
    return np.round((arr-np.min(arr))/delta)*delta+np.min(arr)
    
f = float(input('Опорная частота сигнала '))
T = float(input('Временной интервал '))
q = float(input('discretisation '))
n = int(3*2*pi*f*T) 
n1=int(1*2*pi*f*T)
fp = open('data.csv', 'w', encoding='utf-8')

t1_timedisc = np.linspace(0, T, n)
t2_timedisc = np. linspace(0, T, n1)
t_leveldisc = np. linspace(0, T, 10000)
u1_timedisc = [0] * n
u2_timedisc = [0] * n1 
fp.write('t1; u1\n') 

for i in range(n):
    u1_timedisc[i] = signal(f * t1_timedisc[i])
    fp.write('{0: f}; {1: f}\n'.format(t1_timedisc[i], u1_timedisc[i]))    
fp.write('t2; u2\n') 
for i in range(n1):
    u2_timedisc[i] = signal(f * t2_timedisc[i])
    fp.write('{0: f}; {1: f}\n'.format(t2_timedisc[i], u2_timedisc[i]))
    
u1_leveldisc = [0] * 10000
fp.write('t3; u3\n')
for i in range(10000):
    u1_leveldisc[i] = signal(f * t_leveldisc[i])
    fp.write('{0: f}; {1: f}\n'.format(t_leveldisc[i], u1_leveldisc[i]))
    
fp.close()
plt.figure()
plt.subplot(2, 1, 1)
plt.plot(t1_timedisc, u1_timedisc) 
plt.plot(t1_timedisc, u1_timedisc, 'o', color='tab:orange')
plt.vlines(t1_timedisc, 0, u1_timedisc, color='tab:orange', lw=1)
plt.subplot(2, 1, 2)
plt.plot(t2_timedisc, u2_timedisc)
plt.plot(t2_timedisc, u2_timedisc, 'o', color='tab:blue') 
plt.vlines(t2_timedisc, 0, u2_timedisc, color='tab:blue', lw=1)
plt.figure()
plt.subplot(3, 1, 1)
plt.plot(t_leveldisc, quant(u1_leveldisc,1), color='tab:orange') 
plt.subplot(3, 1, 2)
plt.plot(t_leveldisc, quant(u1_leveldisc, 2), color='tab:blue')
plt.subplot(3, 1, 3)
plt.plot(t_leveldisc, quant(u1_leveldisc,3), color='tab:red') 
plt.show()