# Documentação do sistema

Esta pasta reúne a documentação técnica do Até a Falha. A ideia é explicar como o sistema é organizado, como os dados são modelados e quais rotas a API expõe, sem rodeios.

## Índice

- [Manual do usuário](manual-do-usuario.md): guia passo a passo das telas de treino, nutrição, perfil e compartilhamento.
- [Arquitetura](arquitetura.md): divisão do monorepo, organização interna do front e do back, compartilhamento de regras e fluxo das requisições.
- [Frontend](frontend.md): stack web, providers, cliente Axios, organização por features e roteamento.
- [Packages](packages.md): funcionamento de `@ate-a-falha/shared` e `@ate-a-falha/database`.
- [Banco de dados](banco-de-dados.md): modelos do Prisma, relacionamentos entre treino, nutrição e usuário, configuração de conexão e comandos do dia a dia.
- [API](api.md): autenticação via JWT, tratamento de erros, health check e lista de endpoints por módulo.
- [Pipeline e dados](pipeline.md): camadas bronze/silver/gold em `data/` e scripts Python em `pipeline/`.

## Onde começar

Se você acabou de clonar o repositório e quer subir o projeto localmente, siga o passo a passo da seção de configuração no [README principal](../README.md). Se precisar alterar regras de negócio, schemas ou endpoints, comece lendo [Arquitetura](arquitetura.md) para saber em qual workspace cada peça mora.
