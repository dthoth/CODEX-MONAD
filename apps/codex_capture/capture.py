"""
CODEX Capture System
====================
The Baseline Triangle: Keystrokes, Clipboard, Window Context

Part of CODEX-MONAD: Portable Consciousness Infrastructure
https://github.com/dthoth/CODEX-MONAD

Origin: A conversation about Lomita Starbucks, localhost DDOSing,
        and seven years of triangulation finally landing.

Author: Rev. LL Dan-i-El + Claude (Anthropic)
License: MIT
"""

import os
import sys
import json
import time
import threading
from datetime import datetime
from pathlib import Path


# === CONFIGURATION LOADER ===

def load_config():
    """Load config, with local override support"""
    script_dir = Path(__file__).parent
    
    # Base config
    config_path = script_dir / "config.json"
    if not config_path.exists():
        print("[CODEX] ERROR: config.json not found")
        sys.exit(1)
    
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)
    
    # Local override (for personal deployments)
    local_config_path = script_dir / "config.local.json"
    if local_config_path.exists():
        with open(local_config_path, "r", encoding="utf-8") as f:
            local_config = json.load(f)
        # Merge - local overrides base
        if "capture_enabled" in local_config:
            config["capture_enabled"] = local_config["capture_enabled"]
        if "settings" in local_config:
            config["settings"].update(local_config["settings"])
        print("[CODEX] Loaded local config override")
    
    return config


# === MAIN CAPTURE CLASS ===

