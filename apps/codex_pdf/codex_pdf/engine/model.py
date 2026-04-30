"""
Core data model for codex-pdf.

These dataclasses are the contracts that every layer of the system agrees on.
The triage stage produces a TriageResult. Routes consume a TriageResult and a
PDF path and produce an ExtractedDocument. Emitters consume an ExtractedDocument
and write to Paperless / RAG / Asana / etc.

The shape of these classes is the architecture. Treat changes here as breaking.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum


def _utc_now() -> datetime:
    """Timezone-aware UTC now. Replaces deprecated datetime.utcnow()."""
    return datetime.now(timezone.utc)
from pathlib import Path
from typing import Optional


# ---------------------------------------------------------------------------
# Enums — closed sets so downstream code can match exhaustively
# ---------------------------------------------------------------------------


class DocumentKind(str, Enum):
    """High-level genre. Drives route selection and outline rendering."""

    SERMON = "sermon"
    PHILOLOGICAL = "philological"
    ESOTERICA = "esoterica"
    DISSERTATION = "dissertation"
    LEGAL = "legal"  # LOIs, trust documents, formal instruments
    NOVEL = "novel"
    ARCHIVE_SCRAP = "archive_scrap"  # loose pages, scans of unclear provenance
    CORRESPONDENCE = "correspondence"
    REFERENCE = "reference"  # primers, packets, study guides
    UNKNOWN = "unknown"


class Script(str, Enum):
    """Writing systems we explicitly handle. Add as needed."""

    LATIN = "latin"
    HEBREW = "hebrew"
    GREEK = "greek"
    ARAMAIC = "aramaic"  # Estrangela, Imperial, etc. — variants live in metadata
    ARABIC = "arabic"
    CYRILLIC = "cyrillic"
    CJK = "cjk"
    UNKNOWN = "unknown"


class Authorship(str, Enum):
    """Authorship attribution rule from CODEX-MONAD policy."""

    REV_LL_DAN_I_EL_THOMAS = "rev_ll_dan_i_el_thomas"
    SIMBELL_TRUST_CONSULTING = "simbell_trust_consulting"
    EXTERNAL = "external"  # not authored by Daniel
    UNKNOWN = "unknown"


# ---------------------------------------------------------------------------
# Region & content primitives
# ---------------------------------------------------------------------------


@dataclass
class BBox:
    """Bounding box in PDF coordinates (origin: bottom-left, points)."""

    x0: float
    y0: float
    x1: float
    y1: float

    @property
    def width(self) -> float:
        return self.x1 - self.x0

    @property
    def height(self) -> float:
        return self.y1 - self.y0


@dataclass
class Region:
    """A spatial region within a page with detected script and content."""

    page: int  # 1-indexed
    bbox: BBox
    script: Script
    text: str
    confidence: float  # 0.0 to 1.0 — OCR or detection confidence
    language: Optional[str] = None  # ISO 639 code when detectable beyond script


@dataclass
class Anchor:
    """An anchor in body text that points to a footnote."""

    id: str  # stable identifier — usually the marker glyph/number
    page: int
    bbox: BBox
    surrounding_text: str  # ~50 chars context for human readability


@dataclass
class Footnote:
    """A footnote linked to one or more anchors."""

    id: str
    page: int  # page where footnote *appears* (often != anchor page in some genres)
    bbox: BBox
    text: str
    anchor_ids: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Triage — what the classifier produces
# ---------------------------------------------------------------------------


@dataclass
class TriageResult:
    """
    Output of the triage stage. Every field is required because downstream
    code branches on these. 'unknown' is a first-class value, not a None.
    """

    kind: DocumentKind
    scripts_detected: list[Script]
    born_digital: bool  # False = scanned (needs OCR route)
    has_text_layer: bool
    page_count: int
    confidence: float  # overall classifier confidence
    suggested_route: str  # name of route module to dispatch to
    fallback_route: str  # if suggested fails / low confidence
    notes: list[str] = field(default_factory=list)  # human-readable hints
    detected_at: datetime = field(default_factory=_utc_now)


# ---------------------------------------------------------------------------
# Extraction — what routes produce
# ---------------------------------------------------------------------------


@dataclass
class ExtractedDocument:
    """
    The canonical extracted form of a PDF. Emitters consume this.

    `regions` is the source of truth for content; `full_text` is a
    convenience join. `outline` reflects the document's structural shape
    according to its genre (sermon outline vs. dissertation outline vs.
    flat for unknown).
    """

    source_path: Path
    triage: TriageResult
    regions: list[Region]
    footnotes: list[Footnote]
    anchors: list[Anchor]
    outline: list[OutlineNode]
    metadata: DocumentMetadata
    full_text: str  # convenience: regions joined in reading order
    extracted_by: str  # route module name + version
    extracted_at: datetime = field(default_factory=_utc_now)


@dataclass
class OutlineNode:
    """
    A node in the document's structural outline. The `role` is genre-specific
    (e.g., 'pericope' for sermons, 'chapter' for dissertations) — the
    workbench renders these differently per genre.
    """

    role: str
    title: str
    page: int
    children: list[OutlineNode] = field(default_factory=list)


@dataclass
class DocumentMetadata:
    """
    Metadata that survives outside our stack (written to PDF XMP) and
    powers Paperless tags, Asana linkage, and RAG chunk attribution.
    """

    title: Optional[str] = None
    authorship: Authorship = Authorship.UNKNOWN
    genre: Optional[DocumentKind] = None  # may match triage.kind or be refined
    languages: list[str] = field(default_factory=list)  # ISO 639
    provenance: Optional[str] = None  # where in the archive it came from
    paperless_tags: list[str] = field(default_factory=list)
    asana_task_gid: Optional[str] = None
    rag_eligible: bool = True
    custom: dict[str, str] = field(default_factory=dict)  # escape hatch
