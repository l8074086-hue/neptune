import json
import os
import sys
from pathlib import Path
from PIL import Image

EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}

def main() -> int:
    gallery = Path(os.path.dirname(os.path.abspath(__file__))) / "gallery"
    images_dir = gallery / "images"
    entries = []
    if images_dir.is_dir():
        for path in sorted(images_dir.iterdir()):
            if path.suffix.lower() in EXTENSIONS and path.is_file():
                with Image.open(path) as img:
                    w, h = img.size
                entries.append({"file": path.name, "w": w, "h": h})
    out = gallery / "images.json"
    out.write_text(json.dumps(entries, indent=2))
    print(f"wrote {out} with {len(entries)} image(s)")
    return 0

if __name__ == "__main__":
    sys.exit(main())