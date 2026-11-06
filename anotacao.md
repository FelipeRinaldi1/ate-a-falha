# 📋 Anotações & Pendências

---

## 🚨 Alta Prioridade / Urgente

- [x] **Marcação no Calendário** (ajustes/implementação)
- [x] **Correção do Deploy**

---

## 🐛 Bugs & Correções

- [x] **Exercícios**: Imagem não carrega no detalhe/card do exercício
- [x] **Alimentos**: Pesquisa de alimentos trazendo resultados incorretos/inconsistentes
- [x] **Pesquisa no Render (Produção)**: Fallback automático resiliente (`ILIKE`/Prisma + criação segura de `pg_trgm` no boot + `trust proxy` + timeout SSL) quando a extensão `pg_trgm` não está habilitada no banco gerenciado

---

## ⚡ Melhorias, Otimizações & Refatoração

- [x] **Performance**: Otimizar imagens pesadas na busca/listagem de exercícios
- [x] **Acesso & Segurança**: Uniformizar controle de acesso entre módulos
- [x] **UI/UX**: Melhoria visual nos componentes de gráficos
- [x] **Compartilhamento & Acessibilidade**: Leitor de QR Code via câmera integrada na aplicação (`jsQR`)
- [x] **Compartilhamento & Acessibilidade**: Importação e exportação alternativa via código alfanumérico curto (`T-XXXXXX` e `D-XXXXXX`, evitando obrigatoriedade de câmera/link)
- [x] **Notificações Reativas**: Gatilhos automáticos reais (conclusão de treino, nova métrica corporal, meta de água atingida e importação de treino/dieta) e limpeza de notificações do seed
- [x] **Qualidade de Código**: `npm run lint` com 0 erros e 0 warnings, `npm run build` limpo e 265 testes automatizados passando (45 unitários + 214 de integração + 6 suítes E2E no Playwright)

---

## 🎓 Monografia / TCC

### ✍️ Escrita e Conteúdo

- [ ] Escrever texto descritivo das seções
- [ ] Redigir a seção de testes (265 testes: 45 unitários + 214 de integração + 6 suítes E2E no Playwright substituindo o teste SUS na Seção 5.4)
- [ ] Inserir figuras e redigir seus respectivos textos de contextualização

### 🖼️ Relação de Figuras

- [ ] **Figura 4.3**: _Fluxo da pipeline de ingestão de dados._
- [x] **Figura 4.4**: _Interface gráfica do fluxo de autenticação._
- [x] **Figura 4.5**: _Gráficos de evolução de métricas e peso corporal._
- [x] **Figura 4.6**: _Interface do módulo de gestão e execução de treinos._
- [x] **Figura 4.7**: _Interface do diário alimentar e cálculo de macronutrientes._
