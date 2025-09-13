import bcrypt from 'bcryptjs'
import { Hasher } from '../../domain/ports/Hasher'

export class BcryptHasher implements Hasher {
    constructor(private readonly rounds = 10) {}
    hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, this.rounds);
    }

    compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}