#!/usr/bin/env python3
"""Standalone Codex "browser" for local logs.

This gives you a minimal TUI-style view over sessions stored in `codex_state.sqlite3`.
It's deliberately lightweight so you can expand it or replace it with a richer UI.
"""

import argparse
import sqlite3
import textwrap
from pathlib import Path

DB_PATH = Path("codex_state.sqlite3")


def get_conn() -> sqlite3.Connection:
    return sqlite3.connect(DB_PATH)


def list_sessions(conn: sqlite3.Connection):
    cur = conn.execute(
        """
        SELECT DISTINCT session_id
        FROM codex_sessions
        ORDER BY session_id;
        """
    )
    for (sid,) in cur.fetchall():
        print(sid)


def show_session(conn: sqlite3.Connection, session_id: str):
    cur = conn.execute(
        """
        SELECT role, content
        FROM codex_sessions
        WHERE session_id = ?
        ORDER BY ts ASC;
        """, (session_id,),
    )
    rows = cur.fetchall()
    if not rows:
        print(f"No records for session_id={session_id!r}")
        return

    for role, content in rows:
        header = f"[{role.upper()}]"
        print("=" * len(header))
        print(header)
        print("=" * len(header))
        print(textwrap.fill(content, width=88))
        print()


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Minimal Codex log browser")
    ap.add_argument("session_id", nargs="?", help="Session ID to inspect.")
    ap.add_argument("--list", action="store_true", help="List available sessions.")
    args = ap.parse_args(argv)

    conn = get_conn()

    if args.list or not args.session_id:
        list_sessions(conn)
    else:
        show_session(conn, args.session_id)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
