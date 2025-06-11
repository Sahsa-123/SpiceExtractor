import React from "react";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "../../../../../../../core/UI";
import {
  isGraphFetchingAtom,
  PlotDataSchema,
  graphStateAtom,
  updateModelAtom,
} from "../../sharedState";
import { RunStepButtonProps } from "./api";
import { fetchPlot } from "../sharedWebAPI";
import { useQueryClient } from "@tanstack/react-query";

export const RunStepButton: React.FC<RunStepButtonProps> = ({ config, isDisabled }) => {
  const queryClient  = useQueryClient()
  const { host, endpoint, queryParams } = config;
  const setModelStep = useSetAtom(updateModelAtom);
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
      setModelStep(result);
      alert("Шаг оптимизации модели выполнен успешно");
    } catch {
      // Не показываем stack trace
      setGraphState((prev) => ({ ...prev, runStep: null }));
      alert("Ошибка при запуске шага. Проверьте параметры и повторите попытку.");
    } finally {
      setFetching(false);
      queryClient.invalidateQueries({queryKey:["globalParams"]})
      queryClient.invalidateQueries({queryKey:["localParams",{id:config.queryParams?.id}]})
    }
  };

  return (
    <Button clickHandler={handleClick} disabled={isFetching || isDisabled}>
      Оптимизировать
    </Button>
  );
};
