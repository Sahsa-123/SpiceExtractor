import { createContext, useContext } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

/* Тип для значения контекста */
export interface ISFContextType<T extends FieldValues> {
  data: T;
  formSubmit: () => void;
  register: UseFormReturn<T>["register"];
}

/* Контекст создаём универсально, но с параметризацией */
export const createISFContext = <T extends FieldValues>() =>
  createContext<ISFContextType<T> | null>(null);

/* Хелпер-хук для использования контекста */
export function useISFContext<T extends FieldValues>(
  context: React.Context<ISFContextType<T> | null>
): ISFContextType<T> | null {
  return useContext(context);
}

