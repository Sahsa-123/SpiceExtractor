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
export class schemaDismatch extends Error{
    clientMessage:string[];
    
    constructor(message:string){
      super(`unknown error: ${message}`);
      this.name = "schemaDismatch"
      this.clientMessage = [
        "Ответ, полученный с сервера, не соотвествует ожидаемому"
      ];
    }
  }