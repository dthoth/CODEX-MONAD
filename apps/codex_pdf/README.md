# codex-pdf

A Daniel-corpus PDF system. Not a general-purpose PDF tool — a system that
classifies, extracts, and routes PDFs the way Daniel's archive actually
needs them handled.

## Why this exists

Off-the-shelf PDF tools optimize for the median PDF: born-digital, English,
modern. The Daniel corpus is the opposite — multilingual scans, philological
work where footnotes are load-bearing, sermons with their own structural
grammar, esoterica in mixed scripts, decades of archive scraps. General
tools either miss the buried features or hide them three menus deep.

codex-pdf flips that. The buried features are first-class citizens. The
intelligence layer (genre classification, multilingual OCR routing,
authorship rules, footnote-anchor graphs) is the value. The PDF mechanics
underneath are off-the-shelf libraries we wrap, not reinvent.

## Architecture

Three layers sharing one core engine:

```
                ┌─────────────────────────┐
                │       Workbench         │   Electron-based interactive
                │  (browser-integrated)   │   surface, reuses existing
                └───────────┬─────────────┘   homegrown browser chrome.
                            │
                ┌───────────┴─────────────┐
                │        Pipeline         │   Headless batch runner.
                │   (Docker on NAS)       │   Walks archive, ingests,
                └───────────┬─────────────┘   emits to Paperless / RAG / Asana.
                            │
                ┌───────────┴─────────────┐
                │         Engine          │   Importable Python core.
                │  ┌───────────────────┐  │   Triage → Route → Emit.
                │  │     Triage        │  │
                │  ├───────────────────┤  │
                │  │     Routes        │  │   Discovered by convention:
                │  │  - born_digital_  │  │   any module in codex_pdf.routes
                │  │    text           │  │   exposing a Route class is
                │  │  - multilingual_  │  │   registered automatically.
                │  │    ocr (v0.2)     │  │
                │  ├───────────────────┤  │
                │  │     Emit          │  │   Paperless / RAG / Asana
                │  └───────────────────┘  │   destinations.
                └─────────────────────────┘
```

### Pipeline stages

1. **Triage** (`codex_pdf.triage`) — opens a PDF, detects scripts, decides
   born-digital vs. scanned, classifies genre, picks a route. Always
   returns a structured `TriageResult`; never raises on malformed PDFs.
2. **Route** (`codex_pdf.routes`) — extracts content. Each route is a
   self-contained module satisfying the `Route` protocol. The router
   discovers routes by convention.
3. **Emit** (`codex_pdf.emit`) — fans out the `ExtractedDocument` to
   Paperless / RAG corpus / Asana. (v0.2)

## v0.2 status

- ✅ Core data model (`engine/model.py`)
- ✅ Route protocol (`engine/route.py`)
- ✅ Router with auto-discovery (`engine/router.py`)
- ✅ Triage classifier — basic heuristics, structured output
- ✅ Born-digital text route (pdfplumber)
- ✅ **Multilingual OCR route** — Hebrew/Greek/Aramaic via Tesseract
- ✅ Smoke test + multilingual OCR tests
- ⏳ Footnote-anchor extraction
- ⏳ Genre-aware outline extraction
- ⏳ Emit modules (Paperless, RAG, Asana)
- ⏳ Workbench

### System dependencies (v0.2)

The multilingual OCR route requires:

1. **Tesseract OCR** — Install from
   [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki)
   or via `winget install UB-Mannheim.TesseractOCR`

2. **Tesseract language data** — Download and place in tessdata directory:
   - `eng.traineddata` (English)
   - `heb.traineddata` (Hebrew)
   - `grc.traineddata` (Ancient Greek)
   - `ara.traineddata` (Arabic, used as Aramaic stand-in)

   Source: https://github.com/tesseract-ocr/tessdata

3. **Poppler** — Install from
   [oschwartz10612/poppler-windows](https://github.com/oschwartz10612/poppler-windows)
   or via `winget install oschwartz10612.Poppler`

## Getting started

### Dev (Ryzen)

```powershell
codex          # cd into repo
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev,ocr]"  # Include OCR dependencies
pytest tests/
```

For OCR functionality, ensure Tesseract and Poppler are installed (see
System dependencies above).

### Production (NAS)

Containerized. Docker compose definition lands in v0.1.1 once Paperless
emit is wired.

## Authorship rules

Documents extracted from Daniel's own archive are tagged per CODEX-MONAD
policy: creative/scholarly work as `Rev. LL Dan-i-El Thomas`, consulting
deliverables as `Simbell Trust Consulting`. The classifier suggests
attribution; the workbench lets you confirm/correct.

## Adding a new route

1. Create a module in `codex_pdf/routes/your_route.py`.
2. Define a `Route` class with `name`, `version`, `can_handle(triage)`,
   and `extract(pdf_path, triage)`.
3. That's it. The router picks it up automatically.

Don't touch the router. Don't add to a registry. Don't refactor the
orchestrator. The whole point is that adding capability is additive.
