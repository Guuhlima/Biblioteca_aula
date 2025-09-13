import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { randomUUID } from "crypto";

import { RegisterUser } from "../usecases/RegisterUser";
import { BcryptHasher } from "../infra/crypto/BcryptHasher";
import { makeRegisterHandler } from "./controllers/registerUser";
import { PrismaUserRepository } from "../infra/repo/PrismaUserRepository";

export async function buildServer() {
  const app = fastify({ logger: true });

  await app.register(cors, {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || "dev-cookie",
  });

  const usersRepo = new PrismaUserRepository();
  const hasher = new BcryptHasher(10);
  const registerUser = new RegisterUser(usersRepo, hasher, () => randomUUID());

  await app.register(async (r) => {
    r.post("/users", makeRegisterHandler(registerUser));
    r.get("/health", async () => ({ ok: true }));
  }, { prefix: "/api" });

  return app;
}

if (require.main === module) {
  (async () => {
    const app = await buildServer();
    const port = Number(process.env.PORT ?? 3333);
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`listening on http://localhost:${port}`);
  })();
}
