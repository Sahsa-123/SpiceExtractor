import { FieldValues } from "react-hook-form";
import { z } from "zod";

import type { ISFContextType } from "./context";

export interface ISFProps<T extends FieldValues> {
  stepId: string;
  schema: z.ZodSchema<T>;
  formName: string;
  config: {
    host: string;
    endpoints: {
      get: string;
      post: string;
    };
  };
  children: React.ReactNode[]|React.ReactNode;
  context: React.Context<ISFContextType<T> | null>;
}
