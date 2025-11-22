#!/usr/bin/env python3
"""CODEX-MONAD: thin CLI wrapper around a chat/completion API.

Reads a prompt from stdin or `-m/--message`, calls the model, and logs
requests/responses into the local SQLite DB used by the symbolic drift logger.

You should replace `call_model()` with your real Codex / LLM client.
"""

import argparse
import json
import sqlite3
import sys
import time
from pathlib import Path
from typing import Dict, Any

DB_PATH = Path("codex_state.sqlite3")


def init_db(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS codex_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts REAL NOT NULL,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL
        );
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS codex_meta (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts REAL NOT NULL,
            session_id TEXT NOT NULL,
            key TEXT NOT NULL,
            value TEXT NOT NULL
        );
        """
    )
    conn.commit()


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    init_db(conn)
    return conn


def log_message(conn: sqlite3.Connection, session_id: str, role: str, content: str) -> None:
    conn.execute(
        "INSERT INTO codex_sessions (ts, session_id, role, content) VALUES (?, ?, ?, ?)",
        (time.time(), session_id, role, content),
    )
    conn.commit()


def log_meta(conn: sqlite3.Connection, session_id: str, key: str, value: Any) -> None:
    conn.execute(
        "INSERT INTO codex_meta (ts, session_id, key, value) VALUES (?, ?, ?, ?)",
        (time.time(), session_id, key, json.dumps(value)),
    )
    conn.commit()


def call_model(prompt: str, model: str = "gpt-4.1-mini") -> Dict[str, Any]:
    """Stub model call.

    Replace this with the actual Codex / LLM client you use in your stack.
    This returns a dummy echo-style response to keep the script runnable.
    """
    content = f"[DUMMY RESPONSE from {model}] {prompt[:200]}"
    return {
        "model": model,
        "content": content,
        "raw": {"echo": True},
    }


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="CODEX-MONAD wrapper CLI")
    p.add_argument("-m", "--message", help="Message to send. If omitted, read from stdin." )
    p.add_argument("-s", "--session-id", default="default", help="Logical session ID for logging.")
    p.add_argument("--model", default="gpt-4.1-mini", help="Model identifier.")
    args = p.parse_args(argv)

    if args.message:
        prompt = args.message
    else:
        prompt = sys.stdin.read().strip()

    if not prompt:
        print("No prompt provided on stdin or -m/--message", file=sys.stderr)
        return 1

    conn = get_conn()
    log_message(conn, args.session_id, "user", prompt)

    result = call_model(prompt, model=args.model)
    assistant_content = result["content"]
    log_message(conn, args.session_id, "assistant", assistant_content)
    log_meta(conn, args.session_id, "model", result["model"])
    log_meta(conn, args.session_id, "raw", result["raw"])

    # Print assistant response to stdout
    print(assistant_content)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
