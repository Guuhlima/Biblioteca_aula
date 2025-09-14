# 📚 Biblioteca Digital – Fullstack (Next.js + Fastify + Prisma)

Este projeto é um sistema fullstack de autenticação e gerenciamento de usuários, desenvolvido com foco nos princípios **SOLID** tanto no backend quanto no frontend.  
A aplicação conta com telas modernas (Next.js + Tailwind + Framer Motion) e uma API organizada em camadas (Fastify + Prisma + Use Cases).

---

## 🚀 Tecnologias

### Frontend
- Next.js 13+ (App Router)
- React
- TailwindCSS
- Framer Motion (animações)
- SweetAlert2 (feedback ao usuário)
- Arquitetura orientada a **use cases** no client (`useCases.auth.login`, etc.)

### Backend
- Fastify – servidor HTTP
- Prisma – ORM
- PostgreSQL (ou outro banco de dados suportado pelo Prisma)
- bcryptjs – hashing de senhas
- jsonwebtoken – autenticação JWT
- Organização em camadas:
  - Domain → entidades, interfaces (ports), erros
  - UseCases → regras de negócio (`RegisterUser`, `CreateSession`)
  - Infra → adapters concretos (Prisma, Bcrypt, JWT)
  - HTTP → handlers e rotas (controllers)
- Validação com zod

---

## 📂 Estrutura do Projeto

### Frontend (`biblioteca_frontend/`)

src/  
 ├─ adapters/  
 │   └─ auth/  
 │       └─ AuthApi.ts         # implementação concreta (chamadas HTTP)  
 ├─ app/                       # Next.js (App Router)  
 │   ├─ api/                   # rotas API (proxy/middleware)  
 │   ├─ dashboard/             # página protegida  
 │   ├─ login/                 # tela de login  
 │   ├─ register/              # tela de registro  
 │   ├─ layout.tsx             # layout global  
 │   ├─ page.tsx               # página inicial  
 │   └─ globals.css  
 ├─ core/                      # Domínio do front (DDD-like)  
 │   └─ auth/  
 │       ├─ models.ts          # entidades (ex.: User, Session)  
 │       ├─ ports.ts           # contratos (IAuthApi, IAuthUseCase)  
 │       └─ usecases.ts        # casos de uso (login, register, logout)  
 ├─ lib/  
 │   ├─ di/                    # injeção de dependências (container)  
 │   └─ http/                  # fetchClient etc.  
 ├─ ui/                        # Componentes visuais  
 │   ├─ components/  
 │   │   ├─ Button.tsx  
 │   │   └─ Input.tsx  
 │   └─ features/auth/  
 │       ├─ components/        # blocos de UI específicos de auth  
 │       └─ hooks/             # custom hooks (ex.: useAuth)  

---

### Backend (`biblioteca_backend/`)

src/  
 ├─ application/  
 │   └─ dtos/                 # Objetos de transporte (CreateUserDTO, etc.)  
 ├─ domain/                   # Regras de domínio  
 │   ├─ errors/               # Erros de negócio (InvalidCredentialsError)  
 │   └─ ports/                # Interfaces (contratos) → DIP  
 │       ├─ Hasher.ts  
 │       ├─ ITokenProvider.ts  
 │       └─ UserRepository.ts  
 │   └─ user.ts               # Entidade de usuário  
 ├─ http/                     # Camada de entrega (Fastify controllers)  
 │   ├─ controllers/  
 │   │   ├─ loginUser.ts  
 │   │   ├─ makeSession.ts  
 │   │   └─ registerUser.ts  
 │   ├─ validators/           # Validações com zod  
 │   │   ├─ sessionSchemas.ts  
 │   │   └─ userSchemas.ts  
 │   └─ server.ts             # bootstrap do Fastify  
 ├─ infra/                    # Implementações concretas (adapters)  
 │   ├─ crypto/               # Hash de senhas  
 │   │   └─ BcryptHasher.ts  
 │   ├─ db/  
 │   │   └─ prisma.ts         # client Prisma  
 │   ├─ repo/  
 │   │   └─ PrismaUserRepository.ts  
 │   └─ JwtTokenProvider.ts   # JWT adapter  
 ├─ usecases/                 # Casos de uso (aplicação)  
 │   ├─ CreateSession.ts  
 │   └─ RegisterUser.ts  
 └─ .env  

---

## 🧩 SOLID na prática

**Backend**
- SRP: cada classe tem uma única responsabilidade (`CreateSession`, `RegisterUser`).  
- OCP: estendemos via novas implementações sem mexer nos casos de uso.  
- LSP: qualquer `UserRepository` pode substituir outro.  
- ISP: interfaces pequenas (`Hasher`, `ITokenProvider`, `UserRepository`).  
- DIP: casos de uso dependem de interfaces; composição acontece nos controllers.

**Frontend**
- SRP: UI não conhece HTTP; fala com `usecases`.  
- OCP/DIP: `AuthUseCases` depende de `IAuthApi`.  
- ISP: contratos finos no `core/auth/ports.ts`.

---

## 🔐 Fluxo de autenticação

UI → UseCases (front) → AuthApi (adapter) → Fastify (controller) → UseCases (back) → Prisma/DB  

---

## ⚙️ Rodando o Projeto

### 1) Pré-requisitos
- Node.js 18+
- Banco compatível com Prisma (ex.: PostgreSQL)
- pnpm / npm / yarn

---

### 2) Subir o Backend

```
cd biblioteca_backend
cp .env.example .env   # configure as variáveis

# exemplo .env
DATABASE_URL="postgresql://user:pass@localhost:5432/biblioteca"
JWT_SECRET="uma-chave-secreta"
COOKIE_SECRET="cookie-secreto"

npm install
npx prisma migrate dev
npm run dev

```

### 3) Subir o Frontend

cd biblioteca_frontend
cp .env.example .env.local   # configure a URL do backend

# exemplo .env.local
NEXT_PUBLIC_API_URL="http://localhost:3333"

npm install
npm run dev

# o frontend sobe em:
# http://localhost:3000

### 4) Rodando os dois juntos

# abra dois terminais separados:

# terminal 1 → backend
cd biblioteca_backend
npm run dev

# terminal 2 → frontend
cd biblioteca_frontend
npm run dev

# agora:
# backend:  http://localhost:3333
# frontend: http://localhost:3000

## 🛡️ Segurança

- Senhas com bcrypt hash  
- JWT assinado e armazenado em cookie httpOnly  
- Middleware de autenticação (`jwtVerify`) em rotas privadas

