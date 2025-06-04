//===================================MAIN SUGGESTIONS============================================
// mb merge with  webApiRequests, as this function seem to be universal
//унифицировать вид представления дланных неа беке и клиенте
//===================================MAIN SUGGESTIONS============================================

//==================================MODULE DESCRIPTION===========================================
/*
purpose: provide GET requests to serever, for getting information about chartSettings

coused modules: JSONResponseConverter, GETRequest

main function: getChartSettings

helping functions:-
*/
import { JSONResponseConverter } from "../../../../core/webAPI";
import { schemaDismatch } from "../../../../core/Errors";
import { GETRequest } from "../../../../core/webAPI";
import { getChartSettingsReturnTypes, settingsReturnSchema } from "./api";
//==================================MODULE DESCRIPTION===========================================

//==================================MODULE MAIN FUNCTION=========================================
/*
function name: getChartSettings

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
export async function getChartSettings(host="http://127.0.0.1:8010", endpoint="all_params"):Promise<getChartSettingsReturnTypes> {
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


//======================================DEVELOPED================================================

//======================================OTHER====================================================
