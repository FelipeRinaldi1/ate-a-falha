# Guia de Desenvolvimento

## Pré-requisitos

- Docker instalado
- Node.js
- npm 11+

## Comandos Principais

### Desenvolvimento

| Comando                 | Descrição                                          |
| ----------------------- | -------------------------------------------------- |
| `npm run setup`         | Sobe todos os serviços, aplica as migrations, seed |
| `npm run dev`           | Sobe todos os serviços                             |
| `npm run dev:all`       | Build + sobe tudo em background                    |
| `npm run dev:api`       | Sobe apenas o backend                              |
| `npm run dev:web`       | Sobe apenas o frontend                             |
| `npm run dev:build:api` | Rebuild do container da API                        |
| `npm run dev:build:web` | Rebuild do container do Web                        |

### Banco de Dados

| Comando                  | Descrição                                               |
| ------------------------ | ------------------------------------------------------- |
| `npm run db:migrate`     | Aplica migrations pendentes (produção)                  |
| `npm run db:migrate:dev` | Cria/aplica migration interativamente (desenvolvimento) |
| `npm run db:generate`    | Regenera o Prisma Client após alterar o schema          |
| `npm run db:seed`        | Executa o seed para popular o banco                     |
| `npm run db:studio`      | Abre o Prisma Studio                                    |

### Pipeline de Dados

| Comando                 | Descrição                  |
| ----------------------- | -------------------------- |
| `npm run data:pipeline` | Executa o container de ETL |

### Qualidade de Código

| Comando          | Descrição                           |
| ---------------- | ----------------------------------- |
| `npm run lint`   | Executa ESLint em todo o projeto    |
| `npm run format` | Formata todo o projeto com Prettier |
| `npm run build`  | Build de produção                   |

## Fluxo de Trabalho: Adicionar um Novo Campo

Exemplo: adicionar o campo `sodium` ao model `Food`.

### 1. Alterar o Schema Prisma

```prisma
// packages/database/prisma/schema.prisma
model Food {
  ...
  sodium Float
}
```

### 2. Criar Migration

```bash
npm run db:migrate:dev
# Digite o nome da migration quando solicitado
```

### 3. Atualizar o Schema Zod no Shared

```typescript
// packages/shared/src/schemas/nutrition/food.schema.ts
export const createFoodSchema = z.object({
  ...
  sodium: z.number().nonnegative(),
})
```

### 4. Atualizar o Frontend

O TypeScript vai avisar automaticamente nos componentes que usam `CreateFoodDTO`, guiando você para adicionar o novo campo no formulário.

## Fluxo de Trabalho: Criar um Novo Módulo

### 1. Backend — Criar as camadas

```
apps/api/src/modules/novo-modulo/
├── interfaces/    # Interfaces dos repositories
├── repositories/  # Queries Prisma
├── services/      # Lógica de negócio
├── controllers/   # Recebe request, valida, chama service
└── routers/       # Define rotas Express
```

### 2. Shared — Criar os schemas

```
packages/shared/src/schemas/novo-modulo/
└── recurso.schema.ts   # createSchema, updateSchema, searchSchema
```

Exportar no `packages/shared/src/index.ts`.

### 3. Frontend — Consumir

Importar os tipos do `@ate-a-falha/shared` e usar nos componentes React com `useQuery`/`useMutation`.

## Variáveis de Ambiente

Copiar `.env.example` para `.env` e preencher. As principais variáveis são:

| Variável                | Descrição                          | Exemplo                                         |
| ----------------------- | ---------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`          | Connection string do PostgreSQL    | `postgresql://user:pass@db:5432/ate_a_falha_db` |
| `API_PORT`              | Porta do backend                   | `3333`                                          |
| `WEB_PORT`              | Porta do frontend                  | `3000`                                          |
| `JWT_SECRET`            | Chave secreta para tokens JWT      | jwt_secret_here                                 |
| `VITE_API_URL`          | URL da API para o frontend         | `http://localhost:3333`                         |
| `ASSETS_EXERCISES_PATH` | Caminho para imagens de exercícios | `/app/packages/assets/exercises`                |
