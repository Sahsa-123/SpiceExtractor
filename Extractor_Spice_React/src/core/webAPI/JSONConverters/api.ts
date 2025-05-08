/*local dependecies*/
import { BadJSON } from "./errors"
/*local dependecies*/

export type JSONResponseConverterReturnTypes =
    | JSONResponseConverterSuccessReturn
    | JSONResponseConverterFailReturn

type JSONResponseConverterSuccessReturn = {
    isSuccessful: true
    data: unknown
}

type JSONResponseConverterFailReturn = {
    isSuccessful: false
    data: BadJSON
}