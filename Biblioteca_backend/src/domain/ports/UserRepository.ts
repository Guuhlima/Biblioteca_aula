import { User } from "../../domain/user"

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<void>
}
