import { FieldValues } from "react-hook-form";
import { z } from "zod";

import type { ISFContextType } from "./context";

export interface ISFProps<T extends FieldValues> {
  /** Query-параметры для запроса. Если null — параметры не передаются */
  queryParams: Record<string, string> | null;

  /** Имя формы (используется для queryKey) */
  formName: string;

  /** Zod-схема для валидации данных */
  schema: z.ZodSchema<T>;

  /** Контекст, через который передаются данные и register */
  context: React.Context<ISFContextType<T> | null>;

  /** Конфигурация API */
  config: {
    host: string;
    endpoints: {
      get: string;
      post: string;
    };
  };

  /** Вложенные компоненты формы */
  children: React.ReactNode | React.ReactNode[];
  width:`${number}%`|"auto"|`${number}px`
  height:`${number}%`|"auto"|`${number}px`
}
