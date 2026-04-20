# Até a Falha

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Sistema de gerenciamento de dietas e treinos. Projetado com foco na experiência do usuário final e no fluxo de trabalho de profissionais de educação física e nutrição.

---

## 🏛️ Arquitetura de Pastas

O projeto utiliza uma estrutura de **Monorepo** para compartilhamento de dados via packages.

```text
.
├── apps/
│   ├── api/          # Backend Express & Prisma
│   └── web/          # Frontend React & Mantine
├── packages/
│   ├── database/     # Schema Prisma, Migrations e Client
│   ├── shared/       # Schemas Zod e Tipos compartilhados
│   ├── assets/       # Arquivos estáticos
│   └── pipeline/     # Scripts de ingestão de dados
├── data/
│   ├── bronze/       # Dados brutos
│   ├── silver/       # Dados processados
│   └── gold/         # Dados para uso
├── docs/
|   ├──ai/            # Arquivos para Desenvolvimento com IA Integrada
|   ├──arquitetura.md # Documentação da arquitetura
|   ├──desenvolvimento.md # Documentação para quem contribuir com o projeto
|   ├──requisitos.md # Documentação dos requisitos do projeto
|   └──outros-arquivos...
|
|
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

Para o primeiro acesso, utilize o comando de setup que prepara os containers, aplica as migrations e popula o banco de dados:

```bash
npm run setup
```

### 4. Comandos de Desenvolvimento

Após o setup, utilize os comandos abaixo conforme a necessidade:

| Função                | Comando                 |
| --------------------- | ----------------------- |
| Setup inicial         | `npm run setup`         |
| Iniciar tudo          | `npm run dev`           |
| Build e Iniciar tudo  | `npm run dev:all`       |
| Banco (Prisma Studio) | `npm run db:studio`     |
| Executar Pipeline     | `npm run data:pipeline` |
| Formatar código       | `npm run format`        |

---

## Tecnologias Principais

- **Backend:** Express 5
- **Frontend:** React 19 & Mantine v9
- **ORM:** Prisma
- **Validação:** Zod
- **Gerenciamento de Estado:** TanStack React Query v5
- **Monorepo:** npm Workspaces

---

## Créditos de Dados

Este projeto utiliza bases de dados abertas para as bibliotecas de nutrição e exercícios:

- **Alimentos:** [Tabela TACO](https://nepa.unicamp.br/tabela-brasileira-de-composicao-de-alimentos-4a-edicao/) (NEPA/UNICAMP)
- **Exercícios:** Base baseada no [Free Exercise Db](https://github.com/yuhonas/free-exercise-db) com traduções de [Exercícios DB PTBR](https://github.com/joao-gugel/exercicios-bd-ptbr).

---

2026 Até a Falha - Desenvolvido para fins acadêmicos e profissionais.
