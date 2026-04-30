# HANDOFF — codex-pdf v0.1.0 → v0.2.0

This document is your starting point. Read it fully before touching code.

## Context

You are continuing work on **codex-pdf**, a Daniel-corpus PDF system. Not a
general-purpose PDF tool — a system designed specifically for the document
genres in Daniel's archive (sermons, philological work, multilingual
esoterica, dissertations, legal/LOI-style documents, archive scraps).

The architecture, naming, and v0.1.0 scaffold were designed in collaboration
with Claude (chat). Your job is to extend it without violating the existing
design. **When in doubt, preserve invariants and ask rather than refactor.**

## Current state — v0.1.0

The repo you are working in already contains a tested, working scaffold:

```
codex-pdf/
├── README.md
├── pyproject.toml
├── codex_pdf/
│   ├── __init__.py            # public API surface
│   ├── engine/
│   │   ├── model.py           # core dataclasses (TriageResult, ExtractedDocument, etc.)
│   │   ├── route.py           # Route protocol + ExtractionError
│   │   └── router.py          # auto-discovery dispatcher
│   ├── triage/
│   │   └── classifier.py      # triage() function — opens PDF, returns TriageResult
│   ├── routes/
│   │   └── born_digital_text.py   # first real route (pdfplumber)
│   └── emit/                  # placeholder — emit modules land later
└── tests/
    └── test_smoke.py          # end-to-end smoke test, currently passing
```

