import { z } from "zod";
import {
  GETRequest,
  JSONResponseConverter,
  validateWithZodSchema,
} from "../../../../../core/webAPI";

/**
 * Универсальный fetch для параметров (локальных и глобальных)
 */
export async function fetchParams<T>(
  args: {
    stepId?: string;
    host: string;
    endpoint: string;
    schema: z.ZodSchema<T>;
  }
): Promise<T> {
  const { stepId, host, endpoint, schema } = args;

  const queryParams = stepId ? `id=${stepId}` : null;
  const response = await GETRequest(host, endpoint, queryParams);
  if (!response.isSuccessful) throw response.data;

  const converted = await JSONResponseConverter(response.data);
  if (!converted.isSuccessful) throw converted.data;

  const validated = validateWithZodSchema({ data: converted.data, schema });
  if (!validated.isSuccessful) throw validated.data;

  return validated.data;
}
