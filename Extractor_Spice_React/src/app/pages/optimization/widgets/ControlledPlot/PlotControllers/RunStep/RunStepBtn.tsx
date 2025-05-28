import React from "react";
import { useSetAtom } from "jotai";
import { Button } from "../../../../../../../core/UI";
import { graphAtom } from "../../sharedState";
import { RunStepButtonProps } from "./api";
import { fetchPlot } from "../sharedWebAPI";
import { PlotDataSchema } from "../../sharedState"

export const RunStepButton: React.FC<RunStepButtonProps> = ({ config, stepId }) => {
  const { host, endpoint } = config;
  const setGraph = useSetAtom(graphAtom);

  const handleClick = async () => {
  try {
    const result = await fetchPlot({
      host,
      endpoint,
      stepId,
      schema: PlotDataSchema,
      });
    setGraph({ data: result, isError: false });
    } catch (error) {
      console.error("Ошибка при получении графика шага:", error);
      setGraph({ data: null, isError: true });
    }
  };


  return <Button clickHandler={handleClick}>Запустить шаг</Button>;
};
