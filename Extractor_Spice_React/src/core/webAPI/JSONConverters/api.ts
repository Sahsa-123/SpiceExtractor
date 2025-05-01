import { BadJSON } from "./errors"

export type JSONResponseConverterReturnTypes =
    |JSONResponseConverterSuccessReturn
    |JSONResponseConverterFailReturn

type JSONResponseConverterSuccessReturn={
    isSuccessful:true,
    data: unknown,
}

type JSONResponseConverterFailReturn={
    isSuccessful:false,
    data: BadJSON,
}