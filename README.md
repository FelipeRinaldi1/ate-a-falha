# Até a Falha

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Sistema web *mobile-first* de gerenciamento integrado de dietas, treinos de musculação e evolução antropométrica. Projetado com foco na experiência do praticante na academia e no compartilhamento ágil de rotinas.

---

## Principais Funcionalidades

- **Gestão e Execução de Treinos (`Workout`):** Divisões de `A` a `F`, execução interativa com ajuste dinâmico de cargas/repetições, cronômetro de descanso por série, persistência em `localStorage` e marcação automática no calendário semanal.
- **Diário Alimentar e Hidratação (`Nutrition`):** Base fundamentada na Tabela TACO (NEPA/UNICAMP), cálculo energético automático pelos fatores de Atwater, normalização para $100\text{g}$ em alimentos personalizados e controle de ingestão hídrica diária.
- **Avaliação Antropométrica (`BodyMetric`):** Histórico de peso, percentual de gordura e massa muscular com cálculo automatizado de IMC, TMB (Mifflin-St Jeor) e TDEE.
- **Compartilhamento e Importação (`Share`):** Exportação pública (`isExported`) e importação por clonagem profunda (*deep copy*) via **Link Público**, **Código Curto (`T-XXXXXX` / `D-XXXXXX`)** ou **Leitor de QR Code integrado à câmera (`jsQR`)**.
- **Central de Notificações Reativa (`Notification`):** Alertas automáticos disparados ao concluir treinos, registrar novas medidas corporais, atingir 100% da meta diária de água e importar fichas de treino ou planos alimentares.

---

## Arquitetura de Pastas

O projeto utiliza uma estrutura de **Monorepo** (NPM Workspaces) para compartilhamento de contratos, validações e regras de negócio entre cliente e servidor.

```text
.
├── apps/
│   ├── api/          # Backend REST (Express 5 + Prisma + Pino)
│   └── web/          # Frontend SPA Mobile-First (React 19 + Mantine v9)
├── packages/
│   ├── database/     # Schema Prisma, Migrations, Seeds e Client PostgreSQL
│   └── shared/       # Schemas Zod, DTOs e Lógica de Domínio (Nutrition, BodyMetric, Share)
├── pipeline/         # Pipeline ETL em Python (Arquitetura Medalhão)
├── data/
│   ├── bronze/       # Dados brutos (TACO e Free Exercise DB)
│   ├── silver/       # Dados higienizados e traduzidos
│   └── gold/         # Dados otimizados (.json e imagens .webp / thumbnails)
├── tcc-docs/         # Documentação de apoio e revisão da monografia
└── docker-compose.yml
```

---

## Como Executar

O projeto é conteinerizado via Docker para garantir consistência no ambiente de execução.

### 1. Pré-requisitos

- [Docker](https://www.docker.com/) e Node.js (v20+) instalados.

### 2. Configuração

Crie os arquivos `.env` em `apps/api/.env` e `apps/web/.env` baseados nos respectivos arquivos `.env.example`.

### 3. Inicialização

1. **Subir o banco de dados (Docker):**

    ```bash
    npm run db:up
    ```

2. **Rodar migrations e seeds (na primeira execução):**

    ```bash
    npm run db:migrate
    npm run db:seed
    ```

3. **Iniciar os serviços (em terminais separados):**
    - **Terminal 1 (API):** `npm run dev:api`
    - **Terminal 2 (Web):** `npm run dev:web`

---

### Usuário de Demonstração / Testes

Ao executar os seeds do banco (`npm run db:seed` ou `npm run db:seed:user`), um usuário de demonstração completo é criado automaticamente:

| Campo        | Valor                                                                          |
| :----------- | :----------------------------------------------------------------------------- |
| **E-mail**   | `demo@ateafalha.com.br`                                                        |
| **Senha**    | `Senha123!`                                                                    |
| **Perfil**   | Felipe Rinaldi                                                                 |
| **Métricas** | 5 avaliações corporais históricas                                              |
| **Dieta**    | Dieta Limpa (com registro diário e hidratação)                                 |
| **Treinos**  | Plano ABC Ativo (Empurrar, Puxar e Pernas Completo)                            |
| **Avisos**   | Central de notificações com 6 alertas de treino, dieta, hidratação e evolução  |

---

### 4. Comandos Disponíveis

| Categoria             | Função                             | Comando                                   |
| :-------------------- | :--------------------------------- | :---------------------------------------- |
| **Desenvolvimento**   | Iniciar API (+ auto DB)            | `npm run dev:api`                         |
|                       | Iniciar Frontend Web               | `npm run dev:web`                         |
| **Banco de Dados**    | Subir Banco (Docker)               | `npm run db:up`                           |
|                       | Parar Banco                        | `npm run db:down`                         |
|                       | Rodar Migrations                   | `npm run db:migrate`                      |
|                       | Popular Banco (Completo)           | `npm run db:seed`                         |
|                       | Popular Usuário Demo               | `npm run db:seed:user`                    |
|                       | Visualizar Banco (Studio)          | `npm run db:studio`                       |
| **Qualidade & Build** | Compilar Todos os Pacotes          | `npm run build`                           |
|                       | Rodar Todos os Testes (259 testes) | `npm run test`                            |
|                       | Rodar Testes Unitários (Shared)    | `npm run test:unit`                       |
|                       | Verificar Linting (ESLint)         | `npm run lint`                            |

---

## Tecnologias Principais

- **Backend:** Node.js, Express 5, Pino Logger, Express Rate Limit, Helmet & JWT (HttpOnly Cookies)
- **Frontend:** React 19, Mantine UI v9, Recharts, Lucide Icons, `qrcode.react` & `jsqr`
- **Banco de Dados & ORM:** PostgreSQL 15 (`pg_trgm` com fallback resiliente) & Prisma ORM v7
- **Validação & Contratos:** TypeScript & Zod v4
- **Gerenciamento de Estado:** TanStack React Query v5
- **Testes Automatizados:** Vitest & Supertest (259 testes: 45 unitários + 214 de integração)

---

## Créditos de Dados

Este projeto utiliza bases de dados abertas para as bibliotecas de nutrição e exercícios:

- **Alimentos:** [Tabela TACO](https://nepa.unicamp.br/tabela-brasileira-de-composicao-de-alimentos-4a-edicao/) (NEPA/UNICAMP)
- **Exercícios:** Base baseada no [Free Exercise Db](https://github.com/yuhonas/free-exercise-db) com traduções de [Exercícios DB PTBR](https://github.com/joao-gugel/exercicios-bd-ptbr).

---

2026 Até a Falha - Desenvolvido para fins acadêmicos e profissionais.
