#!/usr/bin/env python3
import os, re, pathlib

ROOT = pathlib.Path(__file__).parent
CONTENT = ROOT / "content"
TEMPL = ROOT / "templates"
OUT_INDEX = ROOT / "index.html"

def classify(name):
    base = os.path.basename(name).lower()
    if base.startswith("n-"):
        return "form"
    if base.startswith("l-"):
        return "legal"
    return "other"

def nice_title(fname):
    base = os.path.basename(fname)
    title = re.sub(r'[_\-]+',' ', os.path.splitext(base)[0]).strip()
    return title

def collect():
    items = []
    for dp,_,files in os.walk(CONTENT):
        for f in files:
            if f.startswith('.'): 
                continue
            ext = os.path.splitext(f)[1].lower()
            if ext not in ('.pdf','.html','.htm','.md','.txt','.png','.jpg','.jpeg','.gif','.webp','.svg'):
                continue
            full = pathlib.Path(dp)/f
            rel = full.relative_to(ROOT).as_posix()
            items.append({
                "path": rel,
                "title": nice_title(f),
                "kind": classify(f),
                "size": full.stat().st_size
            })
    return sorted(items, key=lambda x: (x["kind"], x["title"].lower()))

def render_index(items):
    base = (TEMPL/"base.html").read_text()
    tmpl = (TEMPL/"index_template.html").read_text()
    def card(it):
        meta = f'{round(it["size"]/1024,1)} KB'
        return (
            f'<a class="card" data-item data-kind="{it["kind"]}" '
            f'data-text="{(it["title"]+" "+it["path"]).lower()}" '
            f'href="{it["path"]}" target="_blank">'
            f'<h3>{it["title"]}</h3>'
            f'<div class="muted">{it["path"]}</div>'
            f'<div style="margin-top:8px"><span class="badge">{it["kind"]}</span> {meta}</div>'
            f'</a>'
        )
    counts = {
        "count_forms": sum(1 for i in items if i["kind"]=="form"),
        "count_legal": sum(1 for i in items if i["kind"]=="legal"),
        "count_other": sum(1 for i in items if i["kind"]=="other"),
        "count_total": len(items),
    }
    html = tmpl.format(cards="\n".join(card(i) for i in items), **counts)
    OUT_INDEX.write_text(base.format(title="DIN — Local Portal", body=html))

def main():
    CONTENT.mkdir(exist_ok=True, parents=True)
    items = collect()
    render_index(items)
    print(f"Indexed {len(items)} items. Open index.html")

if __name__=="__main__":
    main()
