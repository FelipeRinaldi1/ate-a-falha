# Design da API REST

## Estratégia de Rotas

O projeto segue o padrão **"Aninhado para Coleções, Flat para Identidades"**:

- **Criar e listar** recursos filhos → rota aninhada sob o pai (garante contexto).
- **Ler, atualizar e deletar** um recurso individual → rota flat pelo ID (simplifica o frontend).

### Exemplo: Módulo de Nutrição

| Ação                      | Método   | Rota                   |
| ------------------------- | -------- | ---------------------- |
| Criar refeição na dieta   | `POST`   | `/diets/:dietId/meals` |
| Listar refeições da dieta | `GET`    | `/diets/:dietId/meals` |
| Ver uma refeição          | `GET`    | `/meals/:id`           |
| Atualizar refeição        | `PUT`    | `/meals/:id`           |
| Deletar refeição          | `DELETE` | `/meals/:id`           |

### Exemplo: Módulo de Treino

| Ação                          | Método | Rota                                         |
| ----------------------------- | ------ | -------------------------------------------- |
| Criar treino no plano         | `POST` | `/plans/:planId/workouts`                    |
| Listar treinos do plano       | `GET`  | `/plans/:planId/workouts`                    |
| Ver um treino                 | `GET`  | `/workouts/:id`                              |
| Adicionar exercício ao treino | `POST` | `/workouts/:workoutId/exercises`             |
| Adicionar série ao exercício  | `POST` | `/workout-exercises/:workoutExerciseId/sets` |
| Ver uma série                 | `GET`  | `/sets/:id`                                  |

### Recursos de Biblioteca (Públicos)

Alimentos e Exercícios são bibliotecas globais. As rotas de **consulta** (`GET`) são públicas, enquanto as de alteração de dados exigem autenticação:

| Rota                 | Público? | Observação                                       |
| -------------------- | -------- | ------------------------------------------------ |
| `GET /foods`         | ✅ Sim   | Retorna alimentos globais (+ privados se logado) |
| `GET /foods/:id`     | ✅ Sim   | Detalhes de um alimento                          |
| `POST /foods`        | 🔒 Auth  | Criar alimento (requer login)                    |
| `GET /exercises`     | ✅ Sim   | Biblioteca completa de exercícios                |
| `GET /exercises/:id` | ✅ Sim   | Detalhes de um exercício                         |
| `POST /exercises`    | 🔒 Admin | Criar exercício (requer admin)                   |

## Montagem no `app.ts`

Routers com prefixo fixo são montados diretamente (`app.use('/diets', dietRouter)`).
Routers com rotas aninhadas complexas são montados na raiz (`app.use('/', mealRouter)`) para que os parâmetros de rota (`:dietId`, `:workoutId`) sejam resolvidos corretamente pelo Express.

## Tratamento de Erros

### AppError

Todos os erros controlados usam a interface `AppError` definida em `@ate-a-falha/shared`:

```typescript
interface AppError {
	type: 'CONFLICT' | 'NOT_FOUND' | 'DATABASE_ERROR' | 'VALIDATION' | 'UNAUTHORIZED' | 'FORBIDDEN'
	message: string
	details?: unknown
}
```

### Mapeamento HTTP

O `globalErrorHandler` converte `AppError.type` em status HTTP:

| Tipo             | Status HTTP |
| ---------------- | ----------- |
| `VALIDATION`     | 400         |
| `UNAUTHORIZED`   | 401         |
| `FORBIDDEN`      | 403         |
| `NOT_FOUND`      | 404         |
| `CONFLICT`       | 409         |
| `DATABASE_ERROR` | 500         |

### Formato da Resposta de Erro

```json
{
	"status": "error",
	"code": "NOT_FOUND",
	"message": "Resource not found",
	"details": null
}
```

## Result Pattern

Toda a camada de Service e Repository utiliza o **Result Pattern** (`Success | Failure`) em vez de lançar exceções:

```typescript
// Uso no Controller
const result = await this.foodService.create(data, req.user)
if (result.isFailure()) return next(result.error) // passa para globalErrorHandler
return res.status(201).json(result.value)
```

Esse padrão garante tratamento explícito de erros em cada camada, sem depender de try/catch implícitos.
