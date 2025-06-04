import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../../../core/UI";
import { useSetAtom } from "jotai";
import { graphAtom, isGraphFetchingAtom, PlotDataSchema } from "../../sharedState";
import { fetchPlot } from "../sharedWebAPI";
import styles from "./SelectElemForm.module.css";

interface SelectFormValues {
  selectedElement: string;
}

export const SelectElemForm : React.FC<{
  config: {
    host: string;
    listEndpoint: string;
    plotEndpoint: string;
  };
}> = ({ config }) => {
  const { host, listEndpoint, plotEndpoint } = config;
  const [options, setOptions] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm<SelectFormValues>();
  const setGraph = useSetAtom(graphAtom);
  const setFetching = useSetAtom(isGraphFetchingAtom);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await fetch(`${host}/${listEndpoint}`);
        const data = await response.json();
        setOptions(data);
        reset({ selectedElement: data[0] });
      } catch (error) {
        alert("Ошибка при загрузке списка элементов");
        console.error(error);
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
      setGraph({ data: result, isError: false });
    } catch (e) {
      console.error("Ошибка при получении графика:", e);
      setGraph({ data: null, isError: true });
      alert("Ошибка загрузки графика");
    } finally {
      setFetching(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <select {...register("selectedElement")}>
        {options.map((el, i) => (
          <option key={i} value={el}>
            {el}
          </option>
        ))}
      </select>
      <Button type="submit">Выбрать</Button>
    </form>
  );
};
