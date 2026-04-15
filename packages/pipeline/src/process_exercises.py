import os
from PIL import Image
from pathlib import Path

current_dir = Path(__file__).parent
project_root = current_dir

while project_root.parent != project_root:
    if (project_root / "data").exists():
        break
    project_root = project_root.parent

entry_path = project_root / "data" / "silver" / "exercises.silver.json"
exit_path = project_root / "data" / "gold" / "exercises.gold.json"