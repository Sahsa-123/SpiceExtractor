import { useQuery } from "@tanstack/react-query";
import { useMemo} from "react";
import { getChartSettings } from "./webAPI";
import { fieldsetSchema } from "./state"; 

export function useGetData(key:string[]){
  const { data, status } = useQuery({
    queryKey: [...key],
    queryFn: () => getChartSettings(),
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
// import { useQuery, QueryFunction, UseQueryResult } from "@tanstack/react-query";
// import { useMemo } from "react";
// import { ZodSchema } from "zod";

// type UseGetDataProps<TResponse, TData> = {
//   queryKey: string[];
//   queryFn: QueryFunction<TResponse>;
//   schema: ZodSchema<TData>;
//   enabled?: boolean;
// };

// export function useGetData<TResponse, TData>({
//   queryKey,
//   queryFn,
//   schema,
//   enabled = true,
// }: UseGetDataProps<TResponse, TData>): {
//   status: UseQueryResult["status"];
//   parsedData: TData | null;
//   data: TResponse | undefined;
//   error: UseQueryResult["error"];
// } {
//   const { data, status, error } = useQuery<TResponse>({
//     queryKey,
//     queryFn,
//     enabled,
//   });

//   const parsedData = useMemo(() => {
//     if (!data) return null;
//     const parsed = schema.safeParse(data);
//     return parsed.success ? parsed.data : null;
//   }, [data, schema]);

//   return {
//     status,
//     parsedData,
//     data,
//     error,
//   };
// }