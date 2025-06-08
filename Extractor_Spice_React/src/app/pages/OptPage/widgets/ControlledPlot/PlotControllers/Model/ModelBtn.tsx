import React from "react";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "../../../../../../../core/UI";
import {
  isGraphFetchingAtom,
  PlotDataSchema,
  updateModelAtom,
  graphStateAtom,
} from "../../sharedState";
import { ModelButtonProps } from "./api";
import { fetchPlot } from "../sharedWebAPI";

export const ModelButton: React.FC<ModelButtonProps> = ({ config }) => {
  const { host, endpoint, queryParams } = config;
  const setModel = useSetAtom(updateModelAtom);
  const setGraphState = useSetAtom(graphStateAtom);
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
      setModel(result);
    } catch {
      setGraphState((prev) => ({ ...prev, model: null }));
      alert("Ошибка при моделировании. Проверьте параметры.");
    } finally {
      setFetching(false);
    }
  };

  return (
    <Button clickHandler={handleClick} disabled={isFetching}>
      Смоделировать
    </Button>
  );
};
