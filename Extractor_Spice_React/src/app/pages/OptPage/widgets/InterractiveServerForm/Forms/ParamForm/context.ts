import { createISFContext } from "../../childIndex";
import type { GlobalParamType, LocalParamType } from "./schema";

export const GlobalParamsFormContext = createISFContext<GlobalParamType>();
export const LocalParamsFormContext = createISFContext<LocalParamType>();
