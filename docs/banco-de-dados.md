# Banco de dados

O sistema usa PostgreSQL 18 (configurado no `docker-compose.yml`) com acesso via Prisma e driver `pg` (`@prisma/adapter-pg`). O schema completo fica em `packages/database/prisma/schema.prisma`.

## Conexão e SSL

O cliente do Prisma é instanciado em `packages/database/src/client.ts` com um `Pool` do `pg` (limite de 10 conexões, `idleTimeoutMillis` de 30s e `connectionTimeoutMillis` de 15s).

Em ambiente de produção (`NODE_ENV=production`), a conexão usa SSL por padrão sem exigir validação estrita de certificado (`rejectUnauthorized: false`), para funcionar direto com bancos gerenciados como o do Render. Se você precisar ativar a verificação estrita de certificado, basta definir `DATABASE_SSL_REJECT_UNAUTHORIZED=true`.

## Modelos principais

### Usuário e medidas corporais

- `User`: guarda nome, data de nascimento, gênero (`GENDER`: `MALE`, `FEMALE`, `OTHER`) e papel (`ROLE`: `USER`, `ADMIN`).
- `Auth`: armazena `email` único e `password` (hash com bcrypt), em relação 1:1 com `User`.
- `BodyMetric`: registra cada medição do usuário (`weight`, `height`, `activityLevel`, `bodyFat`, `muscleRate`) junto aos valores calculados de `bmi`, `bmr` e `tdee`. Cada alteração cria ou atualiza o histórico para alimentar os gráficos de evolução.

### Treinos

- `Exercise`: catálogo base de exercícios do sistema.
- `Plan`: plano/ficha de treino pertencente a um usuário.
- `Workout`: treinos ligados a um `Plan`, identificados por letra do dia (`WORKOUT_DAY` de `A` até `F`).
- `WorkoutExercise`: liga um exercício do catálogo (`Exercise`) a um `Workout`.
- `Set`: séries registradas para cada `WorkoutExercise` (carga, repetições e ordem de execução).

### Nutrição

A parte nutricional separa o que foi planejado do que foi consumido no dia:

- Planejamento:
  - `Food`: catálogo de alimentos com calorias, carboidratos, proteínas, lipídios e fibras. Alimentos do sistema têm `userId` nulo; alimentos criados pelo usuário ficam vinculados ao seu `userId`.
  - `Diet`: plano alimentar com metas diárias (`dailyKcalGoal`, `dailyProteinGoal`, `dailyCarbGoal`, `dailyFatGoal`, `dailyFiberGoal`, `dailyWaterGoal`) e flag `isExported` para compartilhamento.
  - `Meal`: refeições de uma dieta, ordenadas por `orderIndex` e horário (`time`).
  - `FoodInMeal`: relaciona um `Food` a uma `Meal` com a quantidade planejada (`quantity`).
- Registro diário:
  - `DietLog`: registro de um dia específico (`date` único por usuário) e consumo de água (`waterIntake`).
  - `MealLog`: refeições efetivamente registradas naquele dia.
  - `FoodLog`: alimentos e quantidades consumidos em cada `MealLog`.

### Notificações

- `Notification`: notificações vinculadas ao `User` (lidas e não lidas).

## Comandos úteis

Todos os comandos abaixo podem ser rodados na raiz do projeto:

- `npm run db:up`: sobe o container PostgreSQL 18 via Docker Compose.
- `npm run db:migrate`: aplica as migrations pendentes no banco.
- `npm run db:seed`: popula o catálogo inicial e cria o usuário de teste (`demo@ateafalha.com.br` / `Senha123!`).
- `npm run db:generate -w @ate-a-falha/database`: gera o Prisma Client em `packages/database/src/generated/prisma`.
