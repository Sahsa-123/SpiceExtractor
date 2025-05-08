/*
  class name: BadJSON

  relativity: inherits Error

  purpose: represent error ocured during execution of JSON.parse()

  structure of used surrounding: -

  arguments: message
    message: string - message of error returned by JSON.parse()

  output: object with fields
    stack - standard Error class property
    message - standard Error class property
    name - standard Error class property
        name changed to custom error class name
    clientMessage - text of customAlert paragraph

  structure of created elements: -
*/
export class BadJSON extends Error {
  clientMessage: string[];
  
  constructor(message: string) {
    super(`Reason: JSON from server parsing error in ${message}`);
    this.name = "BadJSON";
    this.clientMessage = [
      "Возникли непредвиденные технические неполадки"
    ];
  }
}