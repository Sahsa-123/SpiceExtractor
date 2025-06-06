/*local dependecies*/
import { BadJSON } from "./errors";
import { JSONResponseConverterReturnTypes } from "./api";
/*local dependecies*/

//==================================MODULE MAIN FUNCTION=========================================
/*
  function name: JSONResponseConverter(response)

  purpose: convert fetch() responses from server to JSON

  structure of used surrounding: -

  arguments: response
    response: Response - response returned by fetch()

  output: JSON of response

  structure of created elements: -
*/
export async function JSONResponseConverter(
  response: Response
): Promise<JSONResponseConverterReturnTypes> {
  try {
    const converted = await response.json();
    return {
      isSuccessful: true,
      data: converted,
    };
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error(error);
    return {
      isSuccessful: false,
      data: new BadJSON(error.message),
    };
  }
}
//==================================MODULE MAIN FUNCTION=========================================

//================================MODULE COUSED FUNCTIONS========================================
//================================MODULE COUSED FUNCTIONS========================================

//=========================================DEVELOPED=============================================
//=========================================DEVELOPED=============================================

//===========================================OTHER===============================================