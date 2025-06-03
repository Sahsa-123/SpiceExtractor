// import { atom } from 'jotai';
// import { z } from "zod";

// /* Типы состояния */
// const PlotBlockSchema = z.object({
//   layout: z.record(z.any()),
//   data: z.array(z.any()),
// });

// export const PlotDataSchema = z.object({
//   layoutIDVD: PlotBlockSchema,
//   layoutIDVG: PlotBlockSchema,
//   errIDVD: z.number(),
//   errIDVG: z.number(),
//   message: z.string(),
// });

// export type PlotData = z.infer<typeof PlotDataSchema>;
// /* Типы состояния */

// /* Состояние */
// export const graphAtom = atom<{
//   data: PlotData | null;
//   isError: boolean;
// }>({
//   data: null,
//   isError: false,
// });
import { atom } from 'jotai';
import { z } from 'zod';

/* Схема одного графика Plotly */
const PlotBlockSchema = z.object({
  layout: z.record(z.any()),
  data: z.array(z.any()),
});

/* Основная схема ответа от API */
export const PlotDataSchema = z.object({
  pointIDVD: PlotBlockSchema,
  pointIDVG: PlotBlockSchema,
  errIDVD: z.number().optional(),
  errIDVG: z.number().optional(),
  message: z.string().optional(),
});

/* Тип данных */
export type PlotData = z.infer<typeof PlotDataSchema>;

/* Атом состояния графика */
export const graphAtom = atom<{
  data: PlotData | null;
  isError: boolean;
}>({
  data: null,
  isError: false,
});
