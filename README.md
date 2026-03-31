# Até a Falha 

Um sistema moderno e robusto para o gerenciamento de dietas e treinos. Focado em organização, performance e escalabilidade, o projeto utiliza uma arquitetura de monorepo para facilitar o compartilhamento de código entre diferentes partes do ecossistema.

---

##  Arquitetura do Projeto

O projeto é estruturado utilizando **Turborepo**, garantindo uma separação clara de responsabilidades e facilitando a manutenção. Abaixo está a visão geral da estrutura de pastas:

```text
.
├── apps/                    # Aplicações principais
│   ├── api/                 # Backend (Node.js/Express)
│   │   ├── src/             # Código fonte da API
│   │   │   ├── modules/     # Domínios (nutrition, user, workout)
│   │   │   ├── middlewares/ # Regras interceptoras
│   │   │   └── server.ts    # Ponto de entrada do servidor
│   └── web/                 # Frontend (Em desenvolvimento)
│
├── packages/                # Bibliotecas e pacotes compartilhados
│   ├── database/            # Camada de persistência e ORM
│   │   └── src/             # Configurações do Prisma e cliente
│   └── shared/              # Regras de negócio e tipos comuns
│       └── src/             # Schemas Zod, tipos e utilitários
│
├── turbo.json               # Configurações de pipeline do Turborepo
└── package.json             # Dependências e scripts do Workspace
```

---


## 🛠️ Tecnologias Principais

-   **Runtime:** [Node.js](https://nodejs.org/)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Monorepo:** [Turborepo](https://turbo.build/)
-   **Backend:** [Express](https://expressjs.com/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Validação:** [Zod](https://zod.dev/)

---

## 🚀 Como Executar

### 1. Pré-requisitos
- Node.js (v18 ou superior)
- npm (v10 ou superior)

### 2. Instalação
```bash
npm install
```

### 3. Configuração
Crie um arquivo `.env` na raiz (baseado no `.env.example`) com suas credenciais de banco de dados.

### 4. Desenvolvimento
Para rodar todas as aplicações simultaneamente em modo dev:
```bash
npm run dev
```

---

