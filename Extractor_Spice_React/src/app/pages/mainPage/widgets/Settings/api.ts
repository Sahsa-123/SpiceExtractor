import {z} from "zod"
import { btnProps } from "../../../../../core/UI"
import { fieldsetSchema } from "../../childIndex"

export type settingsPropps = {
    config: {
        fieldsets:z.infer<typeof fieldsetSchema>|null,
        btnAcceptAll:Omit<btnProps, "clickHandler">,
        btnRejectAll:Omit<btnProps, "clickHandler">
    },
    syncFunc:(data:FormType)=>void,
    outerStyles?: string|null 
}

export type nonNullConfig = Omit<settingsPropps["config"], "fieldsets"> & {
    fieldsets: NonNullable<settingsPropps["config"]["fieldsets"]>;
};

export function isNonNullConfig(config: settingsPropps["config"]):config is nonNullConfig{
    if(config.fieldsets)return true
    return false
} 

export type FormType = {
    [i:string]:string[]|boolean
}