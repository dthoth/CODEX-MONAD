"""
Multilingual OCR route.

Handles PDFs containing non-Latin scripts (Hebrew, Greek, Aramaic) and/or
scanned PDFs without a reliable text layer. Uses Tesseract OCR with
script-region segmentation.

System dependencies:
    - Tesseract OCR (https://github.com/UB-Mannheim/tesseract/wiki)
    - Poppler (https://github.com/oschwartz10612/poppler-windows)

Required language data files in tessdata directory:
    - eng.traineddata (English)
    - heb.traineddata (Hebrew)
    - grc.traineddata (Ancient Greek)
    - ara.traineddata (Arabic, used as Aramaic stand-in)

To install language data:
    Download from https://github.com/tesseract-ocr/tessdata and place in
    the tessdata directory (typically C:/Program Files/Tesseract-OCR/tessdata
    or configure via TESSDATA_PREFIX environment variable).
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from codex_pdf.engine.model import (
    BBox,
    DocumentMetadata,
    ExtractedDocument,
    Region,
    Script,
    TriageResult,
)
from codex_pdf.engine.route import ExtractionError

# Configure tessdata path if using non-standard location
_TESSDATA_DIR = os.environ.get(
    "TESSDATA_PREFIX",
    os.path.expanduser("~/tessdata")
)

# Common Poppler installation paths (winget installs to AppData)
_POPPLER_PATHS = [
    os.path.expanduser(
        "~/AppData/Local/Microsoft/WinGet/Packages/"
        "oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe/"
        "poppler-25.07.0/Library/bin"
    ),
    r"C:\Program Files\poppler\bin",
    r"C:\tools\poppler\bin",
]

# Map Script enum to Tesseract language codes
_SCRIPT_TO_LANG: dict[Script, str] = {
    Script.LATIN: "eng",
    Script.HEBREW: "heb",
    Script.GREEK: "grc",
    Script.ARAMAIC: "ara",  # Arabic as stand-in until proper Aramaic data
    Script.ARABIC: "ara",
}

# Scripts we actively OCR (in priority order for detection)
_OCR_SCRIPTS = [Script.HEBREW, Script.GREEK, Script.ARAMAIC, Script.LATIN]


@dataclass
class OCRResult:
    """Result from a single OCR pass."""
    text: str
    confidence: float
    script: Script
    lang: str


class Route:
    """Multilingual OCR extraction via Tesseract."""

    name = "multilingual_ocr"
    version = "0.2.0"

    def can_handle(self, triage: TriageResult) -> float:
        # Scanned PDFs are our primary domain
        if not triage.born_digital:
            return 0.95

        # Born-digital but has non-Latin scripts — we can handle better than
        # born_digital_text because we do script-aware OCR
        non_latin = [
            s for s in triage.scripts_detected
            if s not in (Script.LATIN, Script.UNKNOWN)
        ]
        if non_latin:
            return 0.85

        # Pure Latin born-digital — let born_digital_text win
        return 0.0

    def extract(self, pdf_path: Path, triage: TriageResult) -> ExtractedDocument:
        """
        Extract text using OCR with script-region segmentation.

        For each page:
        1. Render to image via pdf2image
        2. Run OCR with each candidate language model
        3. Pick best results by confidence
        4. Emit regions per detected script
        """
        # Lazy imports to avoid loading heavy deps until needed
        try:
            import pytesseract
            from pdf2image import convert_from_path
            from PIL import Image
        except ImportError as e:
            raise ExtractionError(
                f"Missing OCR dependency: {e}. Install with: pip install codex-pdf[ocr]",
                route_name=self.name,
            )

        pdf_path = Path(pdf_path)
        regions: list[Region] = []

        # Configure pytesseract
        tesseract_cmd = self._find_tesseract()
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

        # Find Poppler path for pdf2image
        poppler_path = self._find_poppler()

        # Determine which scripts to try based on triage
        scripts_to_try = self._select_scripts(triage)

        try:
            # Convert PDF pages to images
            convert_kwargs = {
                "dpi": 300,  # Good balance of quality vs. speed
                "fmt": "PNG",
            }
            if poppler_path:
                convert_kwargs["poppler_path"] = poppler_path

            images = convert_from_path(pdf_path, **convert_kwargs)
        except Exception as e:
            raise ExtractionError(
                f"pdf2image failed: {type(e).__name__}: {e}",
                route_name=self.name,
            )

        for page_num, image in enumerate(images, start=1):
            page_regions = self._process_page(
                image, page_num, scripts_to_try, pytesseract
            )
            regions.extend(page_regions)

        full_text = "\n\n".join(r.text for r in regions if r.text.strip())

        return ExtractedDocument(
            source_path=pdf_path,
            triage=triage,
            regions=regions,
            footnotes=[],
            anchors=[],
            outline=[],
            metadata=DocumentMetadata(
                title=pdf_path.stem,
                genre=triage.kind,
                languages=self._detected_languages(regions),
            ),
            full_text=full_text,
            extracted_by=f"{self.name}@{self.version}",
        )

    def _find_tesseract(self) -> Optional[str]:
        """Find tesseract executable on Windows."""
        candidates = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        ]
        for path in candidates:
            if os.path.isfile(path):
                return path
        return None  # Let pytesseract find it in PATH

    def _find_poppler(self) -> Optional[str]:
        """Find Poppler bin directory for pdf2image."""
        for path in _POPPLER_PATHS:
            pdftoppm = os.path.join(path, "pdftoppm.exe")
            if os.path.isfile(pdftoppm):
                return path
        return None  # Let pdf2image find it in PATH

    def _select_scripts(self, triage: TriageResult) -> list[Script]:
        """Select which scripts to try OCR for based on triage."""
        # Always try the scripts detected in triage
        scripts = set(triage.scripts_detected)

        # For scanned docs, also try common scripts even if not detected
        # (detection from text layer may be incomplete)
        if not triage.born_digital:
            scripts.update([Script.LATIN, Script.HEBREW, Script.GREEK])

        # Filter to scripts we have OCR support for
        return [s for s in _OCR_SCRIPTS if s in scripts]

    def _process_page(
        self,
        image,
        page_num: int,
        scripts: list[Script],
        pytesseract,
    ) -> list[Region]:
        """
        Process a single page image with multi-script OCR.

        Current implementation: coarse full-page OCR with each language,
        then pick the best result. Refinement with actual region
        segmentation can come in a future version.
        """
        width, height = image.size
        full_bbox = BBox(x0=0.0, y0=0.0, x1=float(width), y1=float(height))

        results: list[OCRResult] = []

        for script in scripts:
            lang = _SCRIPT_TO_LANG.get(script)
            if not lang:
                continue

            result = self._ocr_with_lang(image, lang, script, pytesseract)
            if result and result.text.strip():
                results.append(result)

        if not results:
            # No text detected at all
            return []

        # Group results by script, keeping best confidence for each
        best_by_script: dict[Script, OCRResult] = {}
        for r in results:
            existing = best_by_script.get(r.script)
            if existing is None or r.confidence > existing.confidence:
                best_by_script[r.script] = r

        # Build regions
        regions: list[Region] = []
        for script, result in best_by_script.items():
            # Filter out results with very low confidence or mostly empty
            if result.confidence < 0.3 or len(result.text.strip()) < 10:
                continue

            regions.append(
                Region(
                    page=page_num,
                    bbox=full_bbox,
                    script=script,
                    text=result.text,
                    confidence=result.confidence,
                    language=result.lang,
                )
            )

        # If we have multiple scripts, check for duplicated content
        # (same text detected by multiple language models)
        if len(regions) > 1:
            regions = self._deduplicate_regions(regions)

        return regions

    def _ocr_with_lang(
        self,
        image,
        lang: str,
        script: Script,
        pytesseract,
    ) -> Optional[OCRResult]:
        """Run Tesseract OCR with a specific language model."""
        try:
            # Get detailed data including confidence
            config = f"--tessdata-dir {_TESSDATA_DIR}" if os.path.isdir(_TESSDATA_DIR) else ""
            data = pytesseract.image_to_data(
                image,
                lang=lang,
                config=config,
                output_type=pytesseract.Output.DICT,
            )

            # Extract text and compute average confidence
            texts = []
            confidences = []
            for i, conf in enumerate(data["conf"]):
                # Tesseract returns -1 for non-text elements
                if conf > 0:
                    text = data["text"][i]
                    if text.strip():
                        texts.append(text)
                        confidences.append(conf)

            if not texts:
                return None

            full_text = " ".join(texts)
            avg_confidence = sum(confidences) / len(confidences) / 100.0  # Normalize to 0-1

            return OCRResult(
                text=full_text,
                confidence=avg_confidence,
                script=script,
                lang=lang,
            )

        except Exception:
            # OCR failed for this language — not fatal
            return None

    def _deduplicate_regions(self, regions: list[Region]) -> list[Region]:
        """
        Remove duplicate regions that contain essentially the same text.

        This happens when the same text is detected by multiple language
        models (e.g., English text detected by both eng and heb).
        """
        if len(regions) <= 1:
            return regions

        # Sort by confidence descending
        sorted_regions = sorted(regions, key=lambda r: r.confidence, reverse=True)

        kept: list[Region] = []
        for region in sorted_regions:
            # Check if this region's text is substantially similar to any kept region
            is_duplicate = False
            for kept_region in kept:
                similarity = self._text_similarity(region.text, kept_region.text)
                if similarity > 0.8:  # 80% similar = duplicate
                    is_duplicate = True
                    break

            if not is_duplicate:
                kept.append(region)

        return kept

    def _text_similarity(self, text1: str, text2: str) -> float:
        """Compute simple text similarity ratio."""
        # Normalize texts
        t1 = set(text1.lower().split())
        t2 = set(text2.lower().split())

        if not t1 or not t2:
            return 0.0

        intersection = len(t1 & t2)
        union = len(t1 | t2)

        return intersection / union if union > 0 else 0.0

    def _detected_languages(self, regions: list[Region]) -> list[str]:
        """Extract unique language codes from regions."""
        langs = set()
        for r in regions:
            if r.language:
                langs.add(r.language)
        return sorted(langs)
