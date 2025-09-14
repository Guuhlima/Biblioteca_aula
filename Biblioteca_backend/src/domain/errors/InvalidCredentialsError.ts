export class InvalidCredentialsError extends Error {
  constructor() {
    super("CREDENCIAIS_INVALIDAS");
  }
}