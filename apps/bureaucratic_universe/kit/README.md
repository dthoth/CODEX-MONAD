# Bureaucratic Universe — Local Site Kit

## Quick Start (3 steps)
1) Drop ALL your items into `content/` (keep subfolders if you want).
2) Run: `python3 build_site.py`
3) Open `index.html` in your browser.

## What it does
- Scans `content/` and classifies files by code prefix: N-* (forms), L-* (legal), other.
- Generates a clean `index.html` with search, filters, and counts.
- Keeps your originals untouched.
