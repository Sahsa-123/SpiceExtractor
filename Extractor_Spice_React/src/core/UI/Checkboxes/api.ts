import {useForm} from "react-hook-form"


type registerType = ReturnType<typeof useForm>["register"];

export type UFCheckboxI = {
    outerStyles?:string|null

    id: string,
    name: Parameters<registerType>[0],
    value: string,
    text:string,
    
    register: registerType,
    registerOptions?: Parameters<registerType>[1]|null,
}