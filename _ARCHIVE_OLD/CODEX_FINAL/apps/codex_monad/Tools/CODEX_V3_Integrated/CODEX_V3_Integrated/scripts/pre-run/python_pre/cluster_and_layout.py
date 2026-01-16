
import os, sys, json, argparse
from pathlib import Path

def hamming(a_hex, b_hex):
    a = int(a_hex, 16); b = int(b_hex, 16)
    return bin(a ^ b).count("1")

def jaccard(a_tokens, b_tokens):
    if not a_tokens and not b_tokens: return 1.0
    sa, sb = set(a_tokens), set(b_tokens)
    inter = len(sa & sb); union = len(sa | sb) or 1
    return inter / union

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    args = ap.parse_args()
    cfg = json.load(open(args.config, "r", encoding="utf-8"))
    out_dir = os.path.join(cfg["OutputRoot"], "metadata", "pre")
    sig_path = os.path.join(out_dir, "signatures.jsonl")
    catalog_path = os.path.join(out_dir, "catalog.jsonl")

    sigs = {}; tokens = {}
    with open(sig_path, "r", encoding="utf-8") as f:
        for line in f:
            r = json.loads(line)
            sigs[r["id"]] = r["simhash"]
            tokens[r["id"]] = r.get("tokens", [])

    meta = {}
    with open(catalog_path, "r", encoding="utf-8") as f:
        for line in f:
            r = json.loads(line)
            meta[r["id"]] = r

    ham_threshold = int(cfg["PreRun"]["Similarity"]["SimHashHamming"])
    jac_threshold = float(cfg["PreRun"]["Similarity"]["MinOverlapJaccard"])

    parent = {}
    def find(x):
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    def union(a,b):
        ra, rb = find(a), find(b)
        if ra != rb: parent[rb] = ra

    ids = list(sigs.keys()); n = len(ids)
    for i in range(n):
        for j in range(i+1, n):
            a, b = ids[i], ids[j]
            if hamming(sigs[a], sigs[b]) <= ham_threshold:
                union(a,b)
            else:
                if jaccard(tokens[a], tokens[b]) >= jac_threshold:
                    union(a,b)

    clusters = {}
    for x in ids:
        r = find(x); clusters.setdefault(r, []).append(x)

    min_size = int(cfg["PreRun"]["Clustering"]["MinClusterSize"])
    clusters = {k:v for k,v in clusters.items() if len(v) >= min_size}

    bucket_rule = cfg["PreRun"]["ProposedLayout"]["BucketRules"]
    proposed = []
    for cid, members in clusters.items():
        langs = {}; projs = {}; tags = set()
        for m in members:
            rec = meta.get(m, {})
            langs[rec.get("language","Text")] = langs.get(rec.get("language","Text"), 0)+1
            projs[Path(rec.get("projectRoot","misc")).name] = projs.get(Path(rec.get("projectRoot","misc")).name, 0)+1
            for t in rec.get("tags", []): tags.add(t)
        lang = max(langs.items(), key=lambda x:x[1])[0]
        proj = max(projs.items(), key=lambda x:x[1])[0]
        if bucket_rule == "theme_first":
            theme = next((t for t in ["codex","obsidian","thoth","kernel","snort3","xcode","visualstudio"] if t in tags), None)
            target = f"notes/Document/{theme}" if theme in ["codex","obsidian","thoth"] and theme else f"collection/{lang}/{proj}"
        elif bucket_rule == "project_first":
            target = f"collection/{lang}/{proj}"
        else:
            target = f"collection/{lang}/_clustered"
        proposed.append({"clusterId": cid, "size": len(members), "target": target, "members": [meta[m]["path"] for m in members if m in meta]})

    with open(os.path.join(out_dir, "clusters.json"), "w", encoding="utf-8") as f:
        json.dump(proposed, f, indent=2)
    with open(os.path.join(cfg["OutputRoot"], "metadata", "proposed_layout.json"), "w", encoding="utf-8") as f:
        json.dump(proposed, f, indent=2)
    print(f"Clusters: {len(proposed)} → metadata\\proposed_layout.json")

if __name__ == "__main__":
    main()
