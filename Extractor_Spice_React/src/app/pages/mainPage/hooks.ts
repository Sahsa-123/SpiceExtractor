import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useReducer } from "react";
import { initialState, mainPageReducer } from "./state";
import { getChartSettings } from "./webAPI";
import { chartSettingsDataSchema } from "./state"; 

export function useMainPage(){
const [pageState, dispatch] = useReducer(mainPageReducer,initialState);

  const { data, status } = useQuery({
    queryKey: ["chart-settings"],
    queryFn: () => getChartSettings(),
  });

  const parsedFieldsets = useMemo(() => {
    if (!data?.data) return null;
    const parsed = chartSettingsDataSchema.safeParse(data.data);
    return parsed.success ? parsed.data : null;
  }, [data?.data]);

   useEffect(() => {
    dispatch({
      type: "patchFieldsets",
      newFieldsets: parsedFieldsets
    });
  }, [parsedFieldsets]);
  return{
    status,
    pageState,
    dispatch
  }
}