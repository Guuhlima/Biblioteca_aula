import { prisma } from '../db/prisma'
import { User } from '../../domain/user'
import { IUserRepository } from '../../domain/ports/UserRepository'

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { email } })
    if (!row) return null

    return new User({
      id: row.id,
      nome: row.nome ?? '',
      email: row.email,
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
    })
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        passwordHash: user.passwordHash,
      },
    })
  }
}
