import React from "react";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "../../../../../../../core/UI";
import { graphAtom, isGraphFetchingAtom, PlotDataSchema } from "../../sharedState";
import { RunStepButtonProps } from "./api";
import { fetchPlot } from "../sharedWebAPI";

export const RunStepButton: React.FC<RunStepButtonProps> = ({ config, isDisabled }) => {
  const { host, endpoint, queryParams } = config;
  const setGraph = useSetAtom(graphAtom);
  const [isFetching, setFetching] = useAtom(isGraphFetchingAtom);

  const handleClick = async () => {
    setFetching(true);
    try {
      const result = await fetchPlot({
        host,
        endpoint,
        schema: PlotDataSchema,
        queryParams,
      });
      setGraph({ data: result, isError: false });
    } catch (error) {
      console.error("Ошибка при получении графика шага:", error);
      setGraph({ data: null, isError: true });
    } finally {
      setFetching(false);
    }
  };

  return (
    <Button clickHandler={handleClick} disabled={isFetching || isDisabled}>
      Запустить шаг
    </Button>
  );
};
