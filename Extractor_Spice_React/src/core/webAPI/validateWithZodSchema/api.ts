import { z } from "zod";

export type ValidateWithZodSchemaInput<T> = {
  data: unknown;
  schema: z.ZodSchema<T>;
};

export type ZodValidationResult<T> =
  | { isSuccessful: true; data: T }
  | { isSuccessful: false; data: Error };
