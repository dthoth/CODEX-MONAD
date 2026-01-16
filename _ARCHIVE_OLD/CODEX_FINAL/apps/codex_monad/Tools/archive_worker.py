#!/usr/bin/env python3
"""Archiving worker for Codex logs.

Reads from `codex_state.sqlite3` and writes out newline-delimited JSON snapshots
under `archive/` grouped by day. This is meant as a starting point for your
Database & Archiving project.
"""

import argparse
import json
import os
import sqlite3
import time
from pathlib import Path
from typing import Dict, Any

DB_PATH = Path("codex_state.sqlite3")
ARCHIVE_ROOT = Path("archive")


def get_conn() -> sqlite3.Connection:
    return sqlite3.connect(DB_PATH)


def fetch_since(conn: sqlite3.Connection, since_ts: float):
    cur = conn.execute(
        """
        SELECT ts, session_id, role, content
        FROM codex_sessions
        WHERE ts > ?
        ORDER BY ts ASC;
        """, (since_ts,),
    )
    for row in cur:
        yield {
            "ts": row[0],
            "session_id": row[1],
            "role": row[2],
            "content": row[3],
        }


def archive_records(records):
    ARCHIVE_ROOT.mkdir(exist_ok=True)
    count = 0
    for rec in records:
        day = time.strftime("%Y-%m-%d", time.localtime(rec["ts"]))
        day_dir = ARCHIVE_ROOT / day
        day_dir.mkdir(exist_ok=True)
        path = day_dir / "codex_log.ndjson"
        with open(path, "a", encoding="utf-8") as f:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
        count += 1
    return count


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Archive Codex logs to NDJSON by day")
    ap.add_argument("--since", type=float, default=0.0, help="Unix timestamp to resume from.")
    args = ap.parse_args(argv)

    conn = get_conn()
    recs = list(fetch_since(conn, args.since))
    written = archive_records(recs)
    print(f"Archived {written} records since {args.since}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
