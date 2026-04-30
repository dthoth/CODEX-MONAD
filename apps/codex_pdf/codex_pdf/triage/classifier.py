"""
Triage classifier.

This is the first stage of the pipeline. It opens a PDF and produces a
TriageResult that tells the router what kind of document we're looking at,
what scripts are present, whether it's born-digital or scanned, and which
route should handle it.

This v0.1 stub uses pdfplumber to inspect the document and applies simple
heuristics. Real classification (genre detection from text patterns,
script detection from glyph analysis, etc.) lands incrementally — the
interface is what matters here.
"""

from __future__ import annotations

import logging
from pathlib import Path

import pdfplumber

from codex_pdf.engine.model import DocumentKind, Script, TriageResult

log = logging.getLogger(__name__)


# Unicode block ranges used for script detection. Coarse but sufficient
# for triage; fine-grained detection happens in the OCR route.
_SCRIPT_RANGES: dict[Script, list[tuple[int, int]]] = {
    Script.HEBREW: [(0x0590, 0x05FF), (0xFB1D, 0xFB4F)],
    Script.GREEK: [(0x0370, 0x03FF), (0x1F00, 0x1FFF)],
    Script.ARABIC: [(0x0600, 0x06FF), (0x0750, 0x077F)],
    Script.CYRILLIC: [(0x0400, 0x04FF)],
    Script.CJK: [(0x4E00, 0x9FFF), (0x3040, 0x30FF)],
    # Aramaic uses Hebrew/Syriac blocks; treated separately by the OCR route
    # based on contextual cues, not Unicode alone.
}


def _detect_scripts(text: str) -> list[Script]:
    """Detect which scripts appear in `text` based on Unicode codepoints."""
    if not text:
        return []
    found: set[Script] = set()
    has_latin = False
    for ch in text:
        cp = ord(ch)
        if 0x0041 <= cp <= 0x024F:  # Latin + extensions
            has_latin = True
            continue
        for script, ranges in _SCRIPT_RANGES.items():
            if any(lo <= cp <= hi for lo, hi in ranges):
                found.add(script)
                break
    if has_latin:
        found.add(Script.LATIN)
    return sorted(found, key=lambda s: s.value)


def _suggest_route(
    kind: DocumentKind, scripts: list[Script], born_digital: bool
) -> tuple[str, str]:
    """
    Return (suggested_route, fallback_route) names based on triage signals.

    This mapping is deliberately conservative in v0.1: we have one real
    route ('born_digital_text') and the rest are stubs to be filled in.
    """
    # Scanned anything → OCR route (when implemented). For now, fallback.
    if not born_digital:
        return ("multilingual_ocr", "born_digital_text")

    # Multi-script documents need OCR-style script segmentation even if
    # born-digital, because the text layer may be unreliable.
    non_latin = [s for s in scripts if s not in (Script.LATIN, Script.UNKNOWN)]
    if non_latin:
        return ("multilingual_ocr", "born_digital_text")

    return ("born_digital_text", "born_digital_text")


def triage(pdf_path: Path) -> TriageResult:
    """
    Open `pdf_path` and produce a TriageResult.

    Never raises on a malformed PDF — instead returns a TriageResult with
    kind=UNKNOWN and a note explaining the issue, so the pipeline can log
    and move on rather than crashing batch jobs.
    """
    pdf_path = Path(pdf_path)
    notes: list[str] = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            page_count = len(pdf.pages)
            sample_text_parts: list[str] = []
            pages_with_text = 0
            for page in pdf.pages[:10]:  # sample first 10 pages for triage
                text = page.extract_text() or ""
                if text.strip():
                    pages_with_text += 1
                    sample_text_parts.append(text)
            sample_text = "\n".join(sample_text_parts)
    except Exception as e:  # pdfplumber wraps many low-level errors
        log.exception("Triage failed to open %s", pdf_path)
        notes.append(f"open_error: {type(e).__name__}: {e}")
        return TriageResult(
            kind=DocumentKind.UNKNOWN,
            scripts_detected=[Script.UNKNOWN],
            born_digital=False,
            has_text_layer=False,
            page_count=0,
            confidence=0.0,
            suggested_route="born_digital_text",
            fallback_route="born_digital_text",
            notes=notes,
        )

    scripts = _detect_scripts(sample_text) or [Script.UNKNOWN]
    has_text_layer = pages_with_text > 0
    # Heuristic: if >=50% of sampled pages have any text, assume born-digital.
    # Refined later by font analysis and image-coverage ratio.
    sampled = min(page_count, 10) or 1
    born_digital = (pages_with_text / sampled) >= 0.5

    # v0.1 genre classification is deliberately humble. We mark UNKNOWN
    # unless we have a strong signal. Real genre classifiers land in v0.2.
    kind = DocumentKind.UNKNOWN
    confidence = 0.3 if has_text_layer else 0.1

    if not has_text_layer:
        notes.append("no_text_layer: likely scanned, OCR required")
    if Script.HEBREW in scripts or Script.GREEK in scripts:
        notes.append("non_latin_scripts_present: route to multilingual handler")

    suggested, fallback = _suggest_route(kind, scripts, born_digital)

    return TriageResult(
        kind=kind,
        scripts_detected=scripts,
        born_digital=born_digital,
        has_text_layer=has_text_layer,
        page_count=page_count,
        confidence=confidence,
        suggested_route=suggested,
        fallback_route=fallback,
        notes=notes,
    )
