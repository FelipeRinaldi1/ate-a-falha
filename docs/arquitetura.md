# Arquitetura - Até a Falha

## Visão Geral

O **Até a Falha** é um sistema de gerenciamento de dietas e treinos. O Docker Compose orquestra todos os serviços em desenvolvimento.

## Estrutura do Monorepo

```
ate-a-falha/
├── apps/
│   ├── api/          # Backend Express 5 + Prisma
│   └── web/          # Frontend React + Mantine v9
├── packages/
│   ├── database/     # Prisma Client, Schema, Migrations e Seeds
│   └── shared/       # Schemas Zod, Tipos, Result Pattern
├── pipeline/         # ETL para ingestão de dados (Python)
├── docs/             # Documentação do projeto
├── data/             # Dados brutos para pipeline
└── docker-compose.yml
```

## Pacotes e Responsabilidades

### `apps/api` — Backend

- **Framework:** Express 5
- **ORM:** Prisma
- **Autenticação:** JWT
- **Validação:** Zod
- **Logging:** Pino + pino-http
- **Documentação:** Swagger
- **Segurança:** Helmet, CORS, Rate Limiting

### `apps/web` — Frontend

- **Framework:** React 19 + Vite 8
- **UI Library:** Mantine v9
- **State Management:** TanStack React Query v5
- **HTTP Client:** Axios
- **Roteamento:** React Router v7

### `packages/database`

- Contém o `schema.prisma`, migrations, seeds e o Prisma Client gerado.
- Exporta tipos TypeScript derivados do Prism.
- Exporta a função utilitária `safeCall` para encapsular erros do Prisma em `Result`.

### `packages/shared`

- **Fonte Única de Verdade** para validação e tipagem.
- Contém todos os schemas Zod e seus tipos inferidos.
- Contém o **Result Pattern** usado em toda a API.
- Contém a interface AppError.
- **Importante:** Este pacote NÃO deve conter dependências exclusivas de Node.js, pois é consumido também pelo frontend.

### `pipeline/` — ETL (Python)

- Responsável por processar e transformar dados brutos de nutrição (tabela TACO) e biblioteca de exercícios, populando o banco de dados.

## Infraestrutura

| Serviço    | Container            | Porta | Descrição                |
| ---------- | -------------------- | ----- | ------------------------ |
| `db`       | ate-a-falha-db       | 5432  | PostgreSQL 18            |
| `api`      | ate-a-falha-api      | 3333  | Backend Express          |
| `web`      | ate-a-falha-web      | 3000  | Frontend Vite dev server |
| `pipeline` | ate-a-falha-pipeline | —     | ETL                      |

### Volumes

- O código fonte é montado em `.:/app` com `node_modules` isolado em volume anônimo `/app/node_modules` para evitar erros.
- O PostgreSQL persiste dados no volume `pgdata`.
