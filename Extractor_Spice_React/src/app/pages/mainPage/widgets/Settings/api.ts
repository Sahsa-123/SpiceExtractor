/*parent dependencies*/
import { FieldsetsType } from "../../childIndex"
/*parent dependencies*/

/*core dependencies*/
import { btnProps } from "../../../../../core/UI"
/*core dependencies*/

export type settingsPropps = {
    config: {
        fieldsets:FieldsetsType,
        btnAcceptAll:Omit<btnProps, "clickHandler">,
        btnRejectAll:Omit<btnProps, "clickHandler">
    },
    syncFunc:(data:SettingsSyncData)=>void,
    outerStyles?: string|null 
}

export type SettingsSyncData = {
    [i:string]:string[]|boolean|string
}