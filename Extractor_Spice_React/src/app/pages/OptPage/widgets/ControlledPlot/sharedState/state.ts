import { atom } from "jotai";
import { z } from "zod";

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

/* Объединённое состояние всех графиков */
type FullGraphState = {
  name: string | null;
  measurements: PlotData | null;
  model: PlotData | null;
};

export const graphStateAtom = atom<FullGraphState>({
  name: null,
  measurements: null,
  model: null,
});

/* Обновление измерений */
export const updateMeasurementsAtom = atom(
  null,
  (get, set, { name, plot }: { name: string; plot: PlotData }) => {
    const current = get(graphStateAtom);
    if (current.name !== name) {
      set(graphStateAtom, {
        name,
        measurements: plot,
        model: null,
      });
    } else {
      set(graphStateAtom, {
        ...current,
        measurements: plot,
      });
    }
  }
);

/* Обновление модели */
export const updateModelAtom = atom(
  null,
  (get, set, plot: PlotData) => {
    const current = get(graphStateAtom);
    set(graphStateAtom, {
      ...current,
      model: plot,
    });
  }
);


/* Флаг загрузки графика */
export const isGraphFetchingAtom = atom<boolean>(false);
