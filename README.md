# Até a Falha

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Sistema de gerenciamento de dietas e treinos. Projetado com foco na experiência do usuário final e no fluxo de trabalho de profissionais de educação física e nutrição.

---

## Arquitetura de Pastas

O projeto utiliza uma estrutura de **Monorepo** para compartilhamento de dados via packages.

```text
.
├── apps/
│   ├── api/          # Backend
│   └── web/          # Frontend
├── packages/
│   ├── database/     # Schema Prisma, Migrations e Client
│   └── shared/       # Schemas Zod e Tipos compartilhados
├── pipeline/         # ETL para ingestão de dados
├── data/
│   ├── bronze/       # Dados brutos
│   ├── silver/       # Dados processados
│   └── gold/         # Dados para uso
├── docs/
└── docker-compose.yml
```

---

## Como Executar

O projeto é totalmente conteinerizado via Docker para garantir que o ambiente de execução seja consistente.

### 1. Pré-requisitos

- [Docker](https://www.docker.com/) instalado.

### 2. Configuração

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

### 3. Inicialização

### 3. Como Executar

1. **Subir o banco de dados (Docker):**
   ```bash
   npm run db:up
   ```

2. **Rodar migrations e seeds (se for a primeira vez):**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Iniciar os serviços (em terminais separados):**
   * **Terminal 1 (API):** `npm run dev:api`
   * **Terminal 2 (Web):** `npm run dev:web`

---

### 4. Comandos Disponíveis

| Categoria           | Função                     | Comando             |
| :------------------ | :------------------------- | :------------------ |
| **Desenvolvimento** | Iniciar API (+ auto DB)    | `npm run dev:api`   |
|                     | Iniciar Frontend Web       | `npm run dev:web`   |
| **Banco de Dados**  | Subir Banco (Docker)       | `npm run db:up`     |
|                     | Parar Banco                | `npm run db:down`   |
|                     | Rodar Migrations           | `npm run db:migrate`|
|                     | Popular Banco (Seed)       | `npm run db:seed`   |
|                     | Visualizar Banco (Studio)  | `npm run db:studio` |
| **Qualidade & Build**| Compilar Tudo             | `npm run build`     |
|                     | Rodar Testes               | `npm run test`      |

---

## Tecnologias Principais

- **Backend:** Express 5
- **Frontend:** React 19 & Mantine v9
- **ORM:** Prisma
- **Validação:** Zod
- **Gerenciamento de Estado:** TanStack React Query v5

---

## Créditos de Dados

Este projeto utiliza bases de dados abertas para as bibliotecas de nutrição e exercícios:

- **Alimentos:** [Tabela TACO](https://nepa.unicamp.br/tabela-brasileira-de-composicao-de-alimentos-4a-edicao/) (NEPA/UNICAMP)
- **Exercícios:** Base baseada no [Free Exercise Db](https://github.com/yuhonas/free-exercise-db) com traduções de [Exercícios DB PTBR](https://github.com/joao-gugel/exercicios-bd-ptbr).

---

2026 Até a Falha - Desenvolvido para fins acadêmicos e profissionais.
