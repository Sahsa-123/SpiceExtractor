//===================================MAIN SUGGESTIONS============================================
// discuss error texts
//===================================MAIN SUGGESTIONS============================================

//==================================MODULE DESCRIPTION===========================================
/*
purpose: custom Errors for requests module

coused modules:-

main function:-

helping functions:-
*/
export { BadStatusError, ClientStatusError, ServerStatusError, BadNetwork, unknownError, RequestError }
//==================================MODULE DESCRIPTION===========================================

//====================================MODULE CLASSES=============================================

abstract class RequestError extends Error {
  abstract clientMessage: string[];

  constructor(message: string) {
    super(message);
  }
}

/*
class name: BadStatusError

relativity: a basic class of errors that occur due to invalid http response codes 400-599

purpose: basic class

structure of used surrounding: -

arguments: message
  message:string - basic first argument of Error constructors

output: object with fields
  stack - standard Error class property
  message - standard Error class property
  name - standard Error class property
    name changed to custom error class name

structure of created elements: -
*/
abstract class BadStatusError extends RequestError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/*
class name: ClientStatusError

relativity: inherits BadStatusError

purpose: used for client errors(codes 400-499)
  provide messages for customAlert and other additorial info about error

structure of used surrounding: -

arguments: errorCode
  errorCode:string - code of error

output: object with fields
  stack - standard Error class property
  message - standard Error class property
  name - standard Error class property
    name changed to custom error class name
  statusCode - code of response
  clientMessage - text of customAlert paragraph


structure of created elements: -
*/
class ClientStatusError extends BadStatusError {
  clientMessage: string[];

  constructor(errorCode: number) {
    super(`Reason: server response with code ${errorCode}`, errorCode);
    this.clientMessage = [
      "Ошибка клиента"
    ];
  }
}
/*
class name: ServerStatusError

relativity: inherits BadStatusError

purpose: used for server errors(codes 500-599)
  provide messages for customAlert and other additorial info about error

structure of used surrounding: -

arguments: errorCode
  errorCode:string - code of error

output: object with fields
  stack - standard Error class property
  message - standard Error class property
  name - standard Error class property
    name changed to custom error class name
  statusCode - code of response
  clientMessage - text of customAlert paragraph


structure of created elements: -
*/
class ServerStatusError extends BadStatusError {
  clientMessage: string[];
  
  constructor(errorCode: number) {
    super(`Reason: server response with code ${errorCode}`, errorCode);
    this.clientMessage = [
      "Ошибка на сервере!",
    ];
  }
}

/*
class name: BadNetwork

relativity: inherits RequestError

purpose:represent errors which occure during fetch() and that are
  not related to response code. All errors that are thrown by fetch()

structure of used surrounding:-

arguments:message
  message:string - message property of Error thrown by fetch()

output: object with fields
  stack - standard Error class property
  message - standard Error class property
  name - standard Error class property
    name changed to custom error class name
  clientMessage - text of customAlert paragraph

structure of created elements:-
*/
class BadNetwork extends RequestError{
  clientMessage:string[];
  
  constructor(message:string){
    super(`Reason: Network problems during fetch ${message}`);
    this.name = "BadNetwork"
    this.clientMessage = [
      "Ошибка вызванная fetch"
    ];
  }
}

/*
class name: unknownError

relativity: inherits RequestError

purpose: used if catch block recieved not Error class instance as a parametr

structure of used surrounding:-

arguments:message
  message:string - message that this error has unknown origin

output: object with fields
  stack - standard Error class property
  message - standard Error class property
  name - standard Error class property
    name changed to custom error class name
  clientMessage - text of customAlert paragraph

structure of created elements:-
*/
class unknownError extends RequestError{
  clientMessage:string[];
  
  constructor(message:string){
    super(`unknown error: ${message}`);
    this.name = "unknownError"
    this.clientMessage = [
      "Неизвестная ошибка"
    ];
  }
}
//====================================MODULE CLASSES=============================================

//=========================================DEVELOPED=============================================
//=========================================DEVELOPED=============================================

//===========================================OTHER================================================
