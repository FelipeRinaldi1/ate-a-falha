# Banco de Dados

## Visão Geral

O projeto utiliza **PostgreSQL 18** como banco de dados, gerenciado pelo **Prisma ORM**. O schema está definido em `packages/database/prisma/schema.prisma`.

## Diagrama de Relacionamentos

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1:1
     ├──────────── Auth
     │ 1:N
     ├──────────── BodyMetric
     │ 1:N
     ├──────────── Diet ──── 1:N ──── Meal ──── 1:N ──── FoodInMeal ──── N:1 ──── Food
     │ 1:N
     ├──────────── Food
     │ 1:N
     └──────────── Plan ──── 1:N ──── Workout ──── 1:N ──── WorkoutExercise ──── N:1 ──── Exercise
                                                                │
                                                                └── 1:N ──── Set
```

## Módulos

### Módulo de Usuário

| Model        | Descrição                                          |
| ------------ | -------------------------------------------------- |
| `User`       | Dados do perfil                                    |
| `Auth`       | Credenciais de autenticação                        |
| `BodyMetric` | Medições corporais                                 |

### Módulo de Nutrição

| Model        | Descrição                                                          | Pai                         |
| ------------ | ------------------------------------------------------------------ | --------------------------- |
| `Diet`       | Plano alimentar com metas diárias de macros                        | `User`                      |
| `Meal`       | Refeição dentro de uma dieta                                       | `Diet`                      |
| `FoodInMeal` | Tabela associativa: liga um alimento a uma refeição com quantidade | `Meal` + `Food`             |
| `Food`       | Alimento com informações nutricionais                              | `User?` |

**Observações sobre `Food`:**

- Se `userId` é `null` → alimento global.
- Se `userId` tem valor → alimento customizado do usuário.

### Módulo de Treino

| Model             | Descrição                                        | Pai                    |
| ----------------- | ------------------------------------------------ | ---------------------- |
| `Plan`            | Plano de treino                                  | `User`                 |
| `Workout`         | Treino individual dentro de um plano             | `Plan`                 |
| `WorkoutExercise` | Exercício atribuído a um treino com ordem        | `Workout` + `Exercise` |
| `Set`             | Série de um exercício                            | `WorkoutExercise`      |
| `Exercise`        | Biblioteca global de exercícios                  | —                      |

**Observações sobre `Exercise`:**

- Exercícios são globais (não possuem `userId`).
- Contêm `primaryMuscles`, `secondaryMuscles`, `instructions`, `category` e `images`.
- O campo `externalId` é único e usado para vincular com arquivos de imagem.

## Enums

| Enum          | Valores                      | Uso                    |
| ------------- | ---------------------------- | ---------------------- |
| `ROLE`        | `USER`, `ADMIN`              | Controle de acesso     |
| `GENDER`      | `MALE`, `FEMALE`, `OTHER`    | Perfil do usuário      |
| `WORKOUT_DAY` | `A`, `B`, `C`, `D`, `E`, `F` | Dia do treino no plano |

## Constraints Importantes

- `Food` tem `@@unique([id, userId])` para permitir alimentos globais e privados.
- Todas as relações pai-filho usam `onDelete: Cascade` onde aplicável.
