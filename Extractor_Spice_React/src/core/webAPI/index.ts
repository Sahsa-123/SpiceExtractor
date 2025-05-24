//===================================WEB API PACKAGE EXPORTS=====================================
// Main entry point for webAPI functionality

/* JSON Converters Module */
export { JSONResponseConverter } from "./JSONConverters";
export type { JSONResponseConverterReturnTypes } from "./JSONConverters";
export { BadJSON } from "./JSONConverters";

/* Requests Module */
export { GETRequest } from "./Requests";
export type { GETRequestReturnTypes } from "./Requests";
export { RequestError } from "./Requests";

/* ZodValidator Module */
export { validateWithZodSchema } from "./validateWithZodSchema";
export type {
  ValidateWithZodSchemaInput,
  ZodValidationResult,
} from "./validateWithZodSchema";
export { SchemaDismatchError } from "./validateWithZodSchema";
//===================================WEB API PACKAGE EXPORTS=====================================