class CODEXCapture:
    def __init__(self, config):
        self.config = config
        self.settings = config.get("settings", {})
        
        # Resolve output directory relative to script location
        script_dir = Path(__file__).parent
        output_rel = self.settings.get("output_directory", "../../data/capture/daily")
        self.log_dir = (script_dir / output_rel).resolve()
        
        self.today = None
        self.keystroke_buffer = []
        self.current_window = None
        self.running = False
        
        # Settings
        self.flush_interval = self.settings.get("flush_interval_seconds", 30)
        self.window_poll = self.settings.get("window_poll_interval_seconds", 1)
        self.exclusions = self.settings.get("exclusions", {})
        
        # Feature toggles
        self.log_keystrokes = self.settings.get("log_keystrokes", True)
        self.log_clipboard = self.settings.get("log_clipboard", True)
        self.log_windows = self.settings.get("log_windows", True)
        
        # Create log directory
        self.log_dir.mkdir(parents=True, exist_ok=True)
        
    def get_today_dir(self):
        """Get/create today's log directory"""
        today = datetime.now().strftime("%Y-%m-%d")
        if today != self.today:
            self.today = today
            today_dir = self.log_dir / today
            today_dir.mkdir(exist_ok=True)
            return today_dir
        return self.log_dir / self.today
    
    def timestamp(self):
        """Current timestamp for logging"""
        return datetime.now().strftime("%H:%M:%S")
    
    def log_to_file(self, filename, content):
        """Append content to today's log file"""
        filepath = self.get_today_dir() / filename
        with open(filepath, "a", encoding="utf-8") as f:
            f.write(content)
    
    def is_excluded(self, window_title, app_name):
        """Check if current context should be excluded from logging"""
        title_exclusions = self.exclusions.get("window_title_contains", [])
        app_exclusions = self.exclusions.get("app_names", [])
        
        for exc in title_exclusions:
            if exc.lower() in window_title.lower():
                return True
        for exc in app_exclusions:
            if exc.lower() in app_name.lower():
                return True
        return False
    
    # === WINDOW LOGGER ===
    def get_active_window(self):
        """Get the currently active window title and process"""
        try:
            import win32gui
            import win32process
            import psutil
            
            hwnd = win32gui.GetForegroundWindow()
            _, pid = win32process.GetWindowThreadProcessId(hwnd)
            process = psutil.Process(pid)
            window_title = win32gui.GetWindowText(hwnd)
            app_name = process.name()
            
            return app_name, window_title
        except Exception as e:
            return "Unknown", f"[Error: {e}]"
    
    def window_logger(self):
        """Track active window changes"""
        if not self.log_windows:
            return
            
        print("[CODEX] Window logger started")
        last_window = None
        
        while self.running:
            try:
                app_name, window_title = self.get_active_window()
                window_str = f"{app_name}: {window_title}"
                
                if window_str != last_window:
                    last_window = window_str
                    self.current_window = (app_name, window_title)
                    
                    if not self.is_excluded(window_title, app_name):
                        entry = f"[{self.timestamp()}] {window_str}\n"
                        self.log_to_file("windows.log", entry)
                        print(f"  Window: {window_str[:60]}...")
                    else:
                        print(f"  Window: [EXCLUDED] {app_name}")
                        
            except Exception as e:
                print(f"  Window error: {e}")
            time.sleep(self.window_poll)
    
    # === CLIPBOARD LOGGER ===
    def clipboard_logger(self):
        """Track clipboard changes"""
        if not self.log_clipboard:
            return
            
        print("[CODEX] Clipboard logger started")
        import win32clipboard
        
        last_clip = None
        while self.running:
            try:
                win32clipboard.OpenClipboard()
                try:
                    clip_data = win32clipboard.GetClipboardData(win32clipboard.CF_UNICODETEXT)
                except:
                    clip_data = None
                finally:
                    win32clipboard.CloseClipboard()
                
                if clip_data and clip_data != last_clip:
                    last_clip = clip_data
                    
                    # Check exclusions based on current window
                    if self.current_window:
                        app_name, window_title = self.current_window
                        if self.is_excluded(window_title, app_name):
                            print(f"  Clipboard: [EXCLUDED from {app_name}]")
                            continue
                    
                    # Truncate very long clips in log, keep full version
                    preview = clip_data[:100].replace('\n', '\\n')
                    entry = f"[{self.timestamp()}] ({len(clip_data)} chars) {preview}...\n"
                    self.log_to_file("clipboard.log", entry)
                    
                    # Also save full clipboard content with timestamp
                    full_entry = f"\n=== [{self.timestamp()}] ===\n{clip_data}\n"
                    self.log_to_file("clipboard_full.log", full_entry)
                    
                    print(f"  Clipboard: {preview[:50]}...")
                    
            except Exception as e:
                pass  # Clipboard often locked, just skip
            
            time.sleep(0.5)
    
    # === KEYLOGGER ===
    def on_key_press(self, key):
        """Handle key press events"""
        # Check exclusions
        if self.current_window:
            app_name, window_title = self.current_window
            if self.is_excluded(window_title, app_name):
                return  # Don't log keystrokes in excluded contexts
        
        try:
            # Regular character
            char = key.char
            self.keystroke_buffer.append(char)
        except AttributeError:
            # Special key
            key_name = str(key).replace("Key.", "")
            if key_name == "space":
                self.keystroke_buffer.append(" ")
            elif key_name == "enter":
                self.keystroke_buffer.append("\n")
            elif key_name == "tab":
                self.keystroke_buffer.append("\t")
            elif key_name == "backspace":
                self.keystroke_buffer.append("[BS]")
            else:
                self.keystroke_buffer.append(f"[{key_name}]")
    
    def keystroke_flusher(self):
        """Periodically flush keystrokes to disk"""
        if not self.log_keystrokes:
            return
            
        print("[CODEX] Keystroke flusher started")
        while self.running:
            time.sleep(self.flush_interval)
            if self.keystroke_buffer:
                content = "".join(self.keystroke_buffer)
                
                # Get window context
                if self.current_window:
                    app_name, window_title = self.current_window
                    window_context = f"{app_name}: {window_title[:50]}"
                else:
                    window_context = "Unknown"
                
                entry = f"[{self.timestamp()}] <{window_context}>\n{content}\n\n"
                self.log_to_file("keystrokes.log", entry)
                self.keystroke_buffer = []
                print(f"  Flushed {len(content)} keystrokes")
    
    def keylogger(self):
        """Start the keylogger"""
        if not self.log_keystrokes:
            # Just keep the thread alive
            while self.running:
                time.sleep(1)
            return
            
        print("[CODEX] Keylogger started")
        from pynput import keyboard
        
        with keyboard.Listener(on_press=self.on_key_press) as listener:
            listener.join()
    
    # === MAIN CONTROL ===
    def start(self):
        """Start all capture threads"""
        features = []
        if self.log_keystrokes: features.append("Keystrokes")
        if self.log_clipboard: features.append("Clipboard")
        if self.log_windows: features.append("Windows")
        
        print(f"""
╔═══════════════════════════════════════════════════════════════╗
║         CODEX CAPTURE - The Gremlin Conductor's Triangle      ║
╠═══════════════════════════════════════════════════════════════╣
║  Logging to: {str(self.log_dir)[:47]:<47} ║
║  Features:   {', '.join(features):<47} ║
║  Exclusions: {len(self.exclusions.get('app_names', [])) + len(self.exclusions.get('window_title_contains', []))} rules configured{' ' * 32}║
╠═══════════════════════════════════════════════════════════════╣
║  Output files:                                                ║
║    • keystrokes.log      - What you typed                     ║
║    • clipboard.log       - What you copied (preview)          ║
║    • clipboard_full.log  - Full clipboard contents            ║
║    • windows.log         - App/window switches                ║
╠═══════════════════════════════════════════════════════════════╣
║  Press Ctrl+C to stop                                         ║
╚═══════════════════════════════════════════════════════════════╝
""")
        
        self.running = True
        
        # Start threads
        threads = [
            threading.Thread(target=self.window_logger, daemon=True),
            threading.Thread(target=self.clipboard_logger, daemon=True),
            threading.Thread(target=self.keystroke_flusher, daemon=True),
        ]
        
        for t in threads:
            t.start()
        
        # Keylogger runs in main thread (pynput requirement)
        try:
            self.keylogger()
        except KeyboardInterrupt:
            print("\n[CODEX] Shutting down...")
            self.running = False
            # Final flush
            if self.keystroke_buffer:
                content = "".join(self.keystroke_buffer)
                entry = f"[{self.timestamp()}] <FINAL FLUSH>\n{content}\n"
                self.log_to_file("keystrokes.log", entry)
            print("[CODEX] Capture complete. Your consciousness has been archived.")


# === ENTRY POINT ===

def main():
    config = load_config()
    
    if not config.get("capture_enabled", False):
        print("""
╔═══════════════════════════════════════════════════════════════╗
║                    CODEX CAPTURE - DISABLED                   ║
╠═══════════════════════════════════════════════════════════════╣
║  Capture is disabled in config.json                           ║
║                                                               ║
║  To enable:                                                   ║
║    1. Edit config.json and set "capture_enabled": true        ║
║    OR                                                         ║
║    2. Create config.local.json with: {"capture_enabled": true}║
║                                                               ║
║  This is disabled by default for the public distribution.     ║
║  Enable it only on your personal deployment.                  ║
╚═══════════════════════════════════════════════════════════════╝
""")
        sys.exit(0)
    
    capture = CODEXCapture(config)
    capture.start()


if __name__ == "__main__":
    main()
