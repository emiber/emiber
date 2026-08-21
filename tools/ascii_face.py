"""Generate the ASCII portrait rows for the profile card from a photo.

Usage (from the repo root):
    python tools/ascii_face.py [width] [gamma] [floor] [bottom_frac]

Reads profile_nobg.png at the repo root (profile.jpg with the background
removed and the subject placed on white) and writes tools/ascii_rows.txt,
which build_svgs.py consumes. Prints a preview to stdout so you can tune.

Pipeline: crop to the subject, keep head..neck vertically, crop horizontally to
the dark (face/hair) region so the face fills the frame, equalize (lifts the
backlit face out of shadow), downsample, then map brightness to an ASCII ramp.

To rebuild profile_nobg.png from a new profile.jpg, run a background remover
(this repo used `rembg` with the u2net_human_seg model) and composite the
cut-out onto a white canvas, then re-run this script.
"""
import sys, os
from PIL import Image, ImageOps, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)

SRC = os.path.join(REPO, "profile_nobg.png")   # subject on a white background
WIDTH = int(sys.argv[1]) if len(sys.argv) > 1 else 66
GAMMA = float(sys.argv[2]) if len(sys.argv) > 2 else 2.2    # >1 lifts the backlit face out of shadow
FLOOR = float(sys.argv[3]) if len(sys.argv) > 3 else 0.18   # darkness below this -> blank
BOTTOM_FRAC = float(sys.argv[4]) if len(sys.argv) > 4 else 0.50  # keep head..neck (skip the shirt logo)
WHITE_THR = 244    # >= this is treated as background (white)
DARK_THR = 175     # < this is treated as face/hair (used to crop horizontally to the head)
CHAR_ASPECT = 2.15  # cell height / width for Consolas @ the card's line-height

RAMP = " .:-=+*#%@"  # index 0 -> white/empty, last -> darkest (no XML-special chars)

im = Image.open(SRC).convert("L")

# 1) crop to the subject, keeping only head..neck vertically
mask = im.point(lambda p: 255 if p < WHITE_THR else 0)
x0, y0, x1, y1 = mask.getbbox()
im = im.crop((x0, y0, x1, y0 + int((y1 - y0) * BOTTOM_FRAC)))

# 2) crop horizontally to the dark face/hair region so the face fills the frame
dark = im.point(lambda p: 255 if p < DARK_THR else 0)
db = dark.getbbox()
if db:
    dx0, _, dx1, _ = db
    pad = int((dx1 - dx0) * 0.12)
    im = im.crop((max(0, dx0 - pad), 0, min(im.width, dx1 + pad), im.height))

# 3) equalize the compressed backlit tones so facial structure survives downsampling
im = ImageOps.equalize(ImageOps.autocontrast(im, cutoff=1))

cw, ch = im.size
rows = max(1, round(WIDTH * (ch / cw) / CHAR_ASPECT))
im = im.filter(ImageFilter.GaussianBlur(radius=max(0.8, (cw / WIDTH) * 0.5)))
small = ImageOps.autocontrast(im.resize((WIDTH, rows), Image.BOX), cutoff=2)

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

# dedent so the portrait hugs the card's left edge; drop blank leading/trailing rows
indent = min((len(ln) - len(ln.lstrip()) for ln in lines if ln.strip()), default=0)
lines = [ln[indent:] if ln.strip() else "" for ln in lines]
while lines and not lines[0].strip():
    lines.pop(0)
while lines and not lines[-1].strip():
    lines.pop()

print(f"# crop={cw}x{ch} width={WIDTH} rows={len(lines)} gamma={GAMMA} floor={FLOOR} bottom_frac={BOTTOM_FRAC}")
for ln in lines:
    print("|" + ln)

with open(os.path.join(HERE, "ascii_rows.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
