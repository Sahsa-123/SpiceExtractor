//===================================MAIN SUGGESTIONS============================================
// reconcider catch blocks
//===================================MAIN SUGGESTIONS============================================

//==================================MODULE DESCRIPTION===========================================
/*
purpose: provide GENERAL GET requests to serever

coused modules: WebAPIErrors

main function: GETRequest

helping functions:-
*/
import { BadNetwork, BadStatusError, ClientStatusError, ServerStatusError, unknownError } from "./errors.js";
import { GETRequestReturnTypes } from "./api.js";

export  {GETRequest as default};
//==================================MODULE DESCRIPTION===========================================

//==================================MODULE MAIN FUNCTION=========================================
/*
function name: GETRequest

purpose: send general get-requests to server

structure of used surrounding: -

arguments: host, endpoint
  host:string - adress of server
  endpoint:string - endpoint for request

output:object with properties
  isSuccessful:boolean - true if response JSON converted successfully, false in opposite
  data - customErrorObject or JSON of response from server

structure of created elements:-
*/
async function GETRequest(host:string="http://127.0.0.1:8000", endpoint:string="all_params", queryParams:string|null=null):Promise<GETRequestReturnTypes> {
  const adress = `${host}/${endpoint}?${queryParams}`;
  try{
    const response = await fetch(adress);
    if (!response.ok) {
      const status:number = response.status
      switch(String(status)[0]){
        case "4":{
          throw new ClientStatusError(status)
        }
        case "5":{
          throw new ServerStatusError(status)
        }
      }
    }
    return {
      isSuccessful:true,
      data: response,
    };
  }
  catch(error){
    console.error(error)
    if(error instanceof BadStatusError){
      return {
        isSuccessful:false,
        data:error,
      }
    }
    if(error instanceof Error){
      return {
        isSuccessful:false,
        data:new BadNetwork(error.message),
      }
    }
    else{
      return {
        isSuccessful:false,
        data:new unknownError("Неизвестная ошибка"),
      }
    }
  }
}
//==================================MODULE MAIN FUNCTION=========================================

//======================================MODULE COUSED FUNCTIONS==================================
//======================================MODULE COUSED FUNCTIONS==================================

//======================================DEVELOPED================================================
//======================================DEVELOPED================================================

//======================================OTHER====================================================
