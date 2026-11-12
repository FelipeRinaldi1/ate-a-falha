# Até a Falha

Plataforma web para acompanhamento completo de **treinos de musculação**, **nutrição** e **evolução corporal**. O objetivo do produto é centralizar em um único lugar o planejamento de fichas de treino, o registro de sessões em tempo real, o controle diário de refeições e metas nutricionais, além do acompanhamento histórico de medidas corporais.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Mantine](https://img.shields.io/badge/Mantine-339AF0?style=for-the-badge&logo=mantine&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

---

## Principais Funcionalidades

### Treinos (`/workout`)

- **Dashboard de Treino**: visão geral das rotinas e acesso rápido aos treinos ativos.
- **Planos de Treino (`/workout/plans`)**: criação e edição de fichas e divisões de treino (`/workout/plans/:id/edit`).
- **Execução de Treino Ativo (`/workout/active/:id`)**: seleção de treino (`/workout/active/:id/select`) e registro em tempo real de séries, cargas e repetições.
- **Catálogo de Exercícios (`/workout/exercises`)**: busca e visualização de detalhes de exercícios (`/workout/exercises/:id`).
- **Compartilhamento**: geração de visualização compartilhável de treinos.

### Nutrição

- **Diário Alimentar**: registro de refeições diárias e visualização detalhada de cada refeição.
- **Metas Nutricionais**: configuração e acompanhamento de objetivos calóricos e de macronutrientes.
- **Catálogo e Criação de Alimentos**: busca de alimentos, visualização de detalhes nutricionais e cadastro de alimentos personalizados.
- **Compartilhamento**: geração de visualização compartilhável da dieta.

### Perfil e Métricas Corporais (`/profile`)

- **Cadastro e Edição de Métricas**: registro inicial, atualização (`/profile/edit-metrics`) e adição de novas medições (`/profile/new-metric`).
- **Evolução Corporal**: acompanhamento histórico da evolução das medidas ao longo do tempo.
- **Autenticação**: fluxo completo de cadastro, login e rotas protegidas.

---

## Arquitetura do Monorepo

```text
ate-a-falha/
├── apps/
│   ├── api/                 # API REST em Node.js + TypeScript
│   └── web/                 # Frontend em React + TypeScript + Mantine UI
├── packages/
│   ├── database/            # Schema, migrations e seeds (PostgreSQL)
│   └── shared/              # Tipos e utilitários compartilhados
├── pipeline/                # Pipeline de dados (Docker profile: tools)
├── e2e/                     # Testes ponta a ponta com Playwright
└── docker-compose.yml       # Banco PostgreSQL 18 e serviço de pipeline
```

---

## Pré-requisitos

- **Node.js** (compatível com workspaces npm e TypeScript)
- **Docker** e **Docker Compose** (para o banco PostgreSQL 18)

---

## Configuração Local

1. **Instale as dependências na raiz do monorepo:**

```bash
npm install
```

2. **Configure as variáveis de ambiente da API:**

Crie o arquivo `apps/api/.env` com as variáveis exigidas pela API (`apps/api/src/config/env.ts`) e pelo container do PostgreSQL (`docker-compose.yml`), incluindo:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
LOG_LEVEL=info

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ate_a_falha_db
```

3. **Suba o banco de dados, execute as migrations e popule os dados iniciais:**

```bash
npm run db:up
npm run db:migrate
npm run db:seed
```

O seed cria um usuário de teste para acesso imediato:
- **E-mail:** `demo@ateafalha.com.br`
- **Senha:** `Senha123!`

4. **Inicie a API e o Frontend em modo de desenvolvimento:**

```bash
# Terminal 1 - API
npm run dev:api

# Terminal 2 - Web
npm run dev:web
```

---

## Scripts Disponíveis

| Comando              | Descrição                                         |
| -------------------- | ------------------------------------------------- |
| `npm run dev:api`    | Inicia a API em modo de desenvolvimento           |
| `npm run dev:web`    | Inicia o frontend web em modo de desenvolvimento  |
| `npm run db:up`      | Sobe o container PostgreSQL 18 via Docker Compose |
| `npm run db:migrate` | Executa as migrations do banco de dados           |
| `npm run db:seed`    | Popula o banco com dados iniciais                 |
| `npm run build`      | Compila os workspaces do projeto                  |
| `npm run lint`       | Executa a verificação de lint                     |
| `npm test`           | Executa a suíte de testes                         |
| `npm run test:unit`  | Executa os testes unitários                       |
| `npm run test:e2e`   | Executa os testes E2E com Playwright              |
