# Pipeline e dados

As pastas `pipeline/` e `data/` cuidam do tratamento dos dados iniciais de alimentos (tabela TACO) e exercícios antes de eles irem para o banco via seed.

## Camadas em `data/`

Os arquivos são organizados em três níveis de refinamento:

- `data/bronze/`: arquivos brutos originais, sem tratamento. Hoje contém `taco.bronze.xlsx`.
- `data/silver/`: dados intermediários já limpos ou convertidos (`taco.silver.csv`, `exercises.silver.json` e a pasta `exercise-images/`).
- `data/gold/`: saída final estruturada em JSON (`taco.gold.json` e `exercises.gold.json`), pronta para ser lida pelos seeds em `packages/database`.

## Como o `pipeline/` funciona

O pipeline é escrito em Python 3.12 (`pipeline/Dockerfile` e `pipeline/requirements.txt`). O ponto de entrada fica em `pipeline/src/main.py` e executa três etapas em sequência:

1. `convert_to_webp()` (`pipeline/src/process_exercises_images.py`): converte as imagens de exercícios para o formato WebP.
2. `process_exercises()` (`pipeline/src/process_exercises.py`): normaliza e gera os dados finais de exercícios na camada gold.
3. `process_taco()` (`pipeline/src/process_taco.py`): processa a tabela TACO de alimentos até gerar o `taco.gold.json`.

## Execução com Docker

No `docker-compose.yml`, o serviço `pipeline` fica isolado sob o profile `tools`, com volumes montados para `./data` e `./packages/database`, dependendo do banco `db` estar saudável.

Para rodar o pipeline manualmente via Docker Compose:

```bash
docker compose --profile tools run --rm pipeline
```
