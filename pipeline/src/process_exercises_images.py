import os
from PIL import Image
from pathlib import Path

entry_path = Path(os.getenv("DATA_RAW_IMAGES_PATH", "data/exercise-images"))
exit_path = Path(os.getenv("ASSETS_EXERCISES_PATH", "packages/assets/src/exercise-images"))

def convert_to_webp(quality=80):
    if not entry_path.exists():
        print(f"Entry path {entry_path} does not exist.")
        return
    
    files_to_convert = list(entry_path.rglob("*.jpg"))
    
    if not files_to_convert:
        print(f"No files found in {entry_path} and its subdirectories.")
        return
    
    print(f"Processing {len(files_to_convert)} images...")

    for img_path in files_to_convert:
        relative_path = img_path.relative_to(entry_path)
        target_path = exit_path / relative_path.with_suffix('.webp')

        target_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            with Image.open(img_path) as img:
                rgb_img = img.convert("RGB")
                rgb_img.save(target_path, "WEBP", quality=quality)
                print(f"Converted: {relative_path} -> {target_path.name}")
        except Exception as e:
            print(f"Error converting {img_path}: {e}")

