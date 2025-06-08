/*local dependecies*/
import { getChartSettings } from "./webAPI";
import { fieldsetSchema } from "./state"; 
/*local dependecies*/

/*other*/
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
/*other*/

export function useGetData(
  key: string[],
  host: string,
  endpoint: string
): UseGetDataResult {
  const { data, status } = useQuery({
    queryKey: key,
    queryFn: () => getChartSettings(host, endpoint, z.union([z.null(),fieldsetSchema] )),
  });

  switch (status) {
    case "pending":
      return { status: "pending", data: undefined };
    case "error":
      return { status: "error", data: undefined };
    case "success":
      return { status: "success", data };
  }
}

type UseGetDataResult = |
  UseGetDataPending|
  UseGetDataError|
  UseGetDataSuccess

type UseGetDataPending = {
  status: "pending" ;
  data: undefined;
};
type UseGetDataError = {
  status: "error";
  data:  undefined;
};
type UseGetDataSuccess = {
  status: "success" ;
  data: z.infer<typeof fieldsetSchema> | null ;
};