import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stepsCharactFormProps, stepsCharactFormValues } from './api';
import styles from './stepsCharactForm.module.css';

const stopKeys = ['xmin', 'xmax', 'ymin', 'ymax'] as const;

export const StepsCharactForm: React.FC<stepsCharactFormProps> = ({ stepId }) => {
    // 1. Получаем данные с сервера
    const queryClient = useQueryClient();
    const { data, isFetching } = useQuery<stepsCharactFormValues>({
        queryKey: ['stepsStopCond', stepId],
        queryFn: async () => {
        const res = await fetch(`http://localhost:4000/steps/stopcond?id=${stepId}`);
        if (!res.ok) throw new Error("Ошибка загрузки stopcond");
        return res.json();
        }
    });

    // 2. Инициализируем useForm
    const { register, handleSubmit, reset } = useForm<stepsCharactFormValues>();

    // 3. Подставляем данные (даже если undefined)
    React.useEffect(() => {
        console.log(data)
        reset(data);
    }, [data]);


    // 4. Отправка формы
    const mutation = useMutation({
        mutationFn: async (formData: stepsCharactFormValues) => {
        await fetch('http://localhost:4000/steps/stopcond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: stepId, stopcond: formData }),
        });
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['stepsStopCond', stepId] });
        }
    });

    const onSubmit = (values: stepsCharactFormValues) => {
        mutation.mutate(values);
    };

    if (isFetching) return <div>Загрузка...</div>;

    return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
        <div className={styles.row}>
        <div className={styles.column}>
            <strong>IDVD</strong>
            {stopKeys.map((key) => (
            <div key={`IDVD-${key}`} className={styles.inputGroup}>
                <label>{key}</label>
                <input type="number" step="any" {...register(`IDVD.${key}`)} />
            </div>
            ))}
        </div>

        <div className={styles.column}>
            <strong>IDVG</strong>
            {stopKeys.map((key) => (
            <div key={`IDVG-${key}`} className={styles.inputGroup}>
                <label>{key}</label>
                <input type="number" step="any" {...register(`IDVG.${key}`)} />
            </div>
            ))}
        </div>
        </div>

        <button type="submit">Отправить</button>
    </form>
    );
};
