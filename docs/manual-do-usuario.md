# Manual do usuário

Este guia mostra como usar as telas e fluxos principais do Até a Falha no dia a dia.

## 1. Conta e primeiro acesso

- Criar conta (`/register`): informe seus dados básicos, e-mail e senha para se cadastrar.
- Entrar (`/login`): acesse sua conta com e-mail e senha.
- Configuração inicial de medidas (`/setup-metrics`): logo após o primeiro cadastro, o sistema pede suas medidas iniciais (peso, altura e nível de atividade) para calcular IMC, TMB e gasto calórico diário (TDEE).

Se você estiver rodando o projeto localmente com o seed do banco (`npm run db:seed`), já existe uma conta pronta para testar:
- E-mail: `demo@ateafalha.com.br`
- Senha: `Senha123!`

## 2. Treinos

Ao entrar na aplicação, você cai no painel de treinos (`/workout`).

- Dashboard (`/workout`): mostra a visão geral da sua rotina, o plano ativo e os atalhos para iniciar uma sessão.
- Planos de treino (`/workout/plans`): liste seus planos, crie novas fichas ou escolha um plano para editar.
- Editar plano (`/workout/plans/:id/edit`): organize as divisões de treino (A, B, C, D, E ou F), adicione exercícios do catálogo e defina a estrutura da ficha.
- Escolher treino do dia (`/workout/active/:id/select`): selecione qual divisão do plano você vai treinar na sessão.
- Treino ativo (`/workout/active/:id`): registre as séries em tempo real informando carga e repetições conforme avança nos exercícios.
- Catálogo de exercícios (`/workout/exercises`): pesquise exercícios pelo nome ou filtro e clique em qualquer item para abrir os detalhes e imagens (`/workout/exercises/:id`).

## 3. Nutrição

A área de nutrição fica em `/nutrition` e separa o planejamento das metas do que você registrou no dia.

- Diário alimentar (`/nutrition`): acompanhe o consumo do dia, veja quanto falta para bater suas metas e registre a ingestão de água.
- Metas nutricionais (`/nutrition/goals`): defina seus objetivos diários de calorias, proteínas, carboidratos, gorduras, fibras e água, além de configurar as refeições do seu plano.
- Detalhes da refeição (`/nutrition/meals/:id`): adicione, edite ou remova alimentos e quantidades dentro de uma refeição específica.
- Buscar alimentos (`/nutrition/search`): pesquise alimentos no catálogo e abra os detalhes nutricionais (`/nutrition/food-catalog/:id`).
- Criar alimento (`/nutrition/create-food`): cadastre alimentos próprios caso não encontre o que precisa no catálogo padrão.

## 4. Perfil e evolução corporal

- Perfil (`/profile`): visualize seus dados pessoais, medidas atuais, alterações de senha/e-mail e opções da conta.
- Editar medidas (`/profile/edit-metrics`): corrija os dados da medição atual.
- Nova medição (`/profile/new-metric`): registre uma nova pesagem ou atualização de medidas sem apagar o histórico anterior.
- Evolução (`/profile/evolution`): acompanhe a variação das suas medidas corporais ao longo do tempo.

## 5. Compartilhamento

Você pode gerar links e códigos de compartilhamento para mostrar ou importar treinos e dietas:

- Treino compartilhado (`/share/workout/:id`): exibe os detalhes de um plano de treino exportado.
- Dieta compartilhada (`/share/diet/:id`): exibe os detalhes de uma dieta exportada.

Quem recebe o código ou link consegue visualizar a estrutura e importar o plano de treino ou dieta para a própria conta.
