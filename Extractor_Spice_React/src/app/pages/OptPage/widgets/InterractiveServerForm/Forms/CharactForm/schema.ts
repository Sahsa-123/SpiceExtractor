import { z, ZodType } from "zod";

// Хелпер с упрощённым типом
const toNumber = (schema: z.ZodNumber): ZodType<number> =>
  z.preprocess((val) => val === null ? 0 : val, schema) as ZodType<number>;

export const CharactBlockSchema = z.object({
  checked: z.boolean(),
  xmin: toNumber(z.number()),
  xmax: toNumber(z.number()),
  ymin: toNumber(z.number()),
  ymax: toNumber(z.number()),
});

export const StepsCharactSchema = z.object({
  IDVD: CharactBlockSchema,
  IDVG: CharactBlockSchema,
});

export type StepsCharactSchemaType = z.infer<typeof StepsCharactSchema>;
