//===================================MAIN SUGGESTIONS============================================
//===================================MAIN SUGGESTIONS============================================

//==================================MODULE DESCRIPTION===========================================
/*
purpose: convert JSON responses from fetch()

dependencies: webAPIErrors

main function: JSONResponseConverter

helping functions: -
*/
import { BadJSON } from "./errors";
import { JSONResponseConverterReturnTypes } from "./api";

export { JSONResponseConverter as default };
//==================================MODULE DESCRIPTION===========================================

//==================================MODULE MAIN FUNCTION=========================================
/*
function name: JSONResponseConverter(response)

purpose: convert fetch() responses from server to JSON

structure of used surrounding: -

arguments:response
  response:Response - response returned by fetch()

output: JSON of reponse

structure of created elements: -
*/
export async function JSONResponseConverter(response:Response):Promise<JSONResponseConverterReturnTypes>{
  try{
    const converted = await response.json()
    return {
      isSuccessful:true,
      data: converted,
    }
  }
  catch{
    return {
      isSuccessful:true,
      data: new BadJSON("json convertion error"),
    }
  }
}
//==================================MODULE MAIN FUNCTION=========================================

//================================MODULE COUSED FUNCTIONS========================================
//================================MODULE COUSED FUNCTIONS========================================

//=========================================DEVELOPED=============================================
//=========================================DEVELOPED=============================================

//===========================================OTHER================================================
