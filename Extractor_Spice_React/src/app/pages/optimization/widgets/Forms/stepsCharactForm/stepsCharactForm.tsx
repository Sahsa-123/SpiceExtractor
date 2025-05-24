import React, { useEffect } from 'react';
import { useForm, Path } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* local dependencies */
import { StepsCharactFormProps } from './api';
import { StepsCharactSchemaType } from './charactSchema';
import { fetchStepsCharact } from './webAPI';
import styles from './stepsCharactForm.module.css';
/* local dependencies */

export const StepsCharactForm: React.FC<StepsCharactFormProps> = ({
  stepId,
  config,
  outerStyles = null,
}) => {
  const { host, endpoints } = config;
  const queryClient = useQueryClient();

  const {
    data,
    isFetching,
    isError,
  } = useQuery<StepsCharactSchemaType>({
    queryKey: ['stepsCharact', stepId],
    queryFn: () => fetchStepsCharact(stepId, host, endpoints.get),
  });

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<StepsCharactSchemaType>();

  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (formData: StepsCharactSchemaType) => {
      await fetch(`${host}/${endpoints.post}?id=${stepId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stepsCharact', stepId] });
    },
  });

  const onSubmit = (values: StepsCharactSchemaType) => {
    mutation.mutate(values);
  };

  // 📌 UI состояния
  if (isFetching) return <div>Загрузка...</div>;
  if (isError || !data) return <div>Ошибка загрузки данных</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${styles.wrapper} ${outerStyles || ''}`}
    >
      <div className={styles.fieldsContainer}>
        {Object.keys(data).map((name) => {
          const block = data![name as keyof StepsCharactSchemaType];

          return (
            <fieldset key={name}>
              <legend>{name}</legend>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  {...register(`${name}.checked` as Path<StepsCharactSchemaType>)}
                />
                Активно
              </label>

              {Object.entries(block)
                .filter(([key]) => key !== 'checked')
                .map(([key]) => {
                  const path = `${name}.${key}` as Path<StepsCharactSchemaType>;
                  return (
                    <div key={key} className={styles.inputGroup}>
                      <label>{key}</label>
                      <input type="number" step="any" {...register(path, { valueAsNumber: true })} />
                    </div>
                  );
                })}
            </fieldset>
          );
        })}
      </div>

      <button type="submit" className={styles.saveButton}>
        Сохранить
      </button>
    </form>
  );
};
