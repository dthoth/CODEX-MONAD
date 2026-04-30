"""
Tests for the multilingual OCR route.

Tests verify that:
1. Triage detects non-Latin scripts (Hebrew, Greek)
2. Router dispatches to multilingual_ocr for non-Latin content
3. OCR extracts text with correct script attribution
4. No cross-contamination between script regions
"""

from __future__ import annotations

import os
from pathlib import Path

import pytest
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from codex_pdf import DocumentKind, Router, Script, triage
from codex_pdf.engine.model import Region

# Test content - meaningful phrases in each language
ENGLISH_TEXT = "In the beginning was the Word"
HEBREW_TEXT = "בראשית ברא אלהים"  # "In the beginning God created"
GREEK_TEXT = "Εν αρχη ην ο λογος"  # "In the beginning was the Word"

# Path to fixture
FIXTURE_DIR = Path(__file__).parent / "fixtures"
FIXTURE_PDF = FIXTURE_DIR / "multilingual_sample.pdf"


def _get_unicode_font() -> str | None:
    """Find a font that supports Hebrew and Greek."""
    candidates = [
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/times.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",  # Linux
        "/System/Library/Fonts/Arial Unicode.ttf",  # macOS
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path
    return None


def create_multilingual_pdf_text_layer(pdf_path: Path) -> None:
    """
    Create a born-digital PDF with multilingual text in the text layer.

    Uses a Unicode font to render Hebrew and Greek. If no Unicode font
    is available, uses default font (text layer will still contain
    the Unicode codepoints for triage detection, even if rendering fails).
    """
    c = canvas.Canvas(str(pdf_path), pagesize=letter)

    font_path = _get_unicode_font()
    font_name = "Helvetica"  # Default fallback

    if font_path:
        try:
            pdfmetrics.registerFont(TTFont("UniFont", font_path))
            font_name = "UniFont"
        except Exception:
            pass  # Fall back to Helvetica

    y = 700
    c.setFont(font_name, 14)

    # English section
    c.drawString(72, y, "English Section:")
    y -= 20
    c.drawString(72, y, ENGLISH_TEXT)
    y -= 40

    # Hebrew section
    c.drawString(72, y, "Hebrew Section:")
    y -= 20
    c.drawString(72, y, HEBREW_TEXT)
    y -= 40

    # Greek section
    c.drawString(72, y, "Greek Section:")
    y -= 20
    c.drawString(72, y, GREEK_TEXT)

    c.showPage()
    c.save()


def create_multilingual_pdf_image(pdf_path: Path) -> None:
    """
    Create a scanned-style PDF with multilingual text as an image.

    This is more representative of real multilingual documents that
    need OCR processing.
    """
    from pdf2image import convert_from_path
    from reportlab.lib.utils import ImageReader

    # Create an image with text
    width, height = 612, 792  # Letter size in points
    dpi_scale = 2  # Higher resolution for better OCR
    img_width, img_height = width * dpi_scale, height * dpi_scale

    image = Image.new("RGB", (img_width, img_height), "white")
    draw = ImageDraw.Draw(image)

    # Try to find a font that supports all scripts
    font_path = _get_unicode_font()
    font_size = 24 * dpi_scale

    try:
        if font_path:
            font = ImageFont.truetype(font_path, font_size)
        else:
            font = ImageFont.load_default()
    except Exception:
        font = ImageFont.load_default()

    y = 100 * dpi_scale
    x = 72 * dpi_scale
    line_height = 40 * dpi_scale

    # Draw text sections
    draw.text((x, y), "English Section:", fill="black", font=font)
    y += line_height
    draw.text((x, y), ENGLISH_TEXT, fill="black", font=font)
    y += line_height * 2

    draw.text((x, y), "Hebrew Section:", fill="black", font=font)
    y += line_height
    draw.text((x, y), HEBREW_TEXT, fill="black", font=font)
    y += line_height * 2

    draw.text((x, y), "Greek Section:", fill="black", font=font)
    y += line_height
    draw.text((x, y), GREEK_TEXT, fill="black", font=font)

    # Save as PDF
    image.save(str(pdf_path), "PDF", resolution=150)


def ensure_fixture_exists() -> Path:
    """Ensure the test fixture PDF exists, creating it if necessary."""
    FIXTURE_DIR.mkdir(parents=True, exist_ok=True)

    if not FIXTURE_PDF.exists():
        # Try image-based PDF first (better for OCR testing)
        try:
            create_multilingual_pdf_image(FIXTURE_PDF)
        except ImportError:
            # Fall back to text-layer PDF
            create_multilingual_pdf_text_layer(FIXTURE_PDF)

    return FIXTURE_PDF


# ============================================================================
# Triage Tests
# ============================================================================

class TestTriageScriptDetection:
    """Test that triage correctly detects non-Latin scripts."""

    def test_detects_hebrew_script(self, tmp_path: Path) -> None:
        """Triage should detect Hebrew script in text layer."""
        pdf_path = tmp_path / "hebrew_test.pdf"
        create_multilingual_pdf_text_layer(pdf_path)

        result = triage(pdf_path)

        # Hebrew should be detected from the text layer
        assert Script.HEBREW in result.scripts_detected, (
            f"Expected Hebrew in {result.scripts_detected}"
        )

    def test_detects_greek_script(self, tmp_path: Path) -> None:
        """Triage should detect Greek script in text layer."""
        pdf_path = tmp_path / "greek_test.pdf"
        create_multilingual_pdf_text_layer(pdf_path)

        result = triage(pdf_path)

        # Greek should be detected from the text layer
        assert Script.GREEK in result.scripts_detected, (
            f"Expected Greek in {result.scripts_detected}"
        )

    def test_suggests_multilingual_route(self, tmp_path: Path) -> None:
        """Triage should suggest multilingual_ocr for non-Latin content."""
        pdf_path = tmp_path / "multilingual_test.pdf"
        create_multilingual_pdf_text_layer(pdf_path)

        result = triage(pdf_path)

        assert result.suggested_route == "multilingual_ocr", (
            f"Expected multilingual_ocr, got {result.suggested_route}"
        )


# ============================================================================
# Router Tests
# ============================================================================

class TestRouterDispatch:
    """Test that the router correctly dispatches to multilingual_ocr."""

    def test_multilingual_ocr_registered(self) -> None:
        """The multilingual_ocr route should be auto-discovered."""
        router = Router()
        assert "multilingual_ocr" in router.registered

    def test_dispatches_to_multilingual_for_non_latin(self, tmp_path: Path) -> None:
        """Router should dispatch non-Latin PDFs to multilingual_ocr."""
        pdf_path = tmp_path / "dispatch_test.pdf"
        create_multilingual_pdf_text_layer(pdf_path)

        triage_result = triage(pdf_path)
        router = Router()

        # Check which route would win
        best = router.best_route_for(triage_result)
        assert best == "multilingual_ocr", (
            f"Expected multilingual_ocr, got {best}"
        )

    def test_born_digital_latin_stays_with_text_route(self, tmp_path: Path) -> None:
        """Pure Latin born-digital PDFs should use born_digital_text."""
        from reportlab.pdfgen import canvas as c

        pdf_path = tmp_path / "latin_only.pdf"
        doc = c.Canvas(str(pdf_path), pagesize=letter)
        doc.drawString(72, 720, "This is English only text")
        doc.showPage()
        doc.save()

        triage_result = triage(pdf_path)
        router = Router()

        best = router.best_route_for(triage_result)
        assert best == "born_digital_text", (
            f"Expected born_digital_text for Latin-only, got {best}"
        )


# ============================================================================
# OCR Extraction Tests
# ============================================================================

@pytest.mark.skipif(
    not os.path.isfile("C:/Program Files/Tesseract-OCR/tesseract.exe"),
    reason="Tesseract not installed"
)
class TestOCRExtraction:
    """Test OCR extraction with the multilingual route."""

    def test_extracts_regions(self, tmp_path: Path) -> None:
        """OCR should extract at least one region."""
        pdf_path = tmp_path / "ocr_test.pdf"

        # Create image-based PDF for OCR
        try:
            create_multilingual_pdf_image(pdf_path)
        except ImportError:
            pytest.skip("pdf2image not available")

        triage_result = triage(pdf_path)
        router = Router()

        doc = router.dispatch(pdf_path, triage_result)

        assert len(doc.regions) > 0, "Expected at least one region"
        assert doc.extracted_by.startswith("multilingual_ocr@")

    def test_region_has_script_attribution(self, tmp_path: Path) -> None:
        """Each region should have a valid script attribution."""
        pdf_path = tmp_path / "script_test.pdf"

        try:
            create_multilingual_pdf_image(pdf_path)
        except ImportError:
            pytest.skip("pdf2image not available")

        triage_result = triage(pdf_path)
        router = Router()
        doc = router.dispatch(pdf_path, triage_result)

        for region in doc.regions:
            assert region.script != Script.UNKNOWN, (
                "Region should have specific script, not UNKNOWN"
            )
            assert 0.0 <= region.confidence <= 1.0, (
                f"Confidence {region.confidence} out of range"
            )


# ============================================================================
# Cross-Contamination Tests
# ============================================================================

def _latin_char_ratio(text: str) -> float:
    """Calculate ratio of Latin characters in text."""
    if not text:
        return 0.0
    latin_count = sum(1 for c in text if 0x0041 <= ord(c) <= 0x024F)
    return latin_count / len(text)


@pytest.mark.skipif(
    not os.path.isfile("C:/Program Files/Tesseract-OCR/tesseract.exe"),
    reason="Tesseract not installed"
)
class TestCrossContamination:
    """Test that scripts don't bleed into wrong regions."""

    def test_hebrew_region_minimal_latin(self, tmp_path: Path) -> None:
        """Hebrew regions should have <10% Latin characters."""
        pdf_path = tmp_path / "contamination_test.pdf"

        try:
            create_multilingual_pdf_image(pdf_path)
        except ImportError:
            pytest.skip("pdf2image not available")

        triage_result = triage(pdf_path)
        router = Router()
        doc = router.dispatch(pdf_path, triage_result)

        hebrew_regions = [r for r in doc.regions if r.script == Script.HEBREW]

        for region in hebrew_regions:
            ratio = _latin_char_ratio(region.text)
            assert ratio < 0.10, (
                f"Hebrew region has {ratio:.0%} Latin chars (max 10%): {region.text[:50]}..."
            )

    def test_greek_region_minimal_latin(self, tmp_path: Path) -> None:
        """Greek regions should have <10% Latin characters."""
        pdf_path = tmp_path / "greek_contamination_test.pdf"

        try:
            create_multilingual_pdf_image(pdf_path)
        except ImportError:
            pytest.skip("pdf2image not available")

        triage_result = triage(pdf_path)
        router = Router()
        doc = router.dispatch(pdf_path, triage_result)

        greek_regions = [r for r in doc.regions if r.script == Script.GREEK]

        for region in greek_regions:
            ratio = _latin_char_ratio(region.text)
            assert ratio < 0.10, (
                f"Greek region has {ratio:.0%} Latin chars (max 10%): {region.text[:50]}..."
            )


# ============================================================================
# Smoke Test Compatibility
# ============================================================================

def test_smoke_test_still_passes(tmp_path: Path) -> None:
    """
    Verify that the original smoke test behavior is preserved.

    Born-digital Latin PDFs should still route to born_digital_text.
    """
    from reportlab.pdfgen import canvas as c

    pdf_path = tmp_path / "smoke_compat.pdf"
    doc = c.Canvas(str(pdf_path), pagesize=letter)
    text_obj = doc.beginText(72, 720)
    text_obj.textLine("This is a smoke test document.")
    text_obj.textLine("Born-digital, Latin script, single page.")
    doc.drawText(text_obj)
    doc.showPage()
    doc.save()

    triage_result = triage(pdf_path)

    assert triage_result.born_digital is True
    assert triage_result.has_text_layer is True
    assert Script.LATIN in triage_result.scripts_detected
    assert triage_result.suggested_route == "born_digital_text"

    router = Router()
    doc_result = router.dispatch(pdf_path, triage_result)

    assert doc_result.extracted_by.startswith("born_digital_text@")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
