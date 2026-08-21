"""Rebuild dark_mode.svg and light_mode.svg: a portrait on the left + a terminal-style stats card on the right.

Regeneration flow (from the repo root):
    python tools/build_svgs.py            # rebuild SVGs (stats reset to 0 placeholders)
    ACCESS_TOKEN=<pat> python today.py    # fill real GitHub stats + live Uptime

Left visual is controlled by USE_PHOTO:
  * True  -> embeds profile.jpg (base64) as a rounded portrait (what the card uses now).
  * False -> renders an ASCII portrait from tools/ascii_rows.txt (run tools/ascii_face.py first).

Edit the CONTENT section to change card text. The 9 ids (age_data, repo_data,
contrib_data, star_data, commit_data, follower_data, loc_data, loc_add, loc_del)
and their _dots siblings MUST be preserved exactly — today.py substitutes by id.
Canvas width is derived from the widest line at a conservative monospace advance,
so text never clips.
"""
import re, os, io, base64
from xml.sax.saxutils import escape
from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)

USE_PHOTO = False
PHOTO = os.path.join(REPO, "profile.jpg")

ADV = 10.4        # px per stats char, conservative (covers Consolas+size-adjust and wider system mono)
MARGIN = 30
HEIGHT = 550      # last stats row baseline is 530; leave a bottom margin
DOT_MIN = 3       # minimum dots even on the widest info row
EMDASH = "—"

# The ASCII portrait is rendered denser than the stats text so a detailed face fits the height.
ASCII_FONT = 13
ASCII_LINE = 15
ASCII_ADV = 8.2   # px per ASCII char (conservative for Consolas 13px + size-adjust)
ASCII_X = 15
ASCII_Y0 = 24
GAP = 42          # gap between the portrait and the stats column

if USE_PHOTO:
    RX = 540      # right column x start (fixed for the 470px photo)
    ASCII_ROWS = None
else:
    with open(os.path.join(HERE, "ascii_rows.txt"), encoding="utf-8") as f:
        ASCII_ROWS = f.read().split("\n")
    RX = int(ASCII_X + max(len(r) for r in ASCII_ROWS) * ASCII_ADV + GAP)

