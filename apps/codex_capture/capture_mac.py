#!/usr/bin/env python3
"""
Minimal macOS capture for CODEX

- Logs keystrokes
- Tags them with active app name
- Writes to: ~/Codex/CODEX-MONAD/data/capture/daily/YYYY-MM-DD_keys.log

This is the "baseline triangle" for today:
    keystrokes + active app context
Clipboard + fancier stuff can be layered on later.
"""

import os
from pathlib import Path
from datetime import datetime

from pynput import keyboard
from AppKit import NSWorkspace


# ---- Paths --------------------------------------------------------------

HOME = Path.home()
CODEX_ROOT = HOME / "Codex" / "CODEX-MONAD"
DATA_ROOT = CODEX_ROOT / "data" / "capture" / "daily"
DATA_ROOT.mkdir(parents=True, exist_ok=True)


def day_log_path() -> Path:
    day = datetime.now().strftime("%Y-%m-%d")
    return DATA_ROOT / f"{day}_keys.log"


# ---- Active app --------------------------------------------------------

def get_active_app_name() -> str:
    ws = NSWorkspace.sharedWorkspace()
    app = ws.frontmostApplication()
    if app is None:
        return "UNKNOWN"
    name = app.localizedName() or "UNKNOWN_APP"
    return str(name)


current_app = None


def log_line(text: str) -> None:
    p = day_log_path()
    ts = datetime.now().isoformat(timespec="seconds")
    line = f"{ts} {text}"
    with p.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


# ---- Keyboard callbacks ------------------------------------------------

def on_press(key):
    global current_app

    try:
        app_name = get_active_app_name()
    except Exception as e:
        app_name = f"ERROR_APP({e})"

    if app_name != current_app:
        current_app = app_name
        log_line(f"\n--- APP SWITCH -> {app_name} ---")

    # Normalize key representation
    try:
        k = key.char
    except AttributeError:
        # Special key (Key.space, Key.enter, etc.)
        k = f"<{getattr(key, 'name', str(key))}>"

    log_line(f"{current_app}: {k}")


def on_release(key):
    # Optional: stop on ESC
    # from pynput.keyboard import Key
    # if key == Key.esc:
    #     return False
    pass


# ---- Main --------------------------------------------------------------

def main():
    log_line("=== capture_mac.py started ===")
    print("CODEX capture (macOS) running. Ctrl+C to stop.")

    with keyboard.Listener(on_press=on_press,
                           on_release=on_release) as listener:
        listener.join()


if __name__ == "__main__":
    main()