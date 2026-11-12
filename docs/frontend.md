# Frontend

O frontend fica em `apps/web` e é uma aplicação React com TypeScript, empacotada pelo Vite.

## Stack principal

- React + TypeScript
- Vite (build e dev server)
- React Router (`react-router-dom`) para roteamento
- Mantine UI (`@mantine/core`, `@mantine/dates`, `@mantine/charts`, `@mantine/notifications`, `@mantine/modals`) para interface, tema e gráficos
- TanStack React Query para cache e sincronização de requisições
- Axios para chamadas HTTP

## Inicialização e providers

O ponto de entrada em `apps/web/src/main.tsx` envolve a aplicação na seguinte ordem de providers:

1. `QueryClientProvider` (`src/providers/queryClient.tsx`)
2. `MantineProvider` com `theme` de `src/theme.ts` e `defaultColorScheme="dark"`
3. `Notifications` e `ModalsProvider`
4. `AuthProvider` (`src/providers/AuthProvider.tsx`)
5. `App` (`src/App.tsx`), que renderiza o `RouterProvider`

## Comunicação com a API

O cliente HTTP fica em `apps/web/src/api/axiosInstance.ts`:

- Lê a URL base de `VITE_API_URL` (se não estiver definida, usa `http://localhost:3333/api/v1`) e garante o sufixo `/api/v1`.
- Envia `withCredentials: true` em todas as chamadas para trafegar o cookie de sessão JWT.
- Registra um interceptor de resposta que aciona `unauthorizedHandler` sempre que a API retorna `401` fora das rotas de login, registro e logout.

## Organização por features

Em vez de separar todo o projeto por tipo de arquivo, `apps/web/src/features/` agrupa o código por domínio:

- `user`: autenticação (`LoginForm`, `RegisterForm`), perfil (`Profile.page.tsx`) e subpasta `bodyMetric` (cadastro inicial, edição, nova medição e evolução).
- `workout`: dashboard, planos de treino, edição de ficha, seleção e execução de treino ativo, catálogo de exercícios e compartilhamento.
- `nutrition`: diário alimentar, metas, detalhes de refeição, busca de alimentos, criação de alimento e compartilhamento.
- `notification`: componente `NotificationBell` e listagem de notificações.

Dentro de cada feature ficam as subpastas `api/` (chamadas Axios), `hooks/` (hooks do React Query), `components/` e `pages/`.

## Rotas e controle de acesso

As rotas estão em `apps/web/src/routes/router.tsx`:

- `ProtectedRoute`: exige usuário autenticado (redireciona para o login se não houver sessão).
- `PublicRoute`: rotas de entrada como `/login` e `/register`.
- Rotas públicas de compartilhamento: `/share/workout/:id` e `/share/diet/:id` podem ser acessadas sem login.

## Utilitários e testes

- `apps/web/src/utils/errorTranslator.ts`: traduz códigos de erro da API para mensagens amigáveis na interface.
- Testes unitários e de componentes rodam com Vitest (`apps/web/vitest.config.ts`) e setup em `apps/web/src/test/`.
