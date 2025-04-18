import {useForm} from "react-hook-form"
// type permitedStyles = "flat-bottom"
// type styleModificationType = permitedStyles[]

type registerType = ReturnType<typeof useForm>["register"];

export type UFCheckboxI = {
    id: string,
    name: Parameters<registerType>[0],
    value: string,
    text:string,
    register: registerType,
    registerOptions?: Parameters<registerType>[1]|null,
    outerStyles?:string|null
    // styleModification?:styleModificationType
}