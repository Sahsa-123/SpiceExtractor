import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { StopFormProps } from './api';
import { StopFormValues } from './stopSchema';
import { fetchStopFormData } from './webAPI';
import styles from './stopForm.module.css';
import { CenteredContainer } from '../../../../../../core/Wrappers';

export const StopForm: React.FC<StopFormProps> = ({
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
  } = useQuery<StopFormValues>({
    queryKey: ['stopcond', stepId],
    queryFn: () => fetchStopFormData(stepId, host, endpoints.get),
  });

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<StopFormValues>();

  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (formData: StopFormValues) => {
      await fetch(`${host}/${endpoints.post}?id=${stepId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stopcond', stepId] });
    },
  });

  const onSubmit = (values: StopFormValues) => {
    mutation.mutate(values);
  };

  if (isFetching) return <CenteredContainer {...externalStyles}>Загрузка...</CenteredContainer>;
  if (isError || !data) return <CenteredContainer {...externalStyles}>Ошибка загрузки данных</CenteredContainer>;

  return (
    <form style={externalStyles} onSubmit={handleSubmit(onSubmit)} className={`${styles["form"]} ${outerStyles || ''}`}>
      <div  className={styles["form__inputPart"]}>
        <div className={styles["form__fieldset"]}>
          <div className={styles["form__input-group"]}>
            <label>iterNum</label>
            <input type="number" {...register("iterNum", { valueAsNumber: true })} />
          </div>

          <div className={styles["form__input-group"]}>
            <label>relMesErr (%)</label>
            <input type="number" min={0} max={100} step="any" {...register("relMesErr", { valueAsNumber: true })} />
          </div>

          <div className={styles["form__input-group"]}>
            <label>absMesErr</label>
            <input type="number" step="any" {...register("absMesErr", { valueAsNumber: true })} />
          </div>

          <div className={styles["form__input-group"]}>
            <label>paramDelt (%)</label>
            <input type="number" min={0} max={100} step="any" {...register("paramDelt", { valueAsNumber: true })} />
          </div>
      </div>
      </div>
      <button type="submit" className={styles.saveButton}>Сохранить</button>
    </form>
  );
};
