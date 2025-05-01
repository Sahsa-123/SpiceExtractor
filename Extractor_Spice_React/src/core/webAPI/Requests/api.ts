import { RequestError } from "./errors"

export type GETRequestReturnTypes = 
    |GETRequestFailReturn
    |GETRequestSuccessReturn

type GETRequestSuccessReturn = {
    isSuccessful:true,
    data: Response,
}
type GETRequestFailReturn = {
    isSuccessful:false,
    data: RequestError,
}