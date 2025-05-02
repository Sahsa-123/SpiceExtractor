/*
class name: schemaDismatch

relativity: inherits Error

purpose: used if during z.parse() occured error

structure of used surrounding:-

arguments:message
  message:string - message of error returned by zod parse

output: object with fields
  stack - standard Error class property
  message - standard Error class property
  name - standard Error class property
    name changed to custom error class name
  clientMessage - text which should be shown to customer/user

structure of created elements:-
*/
export class schemaDismatch extends Error{
    clientMessage:string[];
    
    constructor(message:string){
      super(`dismatch of schemas: ${message}`);
      this.name = "schemaDismatch"
      this.clientMessage = [
        "Возникли непредвиденные технические неполадки"
      ];
    }
  }