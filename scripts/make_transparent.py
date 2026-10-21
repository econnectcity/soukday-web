import os
from PIL import Image
from collections import deque

def remove_background(img_path, out_path, tolerance=48):
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size
    
    pixels = img.load()
    visited = set()
    queue = deque()
    
    # Check all border pixels
    for x in range(w):
        for y in [0, h - 1]:
            r, g, b, _ = pixels[x, y]
            # If light / white-ish
            if r > 215 and g > 215 and b > 215 and max(r,g,b) - min(r,g,b) < 25:
                queue.append((x, y))
                visited.add((x, y))
                
    for y in range(h):
        for x in [0, w - 1]:
            if (x, y) not in visited:
                r, g, b, _ = pixels[x, y]
                if r > 215 and g > 215 and b > 215 and max(r,g,b) - min(r,g,b) < 25:
                    queue.append((x, y))
                    visited.add((x, y))
                    
    # Flood-fill BFS
    while queue:
        cx, cy = queue.popleft()
        pixels[cx, cy] = (255, 255, 255, 0)
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                r, g, b, a = pixels[nx, ny]
                if r > 215 and g > 215 and b > 215 and max(r,g,b) - min(r,g,b) < 25:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    # Also check for enclosed background pockets: any pixel in upper 60% with very high brightness and 0 saturation
    for y in range(int(h * 0.7)):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a > 0 and r > 238 and g > 238 and b > 238 and max(r,g,b) - min(r,g,b) < 8:
                # If it's pure background white
                pixels[x, y] = (255, 255, 255, 0)

    # Soft alpha feathering near edges to make transition silky smooth
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a > 0 and r > 230 and g > 230 and b > 230 and max(r,g,b) - min(r,g,b) < 18:
                # If touching a transparent pixel, set to transparent
                has_trans = False
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and pixels[nx, ny][3] == 0:
                        has_trans = True
                        break
                if has_trans:
                    pixels[x, y] = (255, 255, 255, 0)
                    
    img.save(out_path, 'PNG')
    print(f"Refined: {os.path.basename(img_path)} -> {os.path.basename(out_path)}")

cat_dir = 'd:/soukday git/soukday-web/public/images/categories'
files = [
    'all-aisles', 'bakery', 'grocery', 'halal-meats',
    'nuts-dates', 'prepared-dishes', 'produce', 'seafood', 'spices'
]

for name in files:
    src = os.path.join(cat_dir, f"{name}.jpg")
    dst = os.path.join(cat_dir, f"{name}.png")
    if os.path.exists(src):
        remove_background(src, dst)
