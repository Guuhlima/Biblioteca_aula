import fastify from "fastify";
import { randomUUID } from "crypto";

import { RegisterUser } from "../usecases/RegisterUser";
import { BcryptHasher } from "../infra/crypto/BcryptHasher";
import { makeRegisterHandler } from "./controllers/registerUser";
import { PrismaUserRepository } from "../infra/repo/PrismaUserRepository";

export async function buildServer() {
    const app = fastify({ logger: true })

    const usersRepo = new PrismaUserRepository();
    const hasher = new BcryptHasher(10);
    const registerUser = new RegisterUser(usersRepo, hasher, () => randomUUID());

    app.post('/users', makeRegisterHandler(registerUser));
    app.get('/health', async () => ({ ok: true }));

    return app;
}

if (require.main === module) {
    (async () => {
        const app = await buildServer();
        const port = Number(process.env.PORT ?? 3333 );
        await app.listen({ port, host: '0.0.0.0' });
        app.log.info(`listening on http://localhost:${port}`);
    })();
}