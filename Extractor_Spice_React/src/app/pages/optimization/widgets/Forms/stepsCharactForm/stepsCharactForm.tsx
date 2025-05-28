import React, { useEffect } from 'react';
import { useForm, Path } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* local dependencies */
import { StepsCharactFormProps } from './api';
import { StepsCharactSchemaType } from './charactSchema';
import { fetchStepsCharact } from './webAPI';
import styles from './stepsCharactForm.module.css';
import { CenteredContainer } from '../../../../../../core/Wrappers';
/* local dependencies */

export const StepsCharactForm: React.FC<StepsCharactFormProps> = ({
  stepId,
  config,
  outerStyles = null,
  height,
  width
}) => {
  const { host, endpoints } = config;
  const queryClient = useQueryClient();
  const externalStyles={height, width}

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
  if (isFetching) return <CenteredContainer {...externalStyles}>Загрузка...</CenteredContainer>;
  if (isError || !data) return <CenteredContainer {...externalStyles}>Ошибка загрузки данных</CenteredContainer>;

  return (
    <form
      style={externalStyles}
      onSubmit={handleSubmit(onSubmit)}
      className={`${styles["form"]} ${outerStyles || ''}`}
    >
      <div className={styles["form__inputPart"]}>
        {Object.keys(data).map((name) => {
          const block = data![name as keyof StepsCharactSchemaType];

          return (
            <fieldset key={name} className={styles["form__fieldset"]}>
              <legend className={styles["form__legend"]}>{name}</legend>

              <label>
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
                    <div key={key} className={styles["form__input-group"]}>
                      <label>{key}</label>
                      <input type="number" step="any" {...register(path, { valueAsNumber: true })} />
                    </div>
                  );
                })}
            </fieldset>
          );
        })}
      </div>

      <button type="submit" className={styles["form__submit-btn"]}>
        Сохранить
      </button>
    </form>
  );
};
