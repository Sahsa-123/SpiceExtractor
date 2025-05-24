import {
  ValidateWithZodSchemaInput,
  ZodValidationResult,
} from "./api";
import { SchemaDismatchError } from "./errors";

export function validateWithZodSchema<T>({
  data,
  schema,
}: ValidateWithZodSchemaInput<T>): ZodValidationResult<T> {
  const parsed = schema.safeParse(data);
  if (parsed.success) {
    return { isSuccessful: true, data: parsed.data };
  } else {
    return {
      isSuccessful: false,
      data: new SchemaDismatchError(parsed.error.message),
    };
  }
}
