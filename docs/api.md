# API

A API REST fica em `apps/api` e responde sob o prefixo `/api/v1` (definido em `apps/api/src/constants/global/baseURL.ts`).

## Autenticação e comportamento geral

- Como autenticar: o middleware `ensureAuthenticated` aceita o token JWT tanto no cookie `token` quanto no header `Authorization: Bearer <token>`.
- Segurança e limites: a aplicação configura `trust proxy`, `helmet`, `cors` (controlado por `CORS_ORIGIN`) e rate limiting (`apiRateLimiter`).
- Rotas inexistentes: qualquer rota não mapeada retorna status `404` com `{ status: 'error', code: 'NOT_FOUND', message, details: null }`.

## Health check

- `GET /health` e `GET /api/v1/health`: executa `SELECT 1` no PostgreSQL via Prisma. Retorna `200` com `{ status: 'ok', database: 'connected' }` quando o banco responde, ou `500` com `{ status: 'error', database: 'disconnected' }` caso contrário.

## Endpoints por módulo

### Usuários e medidas (`/api/v1/users`)

Rotas públicas:
- `POST /register`: cria conta e credenciais de acesso.
- `POST /login`: autentica e retorna/define o token JWT.
- `POST /logout`: encerra a sessão.

Rotas autenticadas:
- `GET /me`: dados do usuário logado.
- `PUT /me`: atualiza dados do perfil.
- `DELETE /me`: remove a conta.
- `PATCH /me/password`: altera a senha.
- `PATCH /me/email`: altera o e-mail.
- `POST /body-metrics`: registra nova medição corporal.
- `GET /body-metrics`: lista o histórico de medições.
- `GET /body-metrics/:id`: busca uma medição específica.
- `PATCH /body-metrics/:id`: atualiza uma medição.
- `DELETE /body-metrics/:id`: remove uma medição.

### Treinos (`/api/v1/workout`)

Planos e treinos:
- `POST /plans`, `GET /plans`, `GET /plans/:id`, `PATCH /plans/:id`, `DELETE /plans/:id`
- `GET /plans/:id/export`: exporta um plano para compartilhamento.
- `POST /plans/:id/import`: importa um plano compartilhado.
- `POST /plans/:planId/workouts`, `GET /plans/:planId/workouts`, `GET /workouts/:id`, `PATCH /workouts/:id`, `DELETE /workouts/:id`

Exercícios do treino e séries:
- `POST /workouts/:workoutId/exercises`, `GET /workouts/:workoutId/exercises`, `GET /workout-exercises/:id`, `PATCH /workout-exercises/:id`, `DELETE /workout-exercises/:id`
- `POST /workout-exercises/:workoutExerciseId/sets`, `PUT /workout-exercises/:workoutExerciseId/sets`, `GET /workout-exercises/:workoutExerciseId/sets`, `GET /sets/:id`, `PATCH /sets/:id`, `DELETE /sets/:id`

Catálogo de exercícios:
- `GET /exercise-catalog` e `GET /exercise-catalog/:id`: consulta aberta ao catálogo.
- `POST /exercise-catalog`, `PATCH /exercise-catalog/:id`, `DELETE /exercise-catalog/:id`: exigem autenticação.

### Nutrição (`/api/v1/nutrition`)

Dietas e metas:
- `POST /diets`, `GET /diets`, `GET /diets/:id`, `PATCH /diets/:id`, `DELETE /diets/:id`
- `GET /diets/:id/export` e `POST /diets/:id/import`: exportação e importação de dietas compartilhadas.
- `POST /diet-logs`, `GET /diet-logs`, `GET /diet-logs/:id`, `PATCH /diet-logs/:id`, `DELETE /diet-logs/:id`: logs diários e ingestão de água.

Refeições e alimentos na refeição:
- `POST /diets/:dietId/meals`, `GET /diets/:dietId/meals`, `GET /meals/:id`, `PATCH /meals/:id`, `DELETE /meals/:id`
- `POST /diet-logs/:dietLogId/meals`, `GET /diet-logs/:dietLogId/meals`, `GET /meal-logs/:id`, `PATCH /meal-logs/:id`, `DELETE /meal-logs/:id`
- `POST /meals/:mealId/foods`, `GET /meals/:mealId/foods`, `GET /food-in-meals/:id`, `PATCH /food-in-meals/:id`, `DELETE /food-in-meals/:id`
- `POST /meal-logs/:mealLogId/foods`, `GET /meal-logs/:mealLogId/foods`, `GET /food-logs/:id`, `PATCH /food-logs/:id`, `DELETE /food-logs/:id`

Catálogo de alimentos (todas exigem autenticação):
- `POST /food-catalog`, `GET /food-catalog`, `GET /food-catalog/:id`, `PATCH /food-catalog/:id`, `DELETE /food-catalog/:id`

### Notificações (`/api/v1/notifications`)

- `POST /`: cria notificação.
- `GET /`: lista notificações do usuário.
- `GET /unread-count`: retorna quantidade de não lidas.
- `PATCH /mark-all-read`: marca todas como lidas.
- `PATCH /:id/read`: marca uma notificação como lida.
- `GET /:id`, `DELETE /:id`, `DELETE /`: consulta e remoção.

### Compartilhamento (`/api/v1/share`)

- `GET /lookup/:code`: resolve um código de compartilhamento para treino ou dieta.
