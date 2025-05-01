
/*
class name: BadJSON

relativity: inherits Error

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
export class BadJSON extends Error{
    clientMessage:string[];
  
    constructor(getAPIName:string){
      super(`Reason: JSON from server parsing error in ${getAPIName}`);
      this.name = "BadJSON";
      this.clientMessage = [
        "Ошибка при конвертации JSON"
      ];
    }
  }