//===================================MAIN SUGGESTIONS============================================
// mb merge with  webApiRequests, as this function seem to be universal
//унифицировать вид представления дланных неа беке и клиенте
//===================================MAIN SUGGESTIONS============================================

//==================================MODULE DESCRIPTION===========================================
/*
purpose: provide GET requests to serever, for getting information about chartSettings

coused modules: JSONResponseConverter, GETRequest

main function: chartSettingsGET

helping functions:-
*/
import { BadJSON, schemaDismatch } from "../../../core/webAPI/errors";
import { GETRequest,JSONResponseConverter } from "../../../core/webAPI";
//import { chartSettingsGETReturnTypes, chartSettingsLSData, chartSettingsLSDataSchema} from "../webAPIINT.js";
//import { schemaDismatch } from "../webAPIErrors/webAPIErrors.js";

export {chartSettingsGET as default};
//==================================MODULE DESCRIPTION===========================================

//==================================MODULE MAIN FUNCTION=========================================
/*
function name: chartSettingsGET

purpose: send get-requests to server to recieve chartSettings state

structure of used surrounding: -

arguments: host, endpoint
  host:string - adress of server
  endpoint:string - endpoint for request

output:object with properties
  isSuccessful:boolean - true if response JSON converted successfully, false in opposite
  data - customErrorObject or JSON of response from server

structure of created elements:-
*/
async function chartSettingsGET(host="http://127.0.0.1:8000", endpoint="all_params"):Promise<chartSettingsGETReturnTypes> {
  const response = await GETRequest(host, endpoint)
  if(response.isSuccessful){
    const converted = await JSONResponseConverter(response.data)
    if(converted.isSuccessful){
      const schemaVerification = settingsReturnSchema.safeParse(converted.data)
      if (schemaVerification.success) {
        return {
          isSuccessful: true,
          data: schemaVerification.data,
        };
      } else {
        return {
          isSuccessful: false,
          data: new schemaDismatch(schemaVerification.error.message),
        };
      }
    }
    return {
      isSuccessful:converted.isSuccessful,
      data: converted.data,
    }
  }
  return response
}
//==================================MODULE MAIN FUNCTION=========================================

//======================================DEVELOPED================================================

import {z} from "zod"

const settingsReturnSchema = z.record(
    z.union(
        [z.literal("chip-number-fieldset"),
        z.literal("inner-nominal-fieldset"),
        z.literal("electric-fieldset"),
        z.literal("temperature-fieldset")]
    ),
    z.array(
        z.object({value: z.string()})
    )
)

type chartSettingsGETReturnTypes =
    |chartSettingsGETSuccessReturn
    |chartSettingsGETFailReturn

type chartSettingsGETSuccessReturn={
    isSuccessful:true,
    data: z.infer<typeof settingsReturnSchema>,
}

type chartSettingsGETFailReturn={
    isSuccessful:false,
    data: BadJSON,
}
//======================================DEVELOPED================================================

//======================================OTHER====================================================
