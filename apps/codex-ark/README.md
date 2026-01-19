# CODEX-ARK

**Visual-First Archive Format with Cryptographic Tamper Detection**

*The DNA stripe is not decoration. It's the interface.*

---

## What Is This?

CODEX-ARK is a file witnessing and archival system:

- **Tamper Seals** — Lightweight cryptographic witnesses of directory state
- **Full Archives** — Portable content bundles for backup/transport  
- **Visual Fingerprints** — DNA-stripe signatures you recognize by sight
- **Verification** — Compare anything against anything, see what changed

## Core Principle

```
Same content → Same hash → Same color → Same stripe
```

Change one byte, the signature changes. Your eyes become the diff tool.

---

## Tools

### `codex-ark-witness.html` ← **THE MAIN TOOL**
Three modes:

| Mode | Purpose | Output |
|------|---------|--------|
| **Seal** | Lightweight tamper detection | `.witness` (tiny) + PNG |
| **Archive** | Full content backup | `.ark` (full) + PNG |
| **Verify** | Compare states | VERIFIED ✓ or TAMPERED ✗ |

### `ark-decoder-minimal.html`
Emergency decoder. Under 4KB. Paste `.ark`, get files.

### `ark-decode.sh`
Shell decoder. No dependencies.
```bash
./ark-decode.sh archive.ark --list      # List entries
./ark-decode.sh archive.ark --extract   # Extract all
./ark-decode.sh archive.ark --get PATH  # Single file
```

---

## Workflow

```
Weekly:  Seal folder → .witness + PNG (tiny checkpoint)
Monthly: Archive folder → .ark (full backup to hub)
Anytime: Verify current state against either
```

**Key guarantee:** Seal and Archive of same folder = **identical hash + signature**

---

## File Formats

### `.witness` (JSON, tiny)
```json
{
  "archiveHash": "9f8e7d6c...",
  "entries": [
    { "path": "file.md", "hash": "7a2b3c...", "color": "hsl(...)" }
  ]
}
```

### `.ark` (Text, full content)
```
═══ ENTRY ════════════════════════════
path: file.md
hash: sha256:7a2b3c...
[CONTENT BEGINS]
...actual content...
[CONTENT ENDS]
══════════════════════════════════════
```

Human-readable. Grep-able. Shell-extractable.

---

## Categories

Files auto-categorize by path, affecting color zone:

| Category | Colors | Patterns |
|----------|--------|----------|
| consciousness | Reds/oranges | `/conscious/`, `/aware/` |
| practice | Blues/teals | `/practice/`, `/breath/` |
| sacred | Golds | `/hebrew/`, `/aramaic/` |
| sigil | Purples | `/sigil/`, `/symbol/` |
| code | Greens | `.js`, `.py`, `.html` |
| data | Yellows | `.csv`, `.json` |
| document | Grays | `.md`, `.txt` |
| media | Pinks | `.png`, `.mp3` |

---

## Philosophy

**From TempleOS:** Constraint as sacred. Human-readable over efficient.

**The witness:** Not competing with ZIP. Answers one question: *"Has my shit been touched?"* — with math AND visuals.

**Visual-first:** After enough use, you recognize archives by sight. "The one with the purple cluster" is a valid address.

---

## What This Is NOT

- Not compressed
- Not encrypted  
- Not error-correcting
- Not a database

It's a **tamper seal** and **portable knowledge container**.

---

v0.1 — January 2026  
Built in the CODEX-FORGE
