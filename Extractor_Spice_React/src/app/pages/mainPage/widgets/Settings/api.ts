import {z} from "zod"
import { btnProps } from "../../../../../core/UI/Buttons/api"

const chartSettingsDataFieldSchema = z.object({
    value: z.string(),
    checked:z.optional(z.union([z.literal("true"),z.literal("false")]))
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chartSettingsDataSchema = z.record(z.string(), z.array(chartSettingsDataFieldSchema))

export type settingsPropps = {
    config: {
        fieldsets:z.infer<typeof chartSettingsDataSchema>,
        btnAcceptAll:Omit<btnProps, "clickHandler">,
        btnRejectAll:Omit<btnProps, "clickHandler">
    },
    syncFunc:()=>void,
    outerStyles?: string|null 
}

export type FormType = {
    [i:string]:string[]|boolean
}