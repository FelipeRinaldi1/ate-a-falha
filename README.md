# Até a Falha

Um sistema para o gerenciamento de dietas e treinos.

---

## Arquitetura do Projeto

O projeto é estruturado utilizando **Turborepo**, garantindo uma separação clara de responsabilidades e facilitando a manutenção. Abaixo está a visão geral da estrutura de pastas:

```text
.
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   ├── middlewares/
│   │   │   └── server.ts
│   └── web/
│
├── packages/
│   ├── database/
│   │   └── src/
│   └── shared/
│       └── src/
|
├── turbo.json
└── package.json
```

---

## 🛠️ Tecnologias Principais

- **Runtime:** [Node.js](https://nodejs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Monorepo:** [Turborepo](https://turbo.build/)
- **Backend:** [Express](https://expressjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Validação:** [Zod](https://zod.dev/)

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

Crie um arquivo `.env` na raiz baseado no `.env.example` com suas credenciais necessárias.

### 4. Desenvolvimento

Para rodar todas as aplicações simultaneamente em modo dev:

```bash
npm run build
npm run dev
```

---
