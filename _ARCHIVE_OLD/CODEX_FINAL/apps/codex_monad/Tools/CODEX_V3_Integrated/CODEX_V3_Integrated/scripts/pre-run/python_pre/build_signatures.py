
import os, sys, json, argparse, hashlib, re
from pathlib import Path

def is_text_ext(ext):
    return ext.lower() in {".md",".txt",".json",".yaml",".yml",".toml",".ps1",".psm1",".psd1",".sh",".py",".js",".ts",".c",".h",".cpp",".cs",".java",".swift",".go",".rb",".php",".rs",".kt",".sql",".rtf"}

def read_text(path, cap=1048576):
    try:
        with open(path, "rb") as f:
            b = f.read(cap)
        try:
            return b.decode("utf-8", errors="ignore")
        except:
            return b.decode("latin-1", errors="ignore")
    except:
        return ""

def tokenize(s):
    s = re.sub(r"[^\w]+", " ", s.lower())
    return [t for t in s.split() if 2 < len(t) < 48]

def shingles(tokens, k=7):
    return [" ".join(tokens[i:i+k]) for i in range(max(0, len(tokens)-k+1))]

def simhash(tokens, hashbits=64):
    v = [0]*hashbits
    for t in tokens:
        h = int(hashlib.md5(t.encode("utf-8")).hexdigest(), 16)
        for i in range(hashbits):
            bit = 1 if (h >> i) & 1 else -1
            v[i] += bit
    fp = 0
    for i in range(hashbits):
        if v[i] >= 0:
            fp |= (1 << i)
    return fp

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--catalog", required=True)
    args = ap.parse_args()

    with open(args.config, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    out_dir = os.path.join(cfg["OutputRoot"], "metadata", "pre")
    os.makedirs(out_dir, exist_ok=True)
    sig_path = os.path.join(out_dir, "signatures.jsonl")

    shingle_k = int(cfg["PreRun"]["Similarity"]["ShingleSize"])
    max_bytes = int(cfg["PreRun"]["MaxTextBytes"])

    with open(args.catalog, "r", encoding="utf-8") as fr, open(sig_path, "w", encoding="utf-8") as fw:
        for line in fr:
            rec = json.loads(line)
            text = ""
            if is_text_ext(rec.get("ext","")):
                text = read_text(rec["path"], cap=max_bytes)
            hay = (rec["path"] + "\\n" + text).lower()
            toks = tokenize(hay)
            sh = simhash(shingles(toks, k=shingle_k)) if toks else 0
            out = {"id": rec["id"], "path": rec["path"], "simhash": f"{sh:016x}", "tokens": toks[:2048]}
            fw.write(json.dumps(out, ensure_ascii=False) + "\\n")
    print(f"Signatures saved: {sig_path}")

if __name__ == "__main__":
    main()
