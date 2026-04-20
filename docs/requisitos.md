# Requisitos de Negócio

- **Objetivo Principal:** O sistema visa auxiliar usuários na manutenção de hábitos saudáveis relacionados à alimentação e exercícios físicos, fornecendo ferramentas para registro, acompanhamento e gestão dessas práticas.
- **Público-Alvo:** Indivíduos que buscam melhorar sua saúde e bem-estar através de acompanhamento nutricional e de atividades físicas, incluindo atletas, praticantes de academia e pessoas em processo de reeducação alimentar.
- **Valor Agregado:** O sistema oferece uma plataforma integrada que centraliza o controle de treinos e dietas, facilitando a adesão do usuário aos seus objetivos e permitindo o acompanhamento por profissionais de saúde.

---

# Regras de Negócio

- **Vínculo Exclusivo:** Um aluno pode estar vinculado a apenas um Personal Trainer e um Nutricionista por vez, mas um profissional pode gerenciar múltiplos alunos.
- **Privacidade de Dados:** Um profissional só terá acesso aos registros de peso e dieta do aluno após o aceite formal do vínculo pelo aluno dentro da plataforma.
- **Cálculo de Macronutrientes:** O cálculo de calorias totais deve seguir obrigatoriamente a soma: (Proteínas x 4) + (Carboidratos x 4) + (Gorduras x 9).
- **Edição de Treinos:** Somente o criador do treino (ou o profissional vinculado) possui permissão para editar ou excluir a rotina de exercícios.
- **Exclusão de Conta:** Ao excluir uma conta, todos os dados pessoais e histórico de progresso devem ser anonimizados ou removidos.

# Requisitos Funcionais

## Perfil Aluno

Como usuário principal do sistema, o foco está na execução e acompanhamento pessoal.

- **Gestão de Treino:** Como aluno, quero criar, editar e excluir meus treinos para que eu possa organizar minha rotina conforme minha disponibilidade.
- **Visualização Diária:** Como aluno, quero visualizar a rotina do dia de forma clara e acessível para saber exatamente o que treinar ao abrir o aplicativo.
- **Biblioteca de Apoio:** Como aluno, quero consultar uma biblioteca de exercícios com imagens para garantir a execução correta dos movimentos.
- **Registro de Execução:** Como aluno, quero registrar os exercícios realizados para manter um histórico do meu desempenho.
- **Diário Alimentar:** Como aluno, quero registrar minha alimentação diária e cadastrar alimentos customizados para controlar minha ingestão calórica.
- **Cálculo de Macros:** Como aluno, quero que o sistema calcule automaticamente macronutrientes e calorias com base na minha dieta para facilitar o cumprimento das metas.
- **Lembretes de Refeição:** Como aluno, quero receber notificações nos horários das refeições para manter a consistência da dieta.
- **Evolução Corporal:** Como aluno, quero registrar peso e medidas corporais para gerar gráficos que demonstrem meu progresso físico ao longo do tempo.
- **Portabilidade:** Como aluno, quero exportar e importar meus treinos e relatórios de dieta para outros usuarios.
- **Gestão de Perfil:** Como aluno, quero cadastrar e editar meus dados pessoais para que o sistema se adapte às minhas necessidades atuais.

## Perfil Profissional (Personal Trainer / Nutricionista)

Como editor externo, o foco está na gestão de terceiros e prescrição técnica.

- **Vínculo de Aluno:** Como profissional, quero vincular-me a alunos cadastrados para ter permissão de gerenciar suas rotinas.
- **Prescrição de Treino:** Como profissional, quero criar e editar a rotina de treinos dos meus alunos para garantir que eles sigam uma metodologia técnica.
- **Planejamento Nutricional:** Como profissional, quero estruturar a dieta e os macronutrientes dos meus alunos para otimizar os resultados metabólicos deles.
- **Acompanhamento de Resultados:** Como profissional, quero visualizar os gráficos de progresso e o diário de exercícios dos meus alunos para ajustar o planejamento conforme o desempenho deles.

---

# Requisitos Não funcionais

## Usabilidade

- **Interface Responsiva:** O sistema deve adaptar sua interface para diferentes tamanhos de tela, garantindo usabilidade em smartphones e tablets.
- **Consistência Visual:** A interface deve seguir padrões de design mobile para facilitar a navegação intuitiva e reduzir a curva de aprendizado do usuário.

## Desempenho

- **Tempo de Resposta:** As interações de interface e transições de tela devem ocorrer de forma fluida, com tempo de resposta do servidor inferior a 3 segundos em condições normais de conectividade.
- **Eficiência de Armazenamento:** O sistema deve ser capaz de processar e recuperar o histórico de consumo diário e evolução física sem degradação de performance perceptível ao usuário.

## Segurança

- **Autenticação:** O acesso ao sistema deve ser protegido por autenticação segura, garantindo que apenas usuários autorizados acessem seus dados.
- **Privacidade:** O sistema deve garantir o isolamento dos dados, assegurando que um aluno não tenha acesso às informações de outros usuários, exceto quando vinculado a um profissional.
- **Proteção de Dados:** Implementação de práticas básicas de segurança, como criptografia de senhas no banco de dados.

## Disponibilidade e Portabilidade

- **Multiplataforma:** O sistema deve ser acessível via navegadores modernos ou instalado como aplicação mobile, mantendo a estabilidade em diferentes sistemas operacionais.
- **Resiliência:** O sistema deve operar de forma estável, prevendo o tratamento de erros para evitar interrupções abruptas durante o uso.

---

# O que não está incluido?

## Prescrição Médica ou Diagnóstico

- O sistema não realiza diagnósticos de saúde, prescrição de medicamentos ou tratamentos para problemas de saúde.
- O aplicativo não substitui a consulta com profissionais de saúde, funcionando apenas como uma ferramenta de suporte e registro.

## Processamento de Pagamentos

- O sistema não gerencia transações financeiras entre alunos e profissionais.
- Não haverá integração com sistemas de pagamento para cobrança de consultorias dentro da plataforma.

## Rede Social Aberta

- O sistema não funcionará como uma rede social pública; não haverá feed de postagens, curtidas ou sistema de comentários abertos entre usuários não vinculados.
- A interação é estritamente privada entre o aluno e seu respectivo profissional vinculado.

## Monitoramento em Tempo Real via Sensores

- O sistema não realizará a leitura em tempo real de sensores de batimentos cardíacos ou integração direta com smartwatches nesta versão inicial.
- O registro de atividades depende da entrada manual de dados pelo usuário.
