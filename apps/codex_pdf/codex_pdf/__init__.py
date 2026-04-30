"""codex-pdf — a Daniel-corpus PDF system.

Public API:
    from codex_pdf import triage, Router, ExtractedDocument
"""

from codex_pdf.engine.model import (
    Anchor,
    Authorship,
    BBox,
    DocumentKind,
    DocumentMetadata,
    ExtractedDocument,
    Footnote,
    OutlineNode,
    Region,
    Script,
    TriageResult,
)
from codex_pdf.engine.route import ExtractionError, Route
from codex_pdf.engine.router import Router
from codex_pdf.triage.classifier import triage

__version__ = "0.1.0"

__all__ = [
    "Anchor",
    "Authorship",
    "BBox",
    "DocumentKind",
    "DocumentMetadata",
    "ExtractedDocument",
    "ExtractionError",
    "Footnote",
    "OutlineNode",
    "Region",
    "Route",
    "Router",
    "Script",
    "TriageResult",
    "triage",
]
