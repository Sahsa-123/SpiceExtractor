/*local dependecies*/
import { getChartSettings } from "./webAPI";
import { fieldsetSchema } from "./state"; 
/*local dependecies*/

/*other*/
import { useQuery } from "@tanstack/react-query";
import { useMemo} from "react";
/*other*/

export function useGetData(key:string[], host:string, endpoint:string){
  const { data, status } = useQuery({
    queryKey: [...key],
    queryFn: () => getChartSettings(host, endpoint),
  });

  const parsedFieldsets = useMemo(() => {
    if (!data?.data) return null;
    const parsed = fieldsetSchema.safeParse(data.data);
    return parsed.success ? parsed.data : null;
  }, [data?.data]);
  return{
    status,
    data: parsedFieldsets
  }
}