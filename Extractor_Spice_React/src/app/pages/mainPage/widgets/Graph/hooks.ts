/*other*/
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PlotParams } from "react-plotly.js";
/*other*/

type QueryFnResponse = {
  data: PlotParams["data"];
  layout: PlotParams["layout"];
};

type useGetPlotReturns<EType extends Error> = {
  isFetching: boolean;
  data: PlotParams["data"] | undefined;
  layout: PlotParams["layout"];
  error: EType | null;
};

export function useGetPlot<
    RType extends QueryFnResponse,
    EType extends Error = Error
>(
  queryKeys: string[],
  queryFn?: () => Promise<RType>,
  retry:number = 1
): useGetPlotReturns<EType>{

  const { data, isFetching, error } = useQuery<RType, EType>({
    queryKey: [...queryKeys],
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    retry
  });

  const layout = {
    ...data?.layout,
    autosize: true,
    width: undefined,
    height: undefined,
    margin: { t: 0, b: 0, l: 0, r: 0 },
  }

  return {
    isFetching,
    data: data?.data,
    layout,
    error:error||null
  };
}