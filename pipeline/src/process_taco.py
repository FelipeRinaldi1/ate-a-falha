import os
import pandas
from pathlib import Path
import json

entry_path = Path(os.getenv("DATA_SILVER_PATH", "data/silver")) / "taco.silver.csv"
exit_path = Path(os.getenv("DATA_GOLD_PATH", "data/gold")) / "taco.gold.json"
db_exit_path = Path(__file__).parent.parent.parent / "packages/database/src/data/taco.gold.json"

def process_taco():

    taco_data = pandas.read_csv(entry_path.resolve())

    map_values = {
        'nome': 'name',
        'kcal': 'calories',
        'proteina': 'protein',
        'carboidrato': 'carbohydrate',
        'lipídeos': 'lipids',
        'fibra': 'fiber',
    }

    for taco_column, database_column in map_values.items():
        if(database_column != 'name'):
            clean_value = taco_data[taco_column].astype(str).str.replace(',','.')
            numeric_values = pandas.to_numeric(clean_value,errors='coerce')
            taco_data[database_column] = numeric_values.fillna(0)
        else: 
            taco_data[database_column] = taco_data[taco_column]

    final_dataframe = taco_data[list(map_values.values())]

    seeds = final_dataframe.to_dict(orient='records')

    with open(exit_path.resolve(), 'w', encoding='utf-8') as file:
        json.dump(seeds, file, indent=4,ensure_ascii=False)

    db_exit_path.parent.mkdir(parents=True, exist_ok=True)
    with open(db_exit_path.resolve(), 'w', encoding='utf-8') as file:
        json.dump(seeds, file, indent=4, ensure_ascii=False)

    print(f"Proccessed {len(seeds)} records and saved to {exit_path.resolve()} and {db_exit_path.resolve()}")
