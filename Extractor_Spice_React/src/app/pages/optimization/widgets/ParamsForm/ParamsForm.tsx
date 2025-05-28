import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ParamsFormProps } from "./api";
import styles from "./ParamsForm.module.css";
import { fetchParams } from "./webAPI";
import {
  GlobalParamSchema,
  LocalParamSchema,
  GlobalParamType,
  LocalParamType,
} from "./paramsSchema";

export const ParamsForm: React.FC<ParamsFormProps> = ({ config, variant, height, width, outerStyles }) => {
  const [filter, setFilter] = useState("");
  const queryClient = useQueryClient();
  const { host, endpoints } = config;
  const stepId = variant === "local" ? config.stepId : undefined;
  const externalStyles={height, width}

  const queryKey = variant === "local"
    ? ["params", "local", stepId]
    : ["params", "glob"];

  const schema = variant === "local" ? LocalParamSchema : GlobalParamSchema;

  type SchemaType = typeof schema extends typeof LocalParamSchema
    ? LocalParamType
    : GlobalParamType;

  const {
    data,
    isFetching,
    isError,
  } = useQuery<SchemaType>({
    queryKey,
    queryFn: () => fetchParams({
      host,
      endpoint: endpoints.get,
      stepId,
      schema,
    })
  });

  const form = useForm<SchemaType>();
  const { register, handleSubmit, reset, watch } = form;

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: async (formData: SchemaType) => {
      const url = variant === "local"
        ? `${host}/${endpoints.post}?id=${stepId}`
        : `${host}/${endpoints.post}`;

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const onSubmit = (values: SchemaType) => mutation.mutate(values);

  if (isFetching) return <div>Загрузка...</div>;
  if (isError || !data) return <div>Ошибка загрузки</div>;

  const watchedValues = watch();
  const filteredEntries = Object.entries(watchedValues).filter(([key]) =>
    key.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles["params-form"]} ${outerStyles || ""}`} style={externalStyles}>
  <input
    type="text"
    placeholder="Поиск по параметрам..."
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className={styles["params-form__searchbar"]}
  />

  <div className={styles["params-form__table-container"]}>
    <div
      className={`${styles["params-form__table-header"]} ${styles["params-form__row"]} ${styles["params-form__row--header"]}`}
    >
      {variant === "local" && <div className={styles["params-form__cell"]}>checked</div>}
      <div className={styles["params-form__cell"]}>name</div>
      <div className={styles["params-form__cell"]}>value</div>
      <div className={styles["params-form__cell"]}>min</div>
      <div className={styles["params-form__cell"]}>max</div>
    </div>

    <div className={styles["params-form__table-body"]}>
      {filteredEntries.map(([name]) => (
        <div
          key={name}
          className={`${styles["params-form__row"]} ${styles["params-form__row--standard"]}`}
        >
          {variant === "local" && (
            <div className={styles["params-form__cell"]}>
              <input type="checkbox" {...register(`${name}.checked` as const)} />
            </div>
          )}
          <div className={styles["params-form__cell"]} title={name}>{name}</div>
          <div className={styles["params-form__cell"]}>
            <input
              type="number"
              step="any"
              {...register(`${name}.value` as const, { valueAsNumber: true })}
            />
          </div>
          <div className={styles["params-form__cell"]}>
            <input
              type="number"
              step="any"
              {...register(`${name}.min` as const, { valueAsNumber: true })}
            />
          </div>
          <div className={styles["params-form__cell"]}>
            <input
              type="number"
              step="any"
              {...register(`${name}.max` as const, { valueAsNumber: true })}
            />
          </div>
        </div>
      ))}
    </div>
  </div>

  <button type="submit" className={styles["params-form__save-button"]}>
    Сохранить
  </button>
</form>

  );
};
