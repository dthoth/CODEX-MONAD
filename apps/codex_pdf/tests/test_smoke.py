"""
Smoke test — generate a tiny born-digital PDF, run it through triage and
the router, assert we get back an ExtractedDocument with sensible content.

This is the lowest bar: the architecture holds together end-to-end.
"""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from codex_pdf import DocumentKind, Router, Script, triage


def make_test_pdf(path: Path, body: str) -> None:
    c = canvas.Canvas(str(path), pagesize=letter)
    text_obj = c.beginText(72, 720)
    for line in body.splitlines():
        text_obj.textLine(line)
    c.drawText(text_obj)
    c.showPage()
    c.save()


def test_end_to_end(tmp_path: Path) -> None:
    pdf_path = tmp_path / "smoke.pdf"
    make_test_pdf(
        pdf_path,
        "This is a smoke test document.\n"
        "Born-digital, Latin script, single page.\n"
        "If this round-trips, the architecture is sound.",
    )

    triage_result = triage(pdf_path)
    assert triage_result.page_count == 1
    assert triage_result.has_text_layer is True
    assert triage_result.born_digital is True
    assert Script.LATIN in triage_result.scripts_detected
    assert triage_result.suggested_route == "born_digital_text"

    router = Router()
    assert "born_digital_text" in router.registered

    doc = router.dispatch(pdf_path, triage_result)
    assert doc.source_path == pdf_path
    assert "smoke test" in doc.full_text
    assert doc.extracted_by.startswith("born_digital_text@")
    assert doc.triage.kind == DocumentKind.UNKNOWN  # v0.1 doesn't classify genre yet
    assert len(doc.regions) == 1
    assert doc.regions[0].script == Script.LATIN


if __name__ == "__main__":
    import tempfile

    with tempfile.TemporaryDirectory() as tmp:
        test_end_to_end(Path(tmp))
        print("smoke test passed")
