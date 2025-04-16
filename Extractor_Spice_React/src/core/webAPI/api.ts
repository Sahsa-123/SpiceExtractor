import { BadJSON, CustomError } from "./errors"
//=======================================GETRequest=======================================
export type GETRequestReturnTypes = 
    |GETRequestFailReturn
    |GETRequestSuccessReturn

export type GETRequestSuccessReturn = {
    isSuccessful:true,
    data: Response,
}
export type GETRequestFailReturn = {
    isSuccessful:false,
    data: CustomError,
}
//=======================================GETRequest=======================================

//==================================JSONEResponseConverter==================================
export type JSONEResponseConverterReturnTypes =
    |JSONEResponseConverterSuccessReturn
    |JSONEResponseConverterFailReturn

export type JSONEResponseConverterSuccessReturn={
    isSuccessful:true,
    data: unknown,
}

export type JSONEResponseConverterFailReturn={
    isSuccessful:false,
    data: BadJSON,
}
//==================================JSONEResponseConverter==================================



//=========================================LEGACY CODE======================================

/*
import {z} from "zod"

export const chartSettingsLSDataFieldSchema = z.object({
    innerText: z.string(),
    value: z.string(),
    checked:z.optional(z.union([z.literal("true"),z.literal("false")]))
})

export type chartSettingsLSDataField = z.infer<typeof chartSettingsLSDataFieldSchema>

export const chartSettingsLSDataSchema = z.record(z.string(), z.array(chartSettingsLSDataFieldSchema))

export type chartSettingsLSData = z.infer<typeof chartSettingsLSDataSchema>
*/

//=====================================chartSettingsGET=====================================
/*export type chartSettingsGETReturnTypes =
    |chartSettingsGETSuccessReturn
    |chartSettingsGETFailReturn

export type chartSettingsGETSuccessReturn={
    isSuccessful:true,
    data: chartSettingsLSData,
}

export type chartSettingsGETFailReturn={
    isSuccessful:false,
    data: BadJSON,
}*/
//=====================================chartSettingsGET=====================================
