export class SchemaDismatchError extends Error {
  clientMessage: string[];

  constructor(message: string) {
    super(`Schema validation failed: ${message}`);
    this.name = "SchemaDismatchError";
    this.clientMessage = [
      "Данные с сервера не соответствуют ожидаемой структуре",
      "Возможно, API изменилось или повреждено"
    ];
  }
}
