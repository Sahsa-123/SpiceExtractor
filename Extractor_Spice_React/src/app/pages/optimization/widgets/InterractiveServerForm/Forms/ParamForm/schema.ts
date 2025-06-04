import { z } from "zod";

// Глобальная: value, min, max
export const GlobalParamSchema = z.record(
  z.object({
    value: z.number(),
    min: z.number(),
    max: z.number(),
  })
);

// Локальная: checked, value, min, max
export const LocalParamSchema = z.record(
  z.object({
    checked: z.boolean(),
    value: z.number(),
    min: z.number(),
    max: z.number(),
  })
);

export type GlobalParamType = z.infer<typeof GlobalParamSchema>;
export type LocalParamType = z.infer<typeof LocalParamSchema>;
