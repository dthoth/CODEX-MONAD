#!/usr/bin/env python3
"""Symbolic Drift Logger for Codex conversations.

This walks the `codex_sessions` table, builds simple bag-of-words signatures
for prompts, and computes a trivial drift metric over time.

It's intentionally simple: adapt and plug into your real metrics pipeline.
"""

import argparse
import collections
import math
import sqlite3
import time
from pathlib import Path
from typing import Dict, List, Tuple

DB_PATH = Path("codex_state.sqlite3")


def get_conn() -> sqlite3.Connection:
    return sqlite3.connect(DB_PATH)


def tokenise(text: str) -> List[str]:
    return [t.lower() for t in text.split() if t.strip()]


def session_prompts(conn: sqlite3.Connection) -> List[Tuple[float, str]]:
    cur = conn.execute(
        """
        SELECT ts, content
        FROM codex_sessions
        WHERE role = 'user'
        ORDER BY ts ASC;
        """
    )
    return [(ts, content) for (ts, content) in cur.fetchall()]


def vectorise(text: str) -> Dict[str, float]:
    tokens = tokenise(text)
    counts = collections.Counter(tokens)
    total = float(sum(counts.values()) or 1.0)
    return {k: v / total for k, v in counts.items()}


def cosine(a: Dict[str, float], b: Dict[str, float]) -> float:
    keys = set(a) | set(b)
    dot = sum(a.get(k, 0.0) * b.get(k, 0.0) for k in keys)
    na = math.sqrt(sum(v * v for v in a.values()))
    nb = math.sqrt(sum(v * v for v in b.values()))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def compute_drift(points: List[Tuple[float, str]], window: int = 10) -> List[Tuple[float, float]]:
    """Return list of (ts, drift_score) pairs.

    Drift score here is 1 - cosine similarity to the previous window centroid.
    """
    if not points:
        return []

    vecs = [vectorise(text) for (_, text) in points]
    out: List[Tuple[float, float]] = []

    for i in range(len(points)):
        ts, _ = points[i]

        if i < window:
            # Not enough history; treat as baseline
            out.append((ts, 0.0))
            continue

        # centroid of previous window
        keys = set().union(*vecs[i - window : i])
        centroid = {
            k: sum(vecs[j].get(k, 0.0) for j in range(i - window, i)) / float(window)
            for k in keys
        }
        score = 1.0 - cosine(centroid, vecs[i])
        out.append((ts, score))

    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Symbolic drift logger over Codex sessions")
    ap.add_argument("--window", type=int, default=10, help="Window size for centroid history.")
    args = ap.parse_args(argv)

    conn = get_conn()
    pts = session_prompts(conn)
    drift = compute_drift(pts, window=args.window)

    # Simple text output; you can redirect to CSV/JSON.
    for ts, score in drift:
        ts_str = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(ts))
        print(f"{ts_str}\t{score:.4f}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
