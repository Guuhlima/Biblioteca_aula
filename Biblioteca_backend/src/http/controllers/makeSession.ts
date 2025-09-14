import { FastifyRequest, FastifyReply } from "fastify";
import { sessionBodySchema } from "../validators/sessionSchemas";
import { CreateSession } from "../../usecases/CreateSession";
import { InvalidCredentialsError } from "../../domain/errors/InvalidCredentialsError";

type Req = FastifyRequest<{ Body: unknown }>;

export const makeSessionHandler = (usecase: CreateSession) =>
  async (req: Req, reply: FastifyReply) => {
    const parsed = sessionBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "ERRO AO VALIDAR",
        details: parsed.error.flatten(),
      });
    }

    try {
      const { email, password } = parsed.data;
      const out = await usecase.execute({ email, password });

      reply.setCookie("auth_token", out.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return reply.status(200).send({
        ok: true,
        user: out.user,
        token: out.token,
      });
    } catch (err: any) {
      if (err instanceof InvalidCredentialsError) {
        return reply.status(401).send({ error: "USUARIO_OU_SENHA_INVALIDOS" });
      }
      req.log.error({ err }, "login falhou");
      return reply.status(500).send({ error: "Internal Error" });
    }
  };