# ---- left visual: embedded photo (rounded) or ASCII portrait ----
def photo_bits():
    im = ImageOps.exif_transpose(Image.open(PHOTO).convert("RGB"))
    W, H = im.size
    l, t, r, b = 0.06, 0.03, 0.94, 0.91          # gentle crop toward the subject
    im = im.crop((int(l * W), int(t * H), int(r * W), int(b * H)))
    cw, ch = im.size
    s = min(cw, ch)                               # center square
    im = im.crop(((cw - s) // 2, (ch - s) // 2, (cw - s) // 2 + s, (ch - s) // 2 + s))
    im = im.resize((500, 500), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, format="JPEG", quality=82, optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

def left_defs_and_visual(fill):
    if USE_PHOTO:
        b64 = photo_bits()
        defs = ('<defs><clipPath id="pfp">'
                '<rect x="25" y="35" width="470" height="470" rx="16" ry="16"/>'
                '</clipPath></defs>')
        img = ('<image x="25" y="35" width="470" height="470" preserveAspectRatio="xMidYMid slice"'
               f' clip-path="url(#pfp)" xlink:href="data:image/jpeg;base64,{b64}"/>')
        return defs + "\n" + img, 495
    out = [f'<text x="{ASCII_X}" y="{ASCII_Y0}" fill="{fill}" font-size="{ASCII_FONT}px" class="ascii">']
    y = ASCII_Y0
    for row in ASCII_ROWS:
        out.append(f'<tspan x="{ASCII_X}" y="{y}">{escape(row)}</tspan>')
        y += ASCII_LINE
    out.append("</text>")
    return "\n".join(out), int(ASCII_X + max(len(r) for r in ASCII_ROWS) * ASCII_ADV)

# ---- right column stats card ----
def strip(s):
    return re.sub(r"<[^>]+>", "", s)

def label_markup(parts):
    return ".".join(f'<tspan class="key">{escape(p)}</tspan>' for p in parts)

def prefix_len(parts):
    """Visible chars before the dots: '. ' + label + ':'."""
    return len(". ") + len(".".join(parts)) + len(":")

# Single-value info rows: (y, label-parts, value, value_id-for-today.py, is_spacer)
INFO = [
    (50,  ("OS",),                      "Windows 11",                               None),
    (70,  ("Uptime",),                  "—",                                        "age_data"),
    (90,  ("Host",),                    "Accenture Argentina",                      None),
    (110, ("Role",),                    "GenAI Solution Architect & Delivery Lead", None),
    (130, ("IDE",),                     "VS Code",                                  None),
    (170, ("Languages", "Programming"), "Python, TypeScript, JavaScript, SQL",      None),
    (190, ("Languages", "Frameworks"),  "FastAPI, Node.js, Angular, React, Vue",    None),
    (210, ("Languages", "Real"),        "Spanish (native), English (C1)",           None),
    (250, ("Focus", "AI"),              "RAG, Text-to-SQL, Agents, MCP",            None),
    (270, ("Focus", "Cloud"),           "Azure, AWS, SAP BTP",                      None),
    (330, ("Email",),                   "emiber@gmail.com",                         None),
    (350, ("Web",),                     "emiber.vercel.app",                        None),
    (370, ("Location",),                "Buenos Aires, Argentina",                  None),
    (390, ("LinkedIn",),                "emilianoberestovoy",                       None),
    (410, ("GitHub",),                  "emiber",                                   None),
]

# Every info row is justified to this same right edge: widest row + a short dot run.
# age_data's real value comes from today.py, which right-justifies it to the same
# edge via its own `length` arg -> keep today.py's age_data length = TARGET_WIDTH - 11.
TARGET_WIDTH = max(prefix_len(p) + len(v) for _, p, v, vid in INFO if vid != "age_data") + DOT_MIN + 2

def content_line(y, parts, value, value_id=None):
    # Fill the gap between label and value with dots so the value sits at TARGET_WIDTH.
    n = max(DOT_MIN, TARGET_WIDTH - prefix_len(parts) - len(value) - len("  "))
    dots = " " + ("." * n) + " "
    dots_id = f' id="{value_id}_dots"' if value_id else ""
    val_id = f' id="{value_id}"' if value_id else ""
    return (f'<tspan x="{RX}" y="{y}" class="cc">. </tspan>{label_markup(parts)}:'
            f'<tspan class="cc"{dots_id}>{dots}</tspan>'
            f'<tspan class="value"{val_id}>{escape(value)}</tspan>')

def spacer(y):
    return f'<tspan x="{RX}" y="{y}" class="cc">. </tspan>'

# GitHub-stats grid: two aligned columns of "label: ...dots... value" cells.
# today.py re-justifies each value inside its cell -> keep its length arg in sync:
#   length = cell_width - len(label) - 3   (see the map in today.py.svg_overwrite)
STAT_LEFT_W = 26   # chars in the left cell  (Repos / Commits / Contributed)
STAT_RIGHT_W = 34  # chars in the right cell (Stars / Followers)

def stat_cell(label, value_id, value, width):
    n = max(DOT_MIN, width - len(label) - len(value) - 3)   # -3: colon + two dot-spaces
    dots = " " + ("." * n) + " "
    return (f'<tspan class="key">{escape(label)}</tspan>:'
            f'<tspan class="cc" id="{value_id}_dots">{dots}</tspan>'
            f'<tspan class="value" id="{value_id}">{escape(value)}</tspan>')

def stat_row(y, left_cell, right_cell=None):
    sep = ('<tspan class="cc"> | </tspan>' + right_cell) if right_cell else ""
    return f'<tspan x="{RX}" y="{y}" class="cc">. </tspan>{left_cell}{sep}'

# ------------------------------- CONTENT -------------------------------
content = {}
content[30]  = None
for y, parts, value, value_id in INFO:
    content[y] = content_line(y, parts, value, value_id=value_id)
content[150] = spacer(150)
content[230] = spacer(230)
content[310] = None
content[450] = None
content[470] = stat_row(470, stat_cell("Repos",   "repo_data",   "0", STAT_LEFT_W),
                             stat_cell("Stars",     "star_data",     "0", STAT_RIGHT_W))
content[490] = stat_row(490, stat_cell("Commits", "commit_data", "0", STAT_LEFT_W),
                             stat_cell("Followers", "follower_data", "0", STAT_RIGHT_W))
content[510] = stat_row(510, stat_cell("Contributed", "contrib_data", "0", STAT_LEFT_W))
content[530] = ('<tspan x="{RX}" y="530" class="cc">. </tspan><tspan class="key">Lines of Code on GitHub</tspan>:'
                '<tspan class="cc" id="loc_data_dots">. </tspan><tspan class="value" id="loc_data">0</tspan>'
                ' ( <tspan class="addColor" id="loc_add">0</tspan><tspan class="addColor">++</tspan>,'
                ' <tspan id="loc_del_dots"> </tspan><tspan class="delColor" id="loc_del">0</tspan><tspan class="delColor">--</tspan> )').format(RX=RX)
# -----------------------------------------------------------------------

max_content = max(len(strip(v)) for v in content.values() if v)

def title(y, text):
    k = max(4, max_content - len(text) - 5)
    sep = " -" + (EMDASH * k) + "-" + EMDASH + "-"
    return f'<tspan x="{RX}" y="{y}">{escape(text)}</tspan>{sep}'

content[30]  = title(30, "emiliano@berestovoy")
content[310] = title(310, "- Contact")
content[450] = title(450, "- GitHub Stats")
right = "\n".join(content[y] for y in sorted(content))

THEMES = {
    "dark_mode.svg": dict(bg="#161b22", fg="#c9d1d9", key="#ffa657", value="#a5d6ff",
                          add="#3fb950", dele="#f85149", cc="#616e7f"),
    "light_mode.svg": dict(bg="#f6f8fa", fg="#24292f", key="#953800", value="#0a3069",
                           add="#1a7f37", dele="#cf222e", cc="#c2cfde"),
}

SKELETON = """<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" font-family="ConsolasFallback,Consolas,monospace" width="{w}px" height="{h}px" font-size="16px">
<style>
@font-face {{
src: local('Consolas'), local('Consolas Bold');
font-family: 'ConsolasFallback';
font-display: swap;
-webkit-size-adjust: 109%;
size-adjust: 109%;
}}
.key {{fill: {key};}}
.value {{fill: {value};}}
.addColor {{fill: {add};}}
.delColor {{fill: {dele};}}
.cc {{fill: {cc};}}
text, tspan {{white-space: pre;}}
</style>
<rect width="{w}px" height="{h}px" fill="{bg}" rx="15"/>
{left}
<text x="{rx}" y="30" fill="{fg}">
{right}
</text>
</svg>
"""

for fname, t in THEMES.items():
    left, left_extent = left_defs_and_visual(t["fg"])
    WIDTH = int(RX + max_content * ADV + MARGIN)
    WIDTH = max(WIDTH, left_extent + MARGIN)
    svg = SKELETON.format(w=WIDTH, h=HEIGHT, rx=RX, left=left, right=right, **t)
    with open(os.path.join(REPO, fname), "w", encoding="utf-8") as f:
        f.write(svg)

print(f"wrote SVGs  width={WIDTH} height={HEIGHT}  USE_PHOTO={USE_PHOTO}  max_content={max_content}  RX={RX}")
print(f"info rows justified to TARGET_WIDTH={TARGET_WIDTH}  (today.py age_data length must be {TARGET_WIDTH - 11})")
print("Stats are 0 placeholders -> run: ACCESS_TOKEN=<pat> python today.py")
