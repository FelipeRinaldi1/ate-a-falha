# Regras para Assistentes de IA

Este arquivo define as regras e convenções que qualquer assistente de IA deve seguir ao programar neste projeto.

## Regras Gerais

1. **Sempre leia a documentação do projeto** em `/docs` antes de sugerir padrões ou bibliotecas.
2. **Nunca edite código sem antes verificar** o estado atual dos arquivos envolvidos.
3. **Preserve comentários e docstrings** existentes que não estejam relacionados à sua alteração.
4. **Nunca crie arquivos sem perguntar** se já existe ou se precisa ser criado.
5. **Idioma do código:** nomes de variáveis, funções, rotas,comentários e arquivos em **inglês**. Documentação deve ser em **Portugues**

## Stack — Não Altere Sem Permissão

| Camada    | Tecnologia              | Observação                                |
| --------- | ----------------------- | ----------------------------------------- |
| Monorepo  | npm workspaces          | SEM Turborepo                             |
| Backend   | Express 5               | NÃO usar Fastify, Nest, Hono              |
| ORM       | Prisma                  | NÃO usar Drizzle, TypeORM                 |
| Frontend  | React + Mantine v9      | NÃO usar TailwindCSS, Chakra, MUI         |
| Validação | Zod v4                  | NÃO usar Yup, Joi, Valibot                |
| HTTP      | Axios                   | NÃO usar fetch() diretamente              |
| State     | TanStack React Query v5 | NÃO usar Redux, Zustand para server state |
| Runtime   | Docker Compose          | NÃO rodar serviços fora do Docker         |

## Padrões Obrigatórios

### Backend (API)

- **Result Pattern:** Sempre retornar `Result<T>` nos Services e Repositories. Nunca lançar exceções para erros de negócio.
- **AppError:** Usar a interface `AppError` do `@ate-a-falha/shared` com o tipo adequado.
- **safeCall:** Encapsular queries Prisma com `safeCall()` do `@ate-a-falha/database`.
- **Validação:** Validar `req.body` e `req.params` no Controller usando `validateData()` do shared.
- **Rotas REST:** Seguir o padrão "Aninhado para Coleções, Flat para Identidades" documentado em `api-design.md`.

### Frontend (Web)

- **schemaResolver:** Usar `schemaResolver` nativo do Mantine, NÃO instalar `mantine-form-zod-resolver` nem `zodResolver`.
- **Sync:** Sempre passar `{ sync: true }` no schemaResolver para schemas Zod síncronos.
- **Tipos do Shared:** Nunca redefinir interfaces/tipos que já existam no `@ate-a-falha/shared`. Importar de lá.
- **Instância Axios:** Usar a instância `api` de `src/api/instance.ts`. Nunca criar instâncias Axios avulsas.
- **React Query:** Sempre tipar `api.get<T[]>()` com os DTOs do shared. Invalidar queries após mutações.

### Shared (packages/shared)

- **Segurança do Bundle:** Este pacote é consumido pelo frontend. NUNCA adicionar dependências exclusivas de Node.js aqui.
- **Exportações:** Tudo que é público deve ser exportado via `src/index.ts`.
- **Schemas Zod:** Cada model deve ter ao menos `createSchema`, `updateSchema` e o tipo inferido via `z.infer`.

## Referência de Documentação

Antes de usar componentes Mantine, consultar o arquivo de referência:

- `docs/ai/mantine-llms-full.txt` — Documentação completa do Mantine formatada para LLMs.

Para detalhes de componentes específicos, buscar a URL correspondente no índice desse arquivo.

## Estrutura de Pastas no Backend

```
apps/api/src/modules/<nome-do-modulo>/
├── controllers/   # Validação de entrada + chamada ao service
├── services/      # Lógica de negócio
├── repositories/  # Acesso ao banco via Prisma
├── routers/       # Definição de rotas Express
└── interfaces/    # Interfaces de repositório para inversão de dependência
```

## O Que Eu (IA) Devo Fazer Antes de Codificar

1. Ler os arquivos em `/docs` relevantes à tarefa.
2. Verificar o estado atual dos arquivos que vou modificar.
3. Verificar se o schema Zod já existe no shared antes de criar tipos locais.
4. Verificar se a rota já está montada no `app.ts`.
5. Para componentes Mantine, consultar `docs/ai/mantine-llms-full.txt`.
