# Guia do Frontend

## Stack

| Tecnologia           | Versão | Função                           |
| -------------------- | ------ | -------------------------------- |
| React                | 19     | Biblioteca de UI                 |
| Vite                 | 8      | Bundler e dev server             |
| Mantine              | 9      | Componentes de UI                |
| Lucide Icons		   | 1		| Icones de UI 					   |
| TanStack React Query | 5      | Gerenciamento de estado servidor |
| Axios                | 1.x    | Cliente HTTP                     |
| React Router         | 7      | Roteamento SPA                   |
| Zod                  | 4      | Validação                        |

## Instância do Axios

A instância centralizada está em `apps/web/src/api/instance.ts`:

```typescript
import axios from 'axios'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
	headers: { 'Content-Type': 'application/json' },
})
```

**Regras:**

- Sempre usar `api.get()`, `api.post()`, etc. Nunca usar `fetch()` diretamente.
- A base URL vem da variável de ambiente `VITE_API_URL`.
- Quando autenticação for implementada, adicionar um interceptor para anexar o token JWT automaticamente.

## Padrão de Componente com Dados

### Leitura 

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from './api/instance.js'
import { type FoodDTO } from '@ate-a-falha/shared'

const { data: foods, isLoading } = useQuery({
	queryKey: ['foods'],
	queryFn: async () => {
		const { data } = await api.get<FoodDTO[]>('/foods')
		return data
	},
})
```

### Criação (useMutation)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type CreateFoodDTO } from '@ate-a-falha/shared'

const queryClient = useQueryClient()

const mutation = useMutation({
	mutationFn: (newFood: CreateFoodDTO) => api.post('/foods', newFood),
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['foods'] })
	},
})
```

**Regras:**

- Sempre tipar o `api.get<T>()` com os tipos do `@ate-a-falha/shared`.
- Após uma mutação bem-sucedida, sempre invalidar a query relacionada para atualizar a lista.

## Formulários com Validação Zod

O Mantine suporta Zod nativamente:

```typescript
import { useForm, schemaResolver } from '@mantine/form'
import { createFoodSchema, type CreateFoodDTO } from '@ate-a-falha/shared'

const form = useForm<CreateFoodDTO>({
	initialValues: { name: '', calories: 0, carbohydrate: 0, protein: 0, lipids: 0, fiber: 0 },
	validate: schemaResolver(createFoodSchema, { sync: true }),
})
```

**Regras:**

- Usar `schemaResolver`.
- Sempre passar `{ sync: true }` para schemas Zod.
- Os schemas devem vir do `@ate-a-falha/shared`.

