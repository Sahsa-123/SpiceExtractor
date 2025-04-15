import {useForm} from "react-hook-form"
// type permitedStyles = "flat-bottom"
// type styleModificationType = permitedStyles[]

type registerType = ReturnType<typeof useForm>["register"];

export type UFCheckboxI = {
    id: string,
    name: Parameters<registerType>[0],
    registerOptions?: Parameters<registerType>[1]|null,
    value: string,
    text:string,
    register: registerType,
    // styleModification?:styleModificationType
}