"""
Route module interface.

Every extraction route — born-digital text, multilingual OCR, scanned
esoterica, etc. — implements this protocol. Routes are discovered by
convention (any module in codex_pdf.routes that exposes a `Route` class
satisfying this protocol is registered automatically).

Adding a new document type means dropping a new file into routes/. No
central registry to update. No orchestrator to refactor.
"""

from __future__ import annotations

from pathlib import Path
from typing import Protocol, runtime_checkable

from codex_pdf.engine.model import ExtractedDocument, TriageResult


@runtime_checkable
class Route(Protocol):
    """Protocol every extraction route must satisfy."""

    name: str  # stable identifier, e.g. "born_digital_text" — used in suggested_route
    version: str  # semver — bump when output shape or behavior changes meaningfully

    def can_handle(self, triage: TriageResult) -> float:
        """
        Return a confidence score (0.0–1.0) that this route can handle the
        document described by `triage`. The router picks the highest scorer
        among candidates. 0.0 means refuse outright.
        """
        ...

    def extract(self, pdf_path: Path, triage: TriageResult) -> ExtractedDocument:
        """
        Perform extraction. Must return a fully-populated ExtractedDocument.
        Raises ExtractionError on unrecoverable failure — the router will
        then dispatch to triage.fallback_route.
        """
        ...


class ExtractionError(Exception):
    """Raised by a route when it cannot complete extraction."""

    def __init__(self, message: str, route_name: str, recoverable: bool = False):
        super().__init__(message)
        self.route_name = route_name
        self.recoverable = recoverable
