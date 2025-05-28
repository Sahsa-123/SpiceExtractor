import React from "react";
import { useSetAtom } from "jotai";
import { Button } from "../../../../../../../core/UI";
import { graphAtom } from "../../sharedState";
import { ModelButtonProps } from "./api";
import { fetchPlot } from "../sharedWebAPI";
import { PlotDataSchema } from "../../sharedState"

export const ModelButton: React.FC<ModelButtonProps> = ({ config }) => {
  const { host, endpoint } = config;
  const setGraph = useSetAtom(graphAtom);
  const handleClick = async () => {
    try {
      const result = await fetchPlot({
        host,
        endpoint,
        schema: PlotDataSchema,
      });
      setGraph({ data: result, isError: false });
    } catch (error) {
      console.error("Ошибка при получении графика модели:", error);
      setGraph({ data: null, isError: true });
    }
  };


  return <Button clickHandler={handleClick}>Смоделировать</Button>;
};
