import { z } from "zod";

export const LocalParamSchema = z.record(
  z.object({
    checked: z.boolean(),
    value: z.number(),
    min: z.number(),
    max: z.number(),
  })
);

export type LocalParamType = z.infer<typeof LocalParamSchema>;

export const GlobalParamSchema = z.record(
  z.object({
    value: z.number(),
    min: z.number(),
    max: z.number(),
  })
);

export type GlobalParamType = z.infer<typeof GlobalParamSchema>;
