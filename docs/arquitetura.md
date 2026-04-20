# Arquitetura - Até a Falha

## Visão Geral

O **Até a Falha** é um sistema de gerenciamento de dietas e treinos, estruturado como um **monorepo** utilizando **npm workspaces** nativo. O Docker Compose orquestra todos os serviços em desenvolvimento.

## Estrutura do Monorepo

```
ate-a-falha/
├── apps/
│   ├── api/          # Backend Express 5 + Prisma
│   └── web/          # Frontend React + Mantine v9
├── packages/
│   ├── database/     # Prisma Client, Schema, Migrations e Seeds
│   ├── shared/       # Schemas Zod, Tipos, Result Pattern (compartilhado entre api e web)
│   ├── pipeline/     # ETL para ingestão de dados
│   └── assets/       # Arquivos estáticos
├── docs/             # Documentação do projeto
├── data/             # Dados brutos para pipeline
└── docker-compose.yml
```

## Pacotes e Responsabilidades

### `apps/api` — Backend

- **Framework:** Express 5
- **ORM:** Prisma (via `@ate-a-falha/database`)
- **Autenticação:** JWT (`jsonwebtoken`) com middleware `ensureAuthenticated`
- **Validação:** Zod (via `@ate-a-falha/shared`)
- **Logging:** Pino + pino-http
- **Documentação:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Segurança:** Helmet, CORS, Rate Limiting

### `apps/web` — Frontend

- **Framework:** React 19 + Vite 8
- **UI Library:** Mantine v9
- **State Management (Server):** TanStack React Query v5
- **HTTP Client:** Axios
- **Roteamento:** React Router v7

### `packages/database`

- Contém o `schema.prisma`, migrations, seeds e o Prisma Client gerado.
- Exporta tipos TypeScript derivados do Prisma (ex: `FoodFull`, `ExerciseFull`).
- Exporta a função utilitária `safeCall` para encapsular erros do Prisma em `Result`.

### `packages/shared`

- **Fonte Única de Verdade (Single Source of Truth)** para validação e tipagem.
- Contém todos os schemas Zod e seus tipos inferidos (`FoodSchema`, `FoodDTO`, etc.).
- Contém o **Result Pattern** (`Success`/`Failure`) usado em toda a API.
- Contém a interface `AppError` (tipos de erro padronizados).
- **Regra importante:** Este NÃO deve conter dependências exclusivas de Node.js (ex: `jsonwebtoken`, `bcrypt`), pois é consumido também pelo frontend.

### `packages/pipeline`

- Container Docker isolado com perfil `tools`.
- Responsável por processar e transformar dados brutos (ex: tabela TACO em JSON normalizado).

### `packages/assets`

- Armazena arquivos estáticos como imagens de exercícios.
- Servidos pela API via `express.static`.

## Fluxo de Dados

```
[Zod Schema (shared)] → define tipos e validação
        ↓                              ↓
   [Frontend]                     [Backend]
   useForm + schemaResolver       Controller → valida req.body
   api.get/post (Axios)           Service → lógica de negócio
        ↓                         Repository → Prisma query
   React Query cache                   ↓
                               [PostgreSQL via Prisma]
```

O ciclo completo garante que:

1. O **shared** define a forma dos dados.
2. O **frontend** valida no formulário ANTES de enviar.
3. O **backend** valida novamente no controller.
4. O **banco** aplica constraints do Prisma schema.

## Infraestrutura (Docker)

| Serviço    | Container            | Porta | Descrição                         |
| ---------- | -------------------- | ----- | --------------------------------- |
| `db`       | ate-a-falha-db       | 5432  | PostgreSQL 18                     |
| `api`      | ate-a-falha-api      | 3333  | Backend Express                   |
| `web`      | ate-a-falha-web      | 3000  | Frontend Vite dev server          |
| `pipeline` | ate-a-falha-pipeline | —     | ETL (perfil `tools`, sob demanda) |

### Volumes

- O código fonte é montado via bind mount (`.:/app`) com `node_modules` isolado em volume anônimo (`/app/node_modules`).
- O PostgreSQL persiste dados no volume `pgdata`.
