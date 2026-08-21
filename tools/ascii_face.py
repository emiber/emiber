"""Generate the ASCII portrait rows for the profile card from a photo.

Usage (from the repo root):
    python tools/ascii_face.py [width] [gamma] [white_thr] [floor]

Defaults reproduce the portrait currently on the card. Reads
profile_fondo_blanco.png at the repo root and writes tools/ascii_rows.txt,
which build_svgs.py consumes. Prints a preview to stdout so you can tune.
Swap the photo (or pass a wider width / different gamma-floor) and re-run.
"""
import sys, os
from PIL import Image, ImageOps, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)

SRC = os.path.join(REPO, "profile.jpg")   # source photo (works best with a plain/white background)
WIDTH = int(sys.argv[1]) if len(sys.argv) > 1 else 52
GAMMA = float(sys.argv[2]) if len(sys.argv) > 2 else 1.6
WHITE_THR = int(sys.argv[3]) if len(sys.argv) > 3 else 244
FLOOR = float(sys.argv[4]) if len(sys.argv) > 4 else 0.22
CHAR_ASPECT = 2.15  # cell height / width for Consolas 16px @ 20px line-height

RAMP = " .:-=+*#%@"  # index 0 -> white/empty, last -> darkest (no XML-special chars)

im = Image.open(SRC).convert("L")

# autocrop to the non-white bounding box (white background) with a small margin
mask = im.point(lambda p: 255 if p < WHITE_THR else 0)
bbox = mask.getbbox()
if bbox:
    x0, y0, x1, y1 = bbox
    mx = int((x1 - x0) * 0.04); my = int((y1 - y0) * 0.04)
    x0 = max(0, x0 - mx); y0 = max(0, y0 - my)
    x1 = min(im.width, x1 + mx); y1 = min(im.height, y1 + my)
    im = im.crop((x0, y0, x1, y1))

cw, ch = im.size
rows = max(1, round(WIDTH * (ch / cw) / CHAR_ASPECT))
im = im.filter(ImageFilter.GaussianBlur(radius=max(1.0, (cw / WIDTH) * 0.5)))
small = im.resize((WIDTH, rows), Image.BOX)
small = ImageOps.autocontrast(small, cutoff=2)

px = small.load()
lines = []
for y in range(rows):
    row = []
    for x in range(WIDTH):
        g = px[x, y] / 255.0
        darkness = (1.0 - g) ** GAMMA
        if darkness < FLOOR:
            row.append(" ")
        else:
            idx = min(len(RAMP) - 1, int(darkness * len(RAMP)))
            row.append(RAMP[idx])
    lines.append("".join(row).rstrip())

print(f"# crop={cw}x{ch} width={WIDTH} rows={rows} gamma={GAMMA} white_thr={WHITE_THR} floor={FLOOR}")
for ln in lines:
    print("|" + ln)

with open(os.path.join(HERE, "ascii_rows.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
