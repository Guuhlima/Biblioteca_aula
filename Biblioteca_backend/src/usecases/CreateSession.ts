import { IUserRepository } from "../domain/ports/UserRepository";
import { Hasher } from "../domain/ports/Hasher";
import { ITokenProvider } from "../domain/ports/ITokenProvider";
import { InvalidCredentialsError } from "../domain/errors/InvalidCredentialsError";

type Input = { email: string; password: string }
type Output = { token: string; user: { id: string; nome: string; email: string }}

export class CreateSession {
    constructor(
        private user: IUserRepository,
        private hasher: Hasher,
        private tokens: ITokenProvider,
    ) {}

    async execute({ email, password }: Input): Promise<Output> {
        const user = await this.user.findByEmail(email);
        if(!user) throw new InvalidCredentialsError();

        const ok = await this.hasher.compare(password, user.passwordHash);
        if(!ok) throw new InvalidCredentialsError();

        const token = this.tokens.sign({ sub: user.id, email: user.email }, { expiresIn: "7d" });

        return {
            token,
            user: { id: user.id, nome: user.nome, email: user.email}
        }
    }
}