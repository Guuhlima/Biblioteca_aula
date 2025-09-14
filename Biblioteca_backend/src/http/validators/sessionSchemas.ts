import { z } from 'zod';

export const sessionBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export type SessionBody = z.infer<typeof sessionBodySchema>