//===================================MAIN SUGGESTIONS============================================
// Reconsider catch blocks
//===================================MAIN SUGGESTIONS============================================
/*local dependecies*/
import {
  BadNetwork,
  BadStatusError,
  ClientStatusError,
  ServerStatusError,
  unknownError
} from "./errors";
import { GETRequestReturnTypes } from "./api";
/*local dependecies*/

//==================================MODULE DESCRIPTION===========================================

//==================================MODULE MAIN FUNCTION=========================================
/*
  function name: GETRequest

  purpose: Send general get-requests to server

  structure of used surrounding: -

  arguments:
    host: string - Address of server
    endpoint: string - Endpoint for request
    queryParams: string | null - Query parameters

  output: Object with properties
    isSuccessful: boolean - True if response JSON converted successfully
    data - CustomErrorObject or JSON response

  structure of created elements: -
*/
export async function GETRequest(
  host: string = "http://127.0.0.1:8000",
  endpoint: string = "all_params",
  queryParams: string | null = null
): Promise<GETRequestReturnTypes> {
  const address = `${host}/${endpoint}${queryParams ? `?${queryParams}` : ""}`;
  
  try {
    const response = await fetch(address);
    
    if (!response.ok) {
      const status: number = response.status;
      switch (String(status)[0]) {
        case "4":
          throw new ClientStatusError(status);
        case "5":
          throw new ServerStatusError(status);
      }
    }
    
    return {
      isSuccessful: true,
      data: response,
    };
  } catch (error) {
    console.error(error);
    
    if (error instanceof BadStatusError) {
      return {
        isSuccessful: false,
        data: error,
      };
    }
    
    if (error instanceof Error) {
      return {
        isSuccessful: false,
        data: new BadNetwork(error.message),
      };
    }
    
    return {
      isSuccessful: false,
      data: new unknownError("Неизвестная ошибка"),
    };
  }
}
//==================================MODULE MAIN FUNCTION=========================================

//======================================MODULE COUSED FUNCTIONS==================================
//======================================MODULE COUSED FUNCTIONS==================================

//======================================DEVELOPED================================================
//======================================DEVELOPED================================================

//======================================OTHER====================================================