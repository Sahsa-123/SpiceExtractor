//===================================MAIN SUGGESTIONS============================================
// discuss error texts
//===================================MAIN SUGGESTIONS============================================

//==================================MODULE DESCRIPTION===========================================
/*
purpose: custom Errors for further development of project

coused modules:-

main function:-

helping functions:-
*/
export { BadStatusError, ClientStatusError, ServerStatusError, BadJSON, BadNetwork, unknownError, CustomError, schemaDismatch }
//==================================MODULE DESCRIPTION===========================================

//====================================MODULE CLASSES=============================================

abstract class CustomError extends Error {
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
abstract class BadStatusError extends CustomError {
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
      "Работа сервиса нестабильна!",
      "Изменения могут не сохраниться.",
      "Текущие значения взяты из кэша.",
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
      "Наш сервер временно не доступен!",
      "Изменения могут не сохраниться.",
      "Текущие значения взяты из кэша.",
    ];
  }
}

/*
class name: BadJSON

relativity: inherits CustomError

purpose: represent error ocured during execution of JSON.parse()

structure of used surrounding:-

arguments: getAPIName
  getAPIName:string - name of function which send request to server

output: object with fields
  stack - standard Error class property
  message - standard Error class property
  name - standard Error class property
    name changed to custom error class name
  clientMessage - text of customAlert paragraph

structure of created elements:-
*/
class BadJSON extends CustomError{
  clientMessage:string[];

  constructor(getAPIName:string){
    super(`Reason: JSON from server parsing error in ${getAPIName}`);
    this.name = "BadJSON";
    this.clientMessage = ["Сервис временно не доступеню!","Текущие значения взяты из кэша."];
  }
}

/*
class name: BadNetwork

relativity: inherits CustomError

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
class BadNetwork extends CustomError{
  clientMessage:string[];
  
  constructor(message:string){
    super(`Reason: Network problems during fetch ${message}`);
    this.name = "BadNetwork"
    this.clientMessage = ["Сервис временно не доступен!","Текущие значения взяты из кэша."];
  }
}

/*
class name: unknownError

relativity: inherits CustomError

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
class unknownError extends CustomError{
  clientMessage:string[];
  
  constructor(message:string){
    super(`unknown error: ${message}`);
    this.name = "unknownError"
    this.clientMessage = ["Сервис временно не доступен!","Текущие значения взяты из кэша."];
  }
}

/*
class name: schemaDismatch

relativity: inherits CustomError

purpose: used if during z.parse() occured error

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
class schemaDismatch extends CustomError{
  clientMessage:string[];
  
  constructor(message:string){
    super(`unknown error: ${message}`);
    this.name = "schemaDismatch"
    this.clientMessage = ["Сервис временно не доступен!","Текущие значения взяты из кэша."];
  }
}
//====================================MODULE CLASSES=============================================

//=========================================DEVELOPED=============================================
//=========================================DEVELOPED=============================================

//===========================================OTHER================================================
