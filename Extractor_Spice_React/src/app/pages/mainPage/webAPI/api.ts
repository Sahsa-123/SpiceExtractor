import {z} from "zod"
import { RequestError } from "../../../../core/webAPI"
import { BadJSON } from "../../../../core/webAPI"

export const settingsReturnSchema = z.record(
    z.union(
        [z.literal("chip-number-fieldset"),
        z.literal("inner-nominal-fieldset"),
        z.literal("electric-fieldset"),
        z.literal("temperature-fieldset")]
    ),
    z.array(
        z.object({value: z.string()})
    )
)

export type getChartSettingsReturnTypes =
    |getChartSettingsSuccessReturn
    |getChartSettingsFailReturn

type getChartSettingsSuccessReturn={
    isSuccessful:true,
    data: z.infer<typeof settingsReturnSchema>,
}

type getChartSettingsFailReturn={
    isSuccessful:false,
    data: BadJSON|RequestError,
}