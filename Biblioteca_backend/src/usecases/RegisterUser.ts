import { User } from "../domain/user";
import { IUserRepository } from "../domain/ports/UserRepository";
import { Hasher } from "../domain/ports/Hasher";
import { CreateUserDTO } from "../application/dtos/CreateUserDTO"

export class RegisterUser {
    constructor(
        private readonly users: IUserRepository,
        private readonly hasher: Hasher,
        private readonly idGen: () => string,
        private readonly now: () => Date = () => new Date()
    ) {}

    async execute(input: CreateUserDTO): Promise<{ id: string }> {
        const exists = await this.users.findByEmail(input.email);
        if(exists) {
            throw new Error('EMAIL JA EXISTE');
        }

        const passwordHash = await this.hasher.hash(input.password);

        const user = new User({
            id: this.idGen(),
            nome: input.nome,
            email: input.email.toLowerCase(),
            passwordHash,
            createdAt: this.now(),
        });

        await this.users.create(user);
        return { id: user.id };
    }
}