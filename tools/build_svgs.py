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

USE_PHOTO = True
PHOTO = os.path.join(REPO, "profile.jpg")

RX = 540 if USE_PHOTO else 600   # right column x start
ADV = 10.4        # px per char, conservative (covers Consolas+size-adjust and wider system mono)
MARGIN = 30
HEIGHT = 540
MAXEND = 64
TARGET = 34
EMDASH = "—"

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
    with open(os.path.join(HERE, "ascii_rows.txt"), encoding="utf-8") as f:
        rows = f.read().split("\n")
    out = [f'<text x="15" y="30" fill="{fill}" class="ascii">']
    y = 30
    for row in rows:
        out.append(f'<tspan x="15" y="{y}">{escape(row)}</tspan>')
        y += 20
    out.append("</text>")
    return "\n".join(out), int(15 + max(len(r) for r in rows) * ADV)

# ---- right column stats card ----
def strip(s):
    return re.sub(r"<[^>]+>", "", s)

def label_markup(parts):
    return ".".join(f'<tspan class="key">{escape(p)}</tspan>' for p in parts)

def content_line(y, parts, value, value_id=None):
    llen = len(".".join(parts)); vlen = len(value)
    vstart = min(TARGET, MAXEND - vlen)
    n = max(1, vstart - (5 + llen))
    dots = " " + ("." * n) + " "
    dots_id = f' id="{value_id}_dots"' if value_id else ""
    val_id = f' id="{value_id}"' if value_id else ""
    return (f'<tspan x="{RX}" y="{y}" class="cc">. </tspan>{label_markup(parts)}:'
            f'<tspan class="cc"{dots_id}>{dots}</tspan>'
            f'<tspan class="value"{val_id}>{escape(value)}</tspan>')

def spacer(y):
    return f'<tspan x="{RX}" y="{y}" class="cc">. </tspan>'

# ------------------------------- CONTENT -------------------------------
content = {}
content[30]  = None
content[50]  = content_line(50,  ("OS",),                      "Windows 11")
content[70]  = content_line(70,  ("Uptime",),                  "—", value_id="age_data")
content[90]  = content_line(90,  ("Host",),                    "Accenture Argentina")
content[110] = content_line(110, ("Role",),                    "GenAI Solution Architect & Delivery Lead")
content[130] = content_line(130, ("IDE",),                     "VS Code")
content[150] = spacer(150)
content[170] = content_line(170, ("Languages", "Programming"), "Python, TypeScript, JavaScript, SQL")
content[190] = content_line(190, ("Languages", "Frameworks"),  "FastAPI, Node.js, Angular, React, Vue")
content[210] = content_line(210, ("Languages", "Real"),        "Spanish (native), English (C1)")
content[230] = spacer(230)
content[250] = content_line(250, ("Focus", "AI"),              "RAG, Text-to-SQL, Agents, MCP")
content[270] = content_line(270, ("Focus", "Cloud"),           "Azure, AWS, SAP BTP")
content[310] = None
content[330] = content_line(330, ("Email",),                   "emiber@gmail.com")
content[350] = content_line(350, ("Web",),                     "emiber.vercel.app")
content[370] = content_line(370, ("Location",),                "Buenos Aires, Argentina")
content[390] = content_line(390, ("LinkedIn",),                "emilianoberestovoy")
content[410] = content_line(410, ("GitHub",),                  "emiber")
content[450] = None
content[470] = ('<tspan x="{RX}" y="470" class="cc">. </tspan><tspan class="key">Repos</tspan>:'
                '<tspan class="cc" id="repo_data_dots"> .... </tspan><tspan class="value" id="repo_data">0</tspan>'
                ' {{<tspan class="key">Contributed</tspan>: <tspan class="value" id="contrib_data">0</tspan>}}'
                ' | <tspan class="key">Stars</tspan>:<tspan class="cc" id="star_data_dots"> ........... </tspan>'
                '<tspan class="value" id="star_data">0</tspan>').format(RX=RX)
content[490] = ('<tspan x="{RX}" y="490" class="cc">. </tspan><tspan class="key">Commits</tspan>:'
                '<tspan class="cc" id="commit_data_dots"> ................. </tspan><tspan class="value" id="commit_data">0</tspan>'
                ' | <tspan class="key">Followers</tspan>:<tspan class="cc" id="follower_data_dots"> ....... </tspan>'
                '<tspan class="value" id="follower_data">0</tspan>').format(RX=RX)
content[510] = ('<tspan x="{RX}" y="510" class="cc">. </tspan><tspan class="key">Lines of Code on GitHub</tspan>:'
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
print("Stats are 0 placeholders -> run: ACCESS_TOKEN=<pat> python today.py")
