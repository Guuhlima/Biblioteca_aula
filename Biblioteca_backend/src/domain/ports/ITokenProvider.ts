export interface TokenPayload {
  sub: string;
  email: string;
}

export interface ITokenProvider {
  sign(payload: TokenPayload, opts?: { expiresIn?: string | number }): string;
}