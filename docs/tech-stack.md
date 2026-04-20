# Escolha de Tecnologias

Este documento detalha o conjunto de tecnologias utilizado no projeto **Até a Falha**, apresentando as justificativas técnicas e de negócio para cada escolha, visando atender aos requisitos de performance, escalabilidade e produtividade.

## 1. Linguagem Principal: TypeScript

- **Justificativa:** O uso de TypeScript em todo o monorepo garante segurança de tipos de ponta a ponta. Com do pacote `@ate-a-falha/shared`, o frontend e o backend compartilham as mesmas interfaces e schemas de validação, reduzindo drasticamente erros de integração e aumentando a velocidade de desenvolvimento. Com a possibilidade de produzir uma aplicação exclusiva de mobile com React Native, mantendo grande parte da base do codigo.

## 2. Frontend: React + Vite + Mantine

- **React v19:** Escolhido pela sua maturidade, ecossistema vasto e modelo de componentes que facilita a criação de interfaces complexas e reusáveis.
- **Vite v8:** Ferramenta de build extremamente rápida que utiliza ESM nativo, proporcionando um ciclo de feedback quase instantâneo durante o desenvolvimento.
- **Mantine v9:** Biblioteca de componentes UI robusta. A escolha baseou-se na sua alta produtividade, suporte nativo a temas, acessibilidade e integração direta com Zod via `schemaResolver`, eliminando a necessidade de bibliotecas extras de validação de formulários.

## 3. Backend: Node.js + Express

- **Express v5:** Framework web minimalista e flexível. Foi escolhido pela sua simplicidade e estabilidade, permitindo total controle sobre o fluxo de middlewares e rotas, além de possuir a maior comunidade e suporte a bibliotecas do ecossistema Node.js.

## 4. Persistência de Dados: PostgreSQL + Prisma ORM

- **PostgreSQL v18:** Banco de dados relacional robusto e extensível. Sendo simples por padrão e modificavel no futuro PostgreSQL extensions.
- **Prisma ORM:** Atua como um "Type-Safe Query Builder". O Prisma facilita a manutenção do esquema do banco através de migrations declarativas e gera um cliente TypeScript automático, garantindo que as consultas ao banco estejam sempre sincronizadas com o código-fonte.

## 5. Gerenciamento de Estado e Comunicação

- **TanStack React Query v5:** Utilizado para gerenciar o estado vindo do servidor. Ele automatiza o cache, sincronização, tratamento de erros e estados de carregamento, melhorando significativamente a experiência do usuário e simplificando o código do frontend.
- **Axios:** Cliente HTTP utilizado pela sua simplicidade na configuração de instâncias globais, interceptores de requisição e tratamento consistente de timeouts.

## 6. Arquitetura e Organização

- **Monorepo via npm workspaces:** Estrutura que permite manter o código do frontend, backend e bibliotecas compartilhadas em um único repositório. Proporciona facilidade na gestão de dependências e compartilhamento de código sem a necessidade de publicar pacotes externos.
- **Zod:** Biblioteca de declaração e validação de schemas. Utilizada como a "Fonte Única de Verdade" para todos os dados que trafegam pelo sistema, garantindo que os mesmos critérios de validação sejam aplicados no formulário do cliente e na API.

## 7. Infraestrutura e Docker

- **Docker & Docker Compose:** Utilizados para garantir que o ambiente de desenvolvimento seja idêntico ao de produção. Com containers, isolamos o banco de dados e as dependências do sistema operacional, facilitando o setup do projeto para novos desenvolvedores ou para quem desenvolve em diversos sistemas operacionais e computadores.

## 8. Logging e Segurança

- **Pino:** Logger de alta performance que gera logs estruturados, facilitando o monitoramento e a depuração em ambiente de produção.
- **Helmet:** Middleware para o Express que aumenta a segurança da API.
