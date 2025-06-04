import React from "react";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "../../../../../../../core/UI";
import { graphAtom } from "../../sharedState";
import { RunStepButtonProps } from "./api";
import { fetchPlot } from "../sharedWebAPI";
import { PlotDataSchema } from "../../sharedState";
import { isGraphFetchingAtom } from "../../sharedState";


export const RunStepButton: React.FC<RunStepButtonProps> = ({ config, stepId, isDisabled }) => {
  const { host, endpoint } = config;
  const setGraph = useSetAtom(graphAtom);
  const [isFetching, setFetching] = useAtom(isGraphFetchingAtom);

  const handleClick = async () => {
  setFetching(true);
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
    } finally {
      setFetching(false);
    }
  };


  return <Button clickHandler={handleClick}  disabled={isFetching||isDisabled}>Запустить шаг</Button>;
};
