import { GETRequest, JSONResponseConverter, validateWithZodSchema } from "../../../../../../../core/webAPI";
import { z } from "zod";

export async function fetchPlot<T>({
  host,
  endpoint,
  schema,
  queryParams,
}: {
  host: string;
  endpoint: string;
  schema: z.ZodSchema<T>;
  queryParams?: Record<string, string>;
}): Promise<T> {
  const query = queryParams
    ? new URLSearchParams(queryParams).toString()
    : undefined;

  const response = await GETRequest(host, endpoint, query);
  if (!response.isSuccessful) throw response.data;

  const converted = await JSONResponseConverter(response.data);
  if (!converted.isSuccessful) throw converted.data;

  const validated = validateWithZodSchema({ data: converted.data, schema });
  if (!validated.isSuccessful) throw validated.data;

  return validated.data;
}
