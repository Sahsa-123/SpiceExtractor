// Утилита для явного ZodType<number>
import { z, ZodType } from "zod";

const toNumber = (schema: z.ZodNumber): ZodType<number> =>
  z.preprocess((val) => val === null ? 0 : val, schema) as ZodType<number>;


const percent = z.number().min(0).max(100);

export const StopSchema = z.object({
  iterNum: toNumber(z.number()),
  relMesErr: toNumber(percent),
  absMesErr: toNumber(z.number()),
  paramDelt: toNumber(percent),
});

export type StopFormValues = z.infer<typeof StopSchema>;
