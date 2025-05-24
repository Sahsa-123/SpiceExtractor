import { z } from "zod";

export const StopSchema = z.object({
  iterNum: z.number(),
  relMesErr: z.number().min(0).max(100),
  absMesErr: z.number(),
  paramDelt: z.number().min(0).max(100),
});

export type StopFormValues = z.infer<typeof StopSchema>;
