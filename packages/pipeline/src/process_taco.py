import pandas
from pathlib import Path
import json

current_dir = Path(__file__).parent
project_root = current_dir

while project_root.parent != project_root:
    if (project_root / "data").exists():
        break
    project_root = project_root.parent

entry_path = project_root / "data" / "silver" / "exercises.silver.json"
exit_path = project_root / "data" / "gold" / "exercises.gold.json"

exercises_data = pandas.read_json(entry_path.resolve())

map_values = {
    'id': 'id',
    'name': 'name',
    'instructions': 'instructions',
    'primaryMuscles': 'primaryMuscles',
    'equipment': 'equipment',
    'level': 'level',
    'images': 'images'
}

def fix_image_extension(image_list):
    if isinstance(image_list, list):
        return [img.replace('.jpg', '.webp').replace('.jpeg', '.webp') for img in image_list]
    return image_list

exercises_data['images'] = exercises_data['images'].apply(fix_image_extension)

final_dataframe = exercises_data[list(map_values.keys())]
final_dataframe.columns = list(map_values.values())

seeds = final_dataframe.to_dict(orient='records')

with open(exit_path.resolve(), 'w', encoding='utf-8') as file:
    json.dump(seeds, file, indent=4, ensure_ascii=False)

print(f"🔥 Gold de exercícios gerada com sucesso em: {exit_path}")