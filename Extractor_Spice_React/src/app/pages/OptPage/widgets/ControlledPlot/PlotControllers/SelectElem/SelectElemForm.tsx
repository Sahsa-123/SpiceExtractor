import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../../../core/UI";
import { useSetAtom } from "jotai";
import {
  PlotDataSchema,
  isGraphFetchingAtom,
  updateMeasurementsAtom,
} from "../../sharedState";
import { fetchPlot } from "../sharedWebAPI";
import styles from "./SelectElemForm.module.css";
import { SelectList } from "../../../../../../../core/widgets/SelectList/SelectList";

interface SelectFormValues {
  selectedElement: string;
}

export const SelectElemForm: React.FC<{
  config: {
    host: string;
    listEndpoint: string;
    plotEndpoint: string;
  };
}> = ({ config }) => {
  const { host, listEndpoint, plotEndpoint } = config;
  const [options, setOptions] = useState<string[]>([]);
  const [loadError, setLoadError] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue, // 👈 добавь
  } = useForm<SelectFormValues>();

  const setFetching = useSetAtom(isGraphFetchingAtom);
  const updateMeasurements = useSetAtom(updateMeasurementsAtom);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadError(false);
        const response = await fetch(`${host}/${listEndpoint}`);
        const data = await response.json();
        setOptions(data);
        if (data.length > 0) {
          reset({ selectedElement: data[0] });
        }
      } catch {
        setLoadError(true);
      }
    };

    loadOptions();
  }, []);

  const onSubmit = async ({ selectedElement }: SelectFormValues) => {
    setFetching(true);
    try {
      const result = await fetchPlot({
        host,
        endpoint: plotEndpoint,
        schema: PlotDataSchema,
        queryParams: { name: selectedElement },
      });

      updateMeasurements({ name: selectedElement, plot: result });
    } catch {
      alert("Ошибка загрузки графика измерений");
    } finally {
      setFetching(false);
    }
  };

  if (loadError) {
    return (
      <div className={styles.form}>
        <span className={styles.message}>
          Ошибка<br />Проверьте интернет-соединение
        </span>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className={styles.form}>
        <span className={styles.message}>Загрузите измерения</span>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <SelectList<SelectFormValues>
        options={options}
        register={register}
        setValue={setValue} // 👈 передаём
        name="selectedElement"
        width="auto"
        defaultValue={options[0]}
      />
      <Button type="submit">Выбрать</Button>
    </form>
  );
};
