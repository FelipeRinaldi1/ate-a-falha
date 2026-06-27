# Guia de Desenvolvimento

## Pré-requisitos

- Docker instalado
- Node.js
- npm 11+

## Comandos Principais

### Desenvolvimento

| Comando                 | Descrição                                               |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev:setup`     | Sobe todos os serviços, aplica migrations e seed (setup)|
| `npm run dev`           | Sobe todos os serviços via Docker Compose               |
| `npm run dev:shutdown`  | Para e remove todos os containers                       |
| `npm run dev:api`       | Sobe apenas o container da API (backend)                |
| `npm run dev:web`       | Sobe apenas o container do Web (frontend)               |
| `npm run dev:build`     | Rebuilda todos os containers do Docker                  |

### Banco de Dados

| Comando                  | Descrição                                               |
| ------------------------ | ------------------------------------------------------- |
| `npm run db:migrate`     | Aplica migrations pendentes (produção/local)            |
| `npm run dev:db:migrate` | Executa migrations dentro do container da API           |
| `npm run dev:db:migrate:save` | Cria uma nova migration de forma interativa        |
| `npm run db:generate`    | Regenera o Prisma Client após alterar o schema          |
| `npm run db:seed`        | Executa o seed para popular o banco de dados            |
| `npm run db:studio`      | Abre a interface visual do Prisma Studio                |

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
npm run dev:db:migrate:save
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
| `ASSETS_EXERCISES_PATH` | Caminho para imagens de exercícios | `/app/apps/api/public/exercises`                |
