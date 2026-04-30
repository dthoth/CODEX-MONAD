"""
Born-digital text route.

Handles PDFs that have a reliable text layer in primarily Latin script.
Uses pdfplumber for extraction. This is the workhorse for modern
business documents, sermons authored in Word, dissertations exported
from LaTeX, and similar.

For multi-script documents or scanned PDFs, the multilingual OCR route
takes over (and that route is the next major piece of work).
"""

from __future__ import annotations

from pathlib import Path

import pdfplumber

from codex_pdf.engine.model import (
    BBox,
    DocumentMetadata,
    ExtractedDocument,
    Region,
    Script,
    TriageResult,
)
from codex_pdf.engine.route import ExtractionError


class Route:
    """Born-digital text extraction via pdfplumber."""

    name = "born_digital_text"
    version = "0.1.0"

    def can_handle(self, triage: TriageResult) -> float:
        if not triage.has_text_layer:
            return 0.0
        if not triage.born_digital:
            return 0.1  # we *can* try, but OCR route is preferred
        # Pure Latin → great fit. Any non-Latin → lower score so OCR route wins.
        non_latin = [
            s for s in triage.scripts_detected if s not in (Script.LATIN, Script.UNKNOWN)
        ]
        if non_latin:
            return 0.3
        return 0.9

    def extract(self, pdf_path: Path, triage: TriageResult) -> ExtractedDocument:
        pdf_path = Path(pdf_path)
        regions: list[Region] = []

        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages, start=1):
                    text = page.extract_text() or ""
                    if not text.strip():
                        continue
                    bbox = BBox(
                        x0=0.0,
                        y0=0.0,
                        x1=float(page.width),
                        y1=float(page.height),
                    )
                    regions.append(
                        Region(
                            page=page_num,
                            bbox=bbox,
                            script=Script.LATIN,
                            text=text,
                            confidence=0.95,
                            language="en",
                        )
                    )
        except Exception as e:
            raise ExtractionError(
                f"pdfplumber failed: {type(e).__name__}: {e}",
                route_name=self.name,
            )

        full_text = "\n\n".join(r.text for r in regions)

        return ExtractedDocument(
            source_path=pdf_path,
            triage=triage,
            regions=regions,
            footnotes=[],  # footnote extraction lands in v0.2
            anchors=[],
            outline=[],  # genre-aware outline lands in v0.2
            metadata=DocumentMetadata(
                title=pdf_path.stem,
                genre=triage.kind,
            ),
            full_text=full_text,
            extracted_by=f"{self.name}@{self.version}",
        )
