import { z } from 'zod';

export const registerBodySchema = z.object({
    nome: z.string().min(1).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(128),
});

export type RegisterBody = z.infer<typeof registerBodySchema>