# Arquitetura

O Até a Falha é um monorepo npm. Aplicativos e pacotes compartilham tipos, validações e regras de negócio pelo workspace, evitando duplicação entre frontend e backend.

## Visão geral dos workspaces

```text
ate-a-falha/
├── apps/
│   ├── api/            # Servidor Express + TypeScript
│   └── web/            # Aplicação React + Vite + Mantine UI
├── packages/
│   ├── database/       # Prisma, migrations, seeds e cliente PostgreSQL
│   └── shared/         # Schemas Zod, lógica de cálculo e tipo Result
├── pipeline/           # Container auxiliar para carga de dados
└── e2e/                # Testes ponta a ponta com Playwright
```

### Frontend (`apps/web`)

O frontend é organizado por funcionalidade dentro de `apps/web/src/features/`:

- `user`: login, cadastro, perfil e métricas corporais (`bodyMetric`).
- `workout`: dashboard de treinos, planos, edição de fichas, execução de treino ativo e catálogo de exercícios.
- `nutrition`: diário alimentar, metas nutricionais, detalhes de refeição, busca e criação de alimentos.
- `notification`: sino e listagem de notificações.

Cada feature costuma separar chamadas HTTP (`api/`), hooks com React Query (`hooks/`) e páginas/componentes (`pages/`, `components/`). As rotas ficam centralizadas em `apps/web/src/routes/router.tsx`, protegidas por `ProtectedRoute` e `PublicRoute` junto ao `AuthProvider`.

### Backend (`apps/api`)

A API usa Express e segue uma divisão em camadas por módulo (`user`, `workout`, `nutrition`, `notification`, `share`):

1. `routers`: define os caminhos HTTP e aplica middlewares como `ensureAuthenticated`.
2. `controllers`: lê dados da requisição (`params`, `query`, `body`), chama o service e devolve a resposta HTTP.
3. `services`: aplica regras de negócio, validações e controle de acesso entre usuários.
4. `repositories`: encapsula as consultas ao Prisma e usa `safeCall` de `@ate-a-falha/database`.

Os módulos são montados em `apps/api/src/app.ts` sob o prefixo `/api/v1` (definido em `apps/api/src/constants/global/baseURL.ts`).

### Pacotes compartilhados (`packages/shared` e `packages/database`)

- `@ate-a-falha/shared`: concentra os schemas Zod (usados tanto nos formulários do React quanto nos controllers/services da API), o padrão `Result` (`success`/`failure` e `AppError`) e cálculos compartilhados como IMC, TMB, TDEE e totais nutricionais.
- `@ate-a-falha/database`: centraliza o `schema.prisma`, o cliente `PrismaClient` com `@prisma/adapter-pg` e `pg`, além dos scripts de migration e seed.

## Fluxo de uma requisição

1. O usuário interage com uma página em `apps/web`, que dispara uma query ou mutation via Axios (`apps/web/src/api/axiosInstance.ts`).
2. A requisição chega ao Express em `apps/api`, passando por `pinoHttp` (logs), `helmet`, `cors`, `apiRateLimiter`, `express.json()` e `cookieParser()`.
3. Em rotas privadas, `ensureAuthenticated` extrai o JWT do cookie `token` ou do header `Authorization: Bearer <token>`, valida a assinatura com `JWT_SECRET` e carrega o usuário no `req.user`.
4. O controller chama o service, que valida os dados com Zod e consulta o banco pelo repository.
5. Se algo falhar, o erro cai no `globalErrorHandler` e volta padronizado em JSON.

## Assets de exercícios

A API serve imagens estáticas dos exercícios em `/api/v1/assets/exercises`. Na inicialização (`apps/api/src/app.ts`), ela verifica se `ASSETS_EXERCISES_PATH` aponta para um diretório válido. Se não estiver definido, procura automaticamente por `public/exercises` nos caminhos padrão do servidor.

## Testes

- Unitários e de integração: rodam com Vitest nos workspaces (`apps/api`, `apps/web` e `packages/shared`) via `npm run test:unit`.
- Ponta a ponta: rodam com Playwright na pasta `e2e/` via `npm run test:e2e`.
