# Packages

O diretório `packages/` guarda o código compartilhado entre frontend, backend e banco de dados. Isso evita reescrever validações, cálculos e tipos em lugares diferentes.

## `@ate-a-falha/shared` (`packages/shared`)

Contém regras puras, contratos de validação e tipos que funcionam tanto no browser (`apps/web`) quanto no Node.js (`apps/api`).

- `src/result.ts` e `src/appError.ts`: implementam o padrão `Result` (`success` e `failure`) junto ao tipo `AppError`, permitindo tratar erros de domínio sem depender de `try/catch` espalhado.
- `src/validateData.ts`: utilitário que executa a validação de dados com schemas Zod e retorna um `Result`.
- `src/schemas/`: schemas Zod divididos por módulo (`user/`, `workout/`, `nutrition/`). São usados para validar formulários no front e payloads na API.
- `src/logic/`: funções puras de cálculo com testes unitários (`*.spec.ts`), incluindo:
  - `bodyMetric.logic.ts`: cálculos de medidas corporais (como IMC, TMB e TDEE).
  - `nutrition.logic.ts`: cálculos nutricionais de refeições e metas.
- `src/authenticatedUser.ts`: tipo do usuário autenticado anexado ao contexto da requisição.

## `@ate-a-falha/database` (`packages/database`)

Centraliza tudo que envolve o PostgreSQL e o Prisma:

- `prisma/schema.prisma`: definição de tabelas, relações e enums.
- `src/client.ts`: cria e exporta a instância compartilhada do `PrismaClient` usando `pg` (`Pool`) e `@prisma/adapter-pg`.
- `src/safeCall.ts`: encapsula chamadas ao Prisma convertendo exceções de banco em `Result` (`success`/`failure`) com `AppError`.
- `src/seeds/`: scripts que populam o catálogo de alimentos, exercícios e o usuário de demonstração (`user.seed.ts`).
- `src/types/`: tipos auxiliares para `nutrition` e `workout`.

Quando o schema muda, o build do pacote roda `prisma generate`, compila o TypeScript e copia o cliente gerado para `dist/generated/`.
