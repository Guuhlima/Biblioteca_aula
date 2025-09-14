import { sign, type SignOptions, type Secret } from "jsonwebtoken";
import type { StringValue } from "ms";
import { ITokenProvider, TokenPayload } from "../../domain/ports/ITokenProvider";

type ExpiresIn = number | StringValue;

export class JwtTokenProvider implements ITokenProvider {
  private readonly secret: Secret;

  constructor(secretFromEnv?: string) {
    const resolved = secretFromEnv ?? process.env.JWT_SECRET ?? "dev-secret";
    this.secret = resolved as Secret;
  }

  sign(payload: TokenPayload, opts?: { expiresIn?: ExpiresIn }): string {
    const options: SignOptions = {
      expiresIn: opts?.expiresIn ?? ("7d" as StringValue),
    };
    return sign(payload as object, this.secret, options);
  }
}
