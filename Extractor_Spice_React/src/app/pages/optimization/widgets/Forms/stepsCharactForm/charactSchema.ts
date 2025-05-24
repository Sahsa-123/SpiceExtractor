import { z } from "zod";

const CharactBlockSchema = z.object({
  checked: z.boolean(),
  xmin: z.number(),
  xmax: z.number(),
  ymin: z.number(),
  ymax: z.number(),
});

export const StepsCharactSchema = z.object({
  IDVD: CharactBlockSchema,
  IDVG: CharactBlockSchema,
});

export type StepsCharactSchemaType = z.infer<typeof StepsCharactSchema>;
