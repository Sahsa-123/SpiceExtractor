import React from "react";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "../../../../../../../core/UI";
import { graphAtom, isGraphFetchingAtom } from "../../sharedState";
import { ModelButtonProps } from "./api";
import { fetchPlot } from "../sharedWebAPI";
import { PlotDataSchema } from "../../sharedState"

export const ModelButton: React.FC<ModelButtonProps> = ({ config }) => {
  const { host, endpoint } = config;
  const setGraph = useSetAtom(graphAtom);
  const [isFetching, setFetching] = useAtom(isGraphFetchingAtom);
  const handleClick = async () => {
    setFetching(true);
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
    } finally {
      setFetching(false);
    }
  };


  return <Button clickHandler={handleClick} disabled={isFetching}>Смоделировать</Button>;
};