Verify state before changing anything:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
pytest tests/ -v
```

Should print `1 passed`. If it doesn't, **stop and report** — do not proceed.

## Architectural invariants (do not violate)

These are non-negotiable design decisions. Changing them silently will break
the design intent. If you have a strong reason to change one, surface it
explicitly and wait for confirmation.

1. **Routes are discovered by convention, not registered.** The router
   walks `codex_pdf.routes` and registers any module exposing a `Route`
   class. Do **not** add a central registry, manifest, or import list.
   Adding a new route is exactly: drop a new file in `codex_pdf/routes/`.

2. **`TriageResult` and `ExtractedDocument` are stable contracts.** Every
   downstream layer branches on these. Adding fields is allowed only with
   sensible defaults (so existing code doesn't break). Removing or
   renaming fields requires explicit approval. Do not change enum values
   (`DocumentKind`, `Script`, `Authorship`) — only add to them.

3. **Triage never raises on a malformed PDF.** It returns a `TriageResult`
   with `kind=UNKNOWN`, `confidence=0.0`, and a note explaining the issue.
   This is critical for batch operation across the 408GB archive.

4. **Routes raise `ExtractionError` on unrecoverable failure.** The router
   handles fallback. Routes do not catch and swallow — they raise and let
   the router decide.

5. **The `Route` protocol is `name: str`, `version: str`,
   `can_handle(triage) -> float`, `extract(pdf_path, triage) -> ExtractedDocument`.**
   Do not change this signature. New capabilities go inside `extract`, not
   on the protocol surface.

6. **The off-the-shelf libraries underneath stay generic. The intelligence
   layer on top is custom.** Do not write a PDF parser. Do not reimplement
   OCR. Wrap pdfplumber, pypdf, Tesseract, etc. The value is the routing,
   classification, and Daniel-specific metadata — not the PDF mechanics.

7. **Authorship attribution rule:** creative/scholarly work is by
   "Rev. LL Dan-i-El Thomas". Simbell Trust Consulting attribution is
   **only** for actual consulting deliverables. The `Authorship` enum
   encodes this. Do not collapse, rename, or default to Simbell.

## Your task — v0.2.0: multilingual OCR route

Implement a new route, `multilingual_ocr`, that handles PDFs containing
non-Latin scripts (Hebrew, Greek, Aramaic) and/or scanned PDFs without a
reliable text layer. This is the highest-value unlock for Daniel's corpus
because his philological and esoterica materials are precisely what
generic PDF tools mangle.

### Acceptance criteria

The route is complete when **all** of these are true:

1. New file `codex_pdf/routes/multilingual_ocr.py` exists with a `Route`
   class satisfying the protocol. Auto-discovery picks it up — verify by
   checking `Router().registered` includes `"multilingual_ocr"`.

2. `can_handle(triage)` returns:
   - `0.95` when `not triage.born_digital` (scanned PDFs are this route's
     primary domain)
   - `0.85` when `born_digital` but non-Latin scripts are present
   - `0.0` when the document is purely Latin and born-digital (let the
     existing `born_digital_text` route win)

3. `extract` performs script-region segmentation. For each page:
   - Render the page to an image (use `pdf2image` + Poppler, or pypdf's
     image extraction — your choice, but document the dependency)
   - Detect script regions (initial implementation can be coarse: try
     full-page OCR with each language model, score by confidence, pick
     winners; refinement can come later)
   - Run Tesseract per region with the appropriate language model
   - Emit one `Region` per detected script-region with correct `script`,
     `text`, `confidence`, and `bbox`

4. Tesseract language data installed and used: `eng`, `heb`, `grc`
   (ancient Greek), and `ara` as a stand-in for Aramaic until proper
   Aramaic data is sourced. Document the install command in the route
   module's docstring.

5. A new test fixture `tests/fixtures/multilingual_sample.pdf` containing
   English + Hebrew + Greek text. Generate it programmatically in a
   helper (see `tests/test_smoke.py` for the pattern with reportlab —
   reportlab supports Unicode if you embed the right TTF). Commit the
   PDF; it should be small (<100KB).

6. New test `tests/test_multilingual_ocr.py` that:
   - Loads the fixture
   - Runs triage and asserts `scripts_detected` includes Hebrew and Greek
   - Dispatches via Router and asserts the route used was
     `multilingual_ocr`
   - Asserts the extracted document has at least one region per detected
     script
   - Asserts no English text bleeds into a Hebrew/Greek region's `text`
     field beyond a reasonable threshold (e.g., <10% Latin chars in a
     region tagged Hebrew)

7. Existing `tests/test_smoke.py` still passes unchanged. The
   `born_digital_text` route still wins for pure-Latin born-digital docs.

8. `pyproject.toml` updated: move OCR dependencies out of the commented
   `[project.optional-dependencies].ocr` block into a real extras group.
   Pin sensible minimum versions.

9. `README.md` v0.2 status section updated: tick `multilingual_ocr` as
   complete, note Tesseract system dependencies.

### Things that are explicitly **out of scope** for v0.2

Do not do these — they belong to later versions:

- Genre classification (the triage `kind` field stays `UNKNOWN` for now)
- Footnote/anchor extraction
- Genre-aware outline extraction
- Any emit module (Paperless, RAG, Asana)
- Workbench / UI work
- Pipeline CLI

Stay focused. Multilingual OCR is meaningful work on its own and the rest
depends on getting it right.

## Practical notes

**Working directory:** `C:\Users\dthot\GitHub\CODEX-MONAD\apps\codex_pdf\`
on Ryzen (`RYZENDTCX1`, user `dthot`). The project lives in the CODEX-MONAD
monorepo as a subdirectory (same pattern as `codex_capture`).

**NAS access — full read/write granted.** You have SSH into the NAS
(DXP8800 Plus, `192.168.10.211` — Kea reservation pending, creds
`dthathadmin/silencE123*`). NAS path: `/home/dthathadmin/CODEX-MONAD/apps/codex_pdf/`.

- **Read freely.** The archive at `X:\10-databases` (DevonThink_Research,
  obsidian-vaults, chatgpt-archives, x-twitter-archive) contains real
  multilingual material — far better validation signal than synthetic
  fixtures. Use it for testing.
- **Write thoughtfully.** Stage your own working directory under
  `/home/dthathadmin/codex-pdf-dev/` or similar — don't scatter test
  output across the existing pool structure.
- **Production deploy is optional, not required.** v0.2 acceptance is the
  code working on Ryzen. Deploying the route into the NAS Docker stack is
  a stretch goal — try it if there's time, defer to v0.2.1 if not. Do not
  block v0.2 completion on it.
- **Hands off Lothora.** OPNsense at `192.168.10.1` is live inline and
  Daniel is mid-configuration on Tailscale and Nighthawk bridge mode. Do
  not touch firewall, DHCP, or routing config. If you think network
  changes are needed, surface and wait.
- **Known-touchy services:** Vaultwarden (don't poke), Paperless's
  consume directory (don't pre-stage output there during v0.2 — that
  belongs to the emit module work), and the running LLM containers on
  ports 11434 / 3000.
- **Asana workspace:** `874742316025278`, NAS project
  `1213806878225878`. If you make notable decisions during the session,
  log them as comments on the main logging task `1213806816371646` — same
  pattern as the April 11 handoff comment.

**Tesseract:** install via Windows installer
(https://github.com/UB-Mannheim/tesseract/wiki) and ensure `tesseract.exe`
is on PATH. Language data files (`heb.traineddata`, `grc.traineddata`,
`ara.traineddata`) go in the Tesseract `tessdata` directory. Source from
https://github.com/tesseract-ocr/tessdata or `tessdata_best`.

**Poppler (for pdf2image):** install via the conda-forge build or the
Windows binaries from https://github.com/oschwartz10612/poppler-windows.
Ensure `pdftoppm.exe` is on PATH.

**Gitea:** Daniel will provide credentials when you ask. The repo will
live under his Gitea instance once v0.2 is ready to push. For this
session, work locally and present the diff for him to review before
pushing.

**Ryzen GPU:** available for OCR experimentation if useful, but production
runs on the NAS without GPU, so do not introduce a hard dependency on
CUDA. CPU-only Tesseract is the production target.

**On asking questions:** if any acceptance criterion seems wrong or
underspecified, surface it before implementing. Better to clarify upfront
than rebuild. But avoid re-litigating settled architecture.

## When you're done

1. All tests pass: `pytest tests/ -v` shows ≥2 tests passing.
2. Manual sanity check: run the v0.1 sanity script (in chat history) and
   confirm `multilingual_ocr` now appears in `Router().registered`.
3. Show Daniel a unified diff of changes and a brief summary of decisions
   made (especially anywhere you exercised judgment within the
   acceptance criteria — e.g., your specific approach to script-region
   segmentation).
4. Wait for his review before pushing to Gitea.

Good luck. The architecture is sound; you have room to do good work
inside it.
