#!/usr/bin/env python3
"""Build both copies of the counter cheat sheets from one source.

sheets-source.json is the source. This writes:

  fakes.json   what the tool reads - the 60-second checks, the free lookups,
               the shop rules, and which sheets hold a price back
  <docx>       the printed version for the binder, one sheet per page

Run it after editing sheets-source.json, and never edit either output by hand:
they are generated, and a hand edit is gone the next time this runs.

    python3 tools/build-sheets.py
"""
import json, re, sys, os
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_BREAK, WD_ALIGN_PARAGRAPH

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(HERE, "sheets-source.json")
APP  = os.path.join(HERE, "fakes.json")
DOCX = os.path.join(HERE, "Lamar's Counter Cheat Sheets - Spotting Fakes.docx")

MAROON = RGBColor(0x6B, 0x1F, 0x2E)
GOLD   = RGBColor(0x8A, 0x6D, 0x2F)
INK    = RGBColor(0x1A, 0x1A, 0x1A)

def is_row(t):      return t.startswith("|")
def is_rule(t):     return bool(re.match(r"^\|\s*:?-", t))
def cells(t):       return [c.strip() for c in t.strip("|").split("|")]

# ---------------------------------------------------------------- app payload
def build_app(src):
    """Only what the counter needs on screen: the 60-second check and the
       lookups. The full check and the rest stay in the printed sheet."""
    out = {"updated": src["updated"],
           "source": ("Lamar's Counter Cheat Sheets - Spotting Fakes (Business Plan and "
                      "Operations). That document is the full version; these are its "
                      "60-second checks. Both are generated from sheets-source.json."),
           "law": src["law"], "sheets": []}
    for s in src["sheets"]:
        secs = {x["heading"]: x["body"] for x in s["sections"]}
        checks = [c for c in secs.get("60-second check", []) if not c.endswith("short version:")]
        look = []
        for t in secs.get("Look it up free", []):
            if is_row(t):
                if is_rule(t): continue
                c = cells(t)
                if c[0] in ("Item", "Coin", "Brand", "What"): continue
                if len(c) >= 2 and c[0] and c[1]: look.append({"what": c[0], "where": c[1]})
            elif ":" in t:
                w, where = t.split(":", 1); look.append({"what": w.strip(), "where": where.strip()})
            elif t:
                look.append({"what": "", "where": t})
        out["sheets"].append({"id": s["id"], "n": s["n"], "title": s["title"], "gate": s["gate"],
                              "why": (s["intro"] or [""])[0], "match": s["match"],
                              "checks": checks, "lookup": look, "rule": s.get("rule")})
    return out

# ------------------------------------------------------------------- the docx
def style(doc):
    n = doc.styles["Normal"]
    n.font.name = "Calibri"; n.font.size = Pt(10.5); n.font.color.rgb = INK
    n.paragraph_format.space_after = Pt(4); n.paragraph_format.space_before = Pt(0)
    for sec in doc.sections:
        sec.top_margin = sec.bottom_margin = Inches(0.5)
        sec.left_margin = sec.right_margin = Inches(0.6)

def para(doc, text, size=10.5, bold=False, color=None, space=4, align=None):
    p = doc.add_paragraph(); r = p.add_run(text)
    r.font.size = Pt(size); r.bold = bold
    if color is not None: r.font.color.rgb = color
    p.paragraph_format.space_after = Pt(space)
    if align is not None: p.alignment = align
    return p

def bullets(doc, items):
    for t in items:
        p = doc.add_paragraph(t, style="List Bullet")
        p.paragraph_format.space_after = Pt(2)
        for r in p.runs: r.font.size = Pt(10.5)

def table(doc, rows):
    head, body = rows[0], rows[1:]
    t = doc.add_table(rows=1, cols=len(head)); t.style = "Table Grid"
    for i, h in enumerate(head):
        c = t.rows[0].cells[i]; c.text = ""
        r = c.paragraphs[0].add_run(h); r.bold = True; r.font.size = Pt(9.5); r.font.color.rgb = MAROON
    for row in body:
        cs = t.add_row().cells
        for i, v in enumerate(row[:len(head)]):
            cs[i].text = ""
            r = cs[i].paragraphs[0].add_run(v); r.font.size = Pt(9.5)

def body_block(doc, lines):
    """A section body is bullets, tables and plain lines, in the order given."""
    buf, tbl = [], []
    def flush_b():
        nonlocal buf
        if buf: bullets(doc, buf); buf = []
    def flush_t():
        nonlocal tbl
        if tbl: table(doc, tbl); tbl = []
    for t in lines:
        if is_row(t):
            flush_b()
            if not is_rule(t): tbl.append(cells(t))
        else:
            flush_t()
            if t.startswith("Myth:"):
                flush_b(); para(doc, t, size=10, bold=True, color=GOLD)
            else:
                buf.append(t)
    flush_b(); flush_t()

def build_docx(src):
    doc = Document(); style(doc)
    para(doc, "LAMAR'S", size=9, bold=True, color=GOLD, space=0)
    para(doc, "Counter cheat sheets: spotting fakes", size=20, bold=True, color=MAROON, space=6)
    for t in src["front"]:
        if is_row(t):
            continue
        para(doc, t, size=10, space=3)
    rows = [cells(t) for t in src["front"] if is_row(t) and not is_rule(t)]
    if rows: table(doc, rows)

    for s in src["sheets"]:
        doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
        para(doc, "SHEET %d    LAMAR'S · SPOTTING FAKES" % s["n"], size=9, bold=True, color=GOLD, space=0)
        para(doc, s["title"], size=16, bold=True, color=MAROON, space=5)
        for t in s["intro"]: para(doc, t, size=10, space=4)
        for sec in s["sections"]:
            para(doc, sec["heading"], size=11.5, bold=True, color=MAROON, space=3)
            body_block(doc, sec["body"])
        if s.get("rule"):
            para(doc, "Suggested rule: " + s["rule"], size=10, bold=True, color=GOLD)
        if s.get("sources"):
            para(doc, "Sources: " + s["sources"], size=8, color=RGBColor(0x60, 0x60, 0x60))
    doc.save(DOCX)
    return DOCX

if __name__ == "__main__":
    src = json.load(open(SRC, encoding="utf-8"))
    app = build_app(src)
    json.dump(app, open(APP, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    path = build_docx(src)
    print("fakes.json  %5.1f KB  (%d sheets, %d gating)"
          % (os.path.getsize(APP)/1024, len(app["sheets"]), sum(1 for x in app["sheets"] if x["gate"])))
    print("%s  %5.1f KB" % (os.path.basename(path), os.path.getsize(path)/1024))
