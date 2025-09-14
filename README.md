# 📚 Biblioteca Digital – Fullstack (Next.js + Fastify + Prisma)

Este projeto é um sistema fullstack de autenticação e gerenciamento de usuários, desenvolvido com foco nos princípios **SOLID** tanto no backend quanto no frontend.  
A aplicação conta com telas modernas (Next.js + Tailwind + Framer Motion) e uma API organizada em camadas (Fastify + Prisma + Use Cases).

---

## 🚀 Tecnologias

### Frontend
- [Next.js 13+](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (animações)
- [SweetAlert2](https://sweetalert2.github.io/) (feedback ao usuário)
- Arquitetura orientada a **use cases** no client (`useCases.auth.login`, etc.)

### Backend
- [Fastify](https://fastify.dev/) – servidor HTTP
- [Prisma](https://www.prisma.io/) – ORM
- [PostgreSQL] (ou outro banco de dados suportado pelo Prisma)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) – hashing de senhas
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) – autenticação JWT
- Organização em camadas:
  - **Domain** → entidades, interfaces (ports), erros
  - **UseCases** → regras de negócio (`RegisterUser`, `CreateSession`)
  - **Infra** → adapters concretos (Prisma, Bcrypt, JWT)
  - **HTTP** → handlers e rotas (controllers)
- Validação com [zod](https://zod.dev/)

---

## 📂 Estrutura do Projeto

Backend_Biblioteca
src/
 ├─ adapters/
 │   └─ auth/
 │       └─ AuthApi.ts         # implementação concreta (chamadas HTTP)
 │
 ├─ app/                       # Next.js (App Router)
 │   ├─ api/                   # rotas API (proxy/middleware)
 │   ├─ dashboard/             # página protegida
 │   ├─ login/                 # tela de login
 │   ├─ register/              # tela de registro
 │   ├─ layout.tsx             # layout global
 │   ├─ page.tsx               # página inicial
 │   └─ globals.css
 │
 ├─ core/                      # Domínio do front (DDD-like)
 │   └─ auth/
 │       ├─ models.ts          # entidades (ex.: User, Session)
 │       ├─ ports.ts           # contratos (IAuthApi, IAuthUseCase)
 │       └─ usecases.ts        # casos de uso (login, register, logout)
 │
 ├─ lib/
 │   ├─ di/                    # injeção de dependências (container)
 │   └─ http/                  # fetchClient etc.
 │
 ├─ ui/                        # Componentes visuais
 │   ├─ components/
 │   │   ├─ Button.tsx
 │   │   └─ Input.tsx
 │   └─ features/auth/
 │       ├─ components/        # blocos de UI específicos de auth
 │       └─ hooks/             # custom hooks (ex.: useAuth)
 │
 └─ ...

Backend_Frontend
src/
 ├─ application/
 │   └─ dtos/                 # Objetos de transporte (CreateUserDTO, etc.)
 │
 ├─ domain/                   # Regras de domínio
 │   ├─ errors/               # Erros de negócio (InvalidCredentialsError)
 │   └─ ports/                # Interfaces (contratos) → DIP
 │       ├─ Hasher.ts
 │       ├─ ITokenProvider.ts
 │       └─ UserRepository.ts
 │   └─ user.ts               # Entidade de usuário
 │
 ├─ http/                     # Camada de entrega (Fastify controllers)
 │   ├─ controllers/
 │   │   ├─ loginUser.ts
 │   │   ├─ makeSession.ts
 │   │   └─ registerUser.ts
 │   ├─ validators/           # Validações com zod
 │   │   ├─ sessionSchemas.ts
 │   │   └─ userSchemas.ts
 │   └─ server.ts             # bootstrap do Fastify
 │
 ├─ infra/                    # Implementações concretas (adapters)
 │   ├─ crypto/               # Hash de senhas
 │   │   └─ BcryptHasher.ts
 │   ├─ db/
 │   │   └─ prisma.ts         # client Prisma
 │   ├─ repo/
 │   │   └─ PrismaUserRepository.ts
 │   └─ JwtTokenProvider.ts   # JWT adapter
 │
 ├─ usecases/                 # Casos de uso (aplicação)
 │   ├─ CreateSession.ts
 │   └─ RegisterUser.ts
 │
 └─ .env     

 ---

## 🧩 SOLID na prática

**Backend**
- **SRP**: cada classe tem uma única responsabilidade (ex.: `CreateSession`, `RegisterUser`).
- **OCP**: estendemos via novas implementações (ex.: outro token provider) sem mexer nos casos de uso.
- **LSP**: qualquer `UserRepository` pode substituir outro (Prisma, memória).
- **ISP**: interfaces pequenas (`Hasher`, `ITokenProvider`, `UserRepository`).
- **DIP**: casos de uso dependem de **interfaces**; composição acontece na camada HTTP (controllers/rotas).

**Frontend**
- **SRP**: UI não conhece HTTP; fala com `usecases`.
- **OCP/DIP**: `AuthUseCases` depende de `IAuthApi`. Trocar REST por GraphQL = trocar **adapter**.
- **ISP**: contratos finos no `core/auth/ports.ts`.

---

## 🔐 Fluxo de autenticação

```mermaid
sequenceDiagram
  autonumber
  participant UI as UI (Login/Register)
  participant UC as AuthUseCases (front)
  participant API as AuthApi (adapter)
  participant BFF as Fastify (controllers)
  participant APP as UseCases (back)
  participant DB as Prisma/DB

  UI->>UC: login(email, senha)
  UC->>API: POST /sessions
  API->>BFF: request (email, password)
  BFF->>APP: CreateSession.execute()
  APP->>DB: findByEmail + bcrypt.compare
  DB-->>APP: user/passwordHash
  APP-->>BFF: token + user
  BFF-->>API: 200 (set-cookie auth_token)
  API-->>UC: { user }
  UC-->>UI: ok (navega para /dashboard)

⚙️ Como rodar
1) Pré-requisitos

Node 18+

Banco compatível com Prisma (ex.: PostgreSQL)

pnpm/npm/yarn (use o que preferir)

2) Backend
cd biblioteca_backend
cp .env.example .env   # crie se não existir
# configure:
# DATABASE_URL="postgresql://user:pass@localhost:5432/biblioteca"
# JWT_SECRET="uma-chave-secreta"
# COOKIE_SECRET="cookie-secreto"

npm i
npx prisma migrate dev
npm run dev


Por padrão: http://localhost:3333.

Endpoints principais

POST /users – cria usuário { nome, email, password } → 201

POST /sessions – login { email, password } → 200 + cookie auth_token

DELETE /sessions – logout → 204 (limpa cookie)

GET /me – retorna usuário autenticado (JWT) → 200

Exemplos (curl)

# registro
curl -i -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"nome":"Gustavo","email":"g@ex.com","password":"123456"}'

# login
curl -i -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"g@ex.com","password":"123456"}'

# me (copie o cookie auth_token da resposta de login)
curl -i http://localhost:3333/me \
  -H "Cookie: auth_token=SEU_TOKEN_AQUI"

3) Frontend
cd biblioteca_frontend
cp .env.example .env.local   # crie se não existir
# configure uma das opções:

# (A) Chamar backend direto:
# NEXT_PUBLIC_API_URL="http://localhost:3333"

# (B) Usar proxy Next (chamar /api/* no front):
# NEXT_PUBLIC_API_URL="http://localhost:3333"  # proxy repassa

npm i
npm run dev


Acesse http://localhost:3000.

No front, as telas Login e Register já usam animações (Framer Motion), UI (Tailwind) e o fluxo via use cases + DI.

🔧 Configuração de HTTP no Front

src/lib/http/HttpClient.ts usa NEXT_PUBLIC_API_URL e envia credentials: "include" para manter o cookie auth_token.

Se preferir evitar CORS, ative o proxy (rotas Next API em src/app/api/...) e aponte o AuthApi.ts para /api/sessions, /api/users, /api/me.

🛡️ Segurança

Senhas nunca são salvas em texto: bcrypt.hash no RegisterUser.

JWT assinado com JWT_SECRET e armazenado em cookie httpOnly.

Middleware de autenticação (opcional) valida o token antes de rotas privadas (/me, etc.).

🧪 Testes (sugestão)

UseCases: testar CreateSession e RegisterUser com mocks de UserRepository, Hasher, TokenProvider.

HTTP: e2e com fastify.inject().

Exemplo (pseudo):

it("should create session", async () => {
  repo.findByEmail.mockResolvedValue({ id: "1", email: "...", passwordHash: hash });
  hasher.compare.mockResolvedValue(true);
  const out = await usecase.execute({ email, password });
  expect(out.token).toBeDefined();
});

🧭 Troubleshooting

404 POST /users ou /sessions
→ rota não registrada ou URL errada (ex.: prefix /v1). Verifique server.ts e baseURL.

USUARIO_OU_SENHA_INVALIDOS
→ usuário não existe ou senha salva sem hash. Gere usuário via /users (com bcrypt) e tente login.

Erro TypeScript no jsonwebtoken (expiresIn)
→ tipar como number | ms.StringValue. No adapter:

import type { StringValue } from "ms";
const options: SignOptions = { expiresIn: ("7d" as StringValue) };


CORS
→ habilite @fastify/cors com { origin: true, credentials: true } e use credentials: "include" no front.
→ alternativa: use proxy via rotas /api/* do Next.

🗺️ Roadmap

 Logout (DELETE /sessions) – limpar cookie

 Middleware jwtVerify e rotas privadas

 Página /profile usando /me

 Testes unitários e e2e

 Deploy (Vercel para front, Render/Railway para back)

📄 Licença

MIT – use, modifique e brilhe ✨
