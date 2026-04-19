import os
from pathlib import Path
import json

entry_path = Path(os.getenv("DATA_SILVER_PATH", "data/silver")) / "exercises.silver.json"
exit_path = Path(os.getenv("DATA_GOLD_PATH", "data/gold")) / "exercises.gold.json"

with open(entry_path.resolve(), 'r', encoding='utf-8') as file:
    data = json.load(file)

def process_exercises():
    already_seen_names = set()
    exercises_gold = []

    for item in data:
        if item['category'].strip().lower() in ['forca','cardio']:
            name = item['name'].strip()
            if name not in already_seen_names:
                already_seen_names.add(name)
                
                item.pop('force',None)
                item.pop('mechanic',None)
                item.pop('equipment',None)
                item.pop('level',None)

                item['externalId'] = item.pop('id',None)

                exercises_gold.append(item)

    with open(exit_path.resolve(),'w',encoding='utf-8') as file:
        json.dump(exercises_gold,file, indent=4, ensure_ascii=False)

    print(f"Processed {len(exercises_gold)} unique exercises and saved to {exit_path.resolve()}")



