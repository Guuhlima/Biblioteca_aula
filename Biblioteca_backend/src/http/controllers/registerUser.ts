import { FastifyRequest, FastifyReply } from 'fastify'
import { registerBodySchema } from '../validators/userSchemas'
import { RegisterUser } from '../../usecases/RegisterUser'

type Req = FastifyRequest<{ Body: unknown}>;

export const makeRegisterHandler = (usecase: RegisterUser) =>
    async (req: Req, reply: FastifyReply) => {
        const parsed = registerBodySchema.safeParse(req.body);
        if (!parsed.success) {
            return reply.status(400).send({
                error: 'ERRO AO VALIDAR',
                details: parsed.error.flatten(),
            });
        }

        try {
            const { nome, email, password } = parsed.data;
            const out = await usecase.execute({ nome, email, password });
            return reply.status(201).send({ id: out.id })
        } catch (err: any) {
            if (err?.message === 'EMAIL JA EXISTE') {
                return reply.status(409).send({ error: 'EMAIL JA EXISTE'});
            }
            req.log.error({ err }, 'registro de usuario falhou');
            return reply.status(500).send({ error: 'Internal Error'});
        }
    }