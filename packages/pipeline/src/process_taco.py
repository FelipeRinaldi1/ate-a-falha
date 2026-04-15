import pandas
from pathlib import Path
import json

current_dir = Path(__file__).parent

project_root = current_dir

while project_root.parent != project_root:
    if(project_root / "data").exists():
        break
    project_root = project_root.parent

entry_path = project_root / "data" / "silver" / "taco.silver.csv"
exit_path = project_root / "data" / "gold" / "taco.gold.json"   

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
