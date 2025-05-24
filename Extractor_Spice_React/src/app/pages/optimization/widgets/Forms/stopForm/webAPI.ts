import { GETRequest } from "../../../../../../core/webAPI";
import { JSONResponseConverter } from "../../../../../../core/webAPI";
import { validateWithZodSchema } from "../../../../../../core/webAPI";
import { StopSchema, StopFormValues } from "./stopSchema";

export async function fetchStopFormData(
  stepId: string,
  host: string,
  endpoint: string
): Promise<StopFormValues> {
  const response = await GETRequest(host, endpoint, `id=${stepId}`);
  if (!response.isSuccessful) throw response.data;

  const converted = await JSONResponseConverter(response.data);
  if (!converted.isSuccessful) throw converted.data;

  const validated = validateWithZodSchema({
    data: converted.data,
    schema: StopSchema,
  });
  if (!validated.isSuccessful) throw validated.data;

  return validated.data;
}
