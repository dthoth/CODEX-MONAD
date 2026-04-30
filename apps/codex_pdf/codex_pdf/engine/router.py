"""
Router — discovers routes by convention and dispatches based on triage.

The router walks codex_pdf.routes, finds any module that exposes a
top-level `Route` class, instantiates it, and asks each one's can_handle()
score for a given triage result. Highest scorer wins. If extraction raises
ExtractionError, the router falls back to triage.fallback_route.
"""

from __future__ import annotations

import importlib
import logging
import pkgutil
from pathlib import Path

from codex_pdf.engine.model import ExtractedDocument, TriageResult
from codex_pdf.engine.route import ExtractionError, Route

log = logging.getLogger(__name__)


class Router:
    """Discovers and dispatches to route modules."""

    def __init__(self) -> None:
        self._routes: dict[str, Route] = {}
        self._discover()

    def _discover(self) -> None:
        """Walk codex_pdf.routes and register any exposed Route classes."""
        import codex_pdf.routes as routes_pkg

        for module_info in pkgutil.iter_modules(routes_pkg.__path__):
            module = importlib.import_module(f"codex_pdf.routes.{module_info.name}")
            route_cls = getattr(module, "Route", None)
            if route_cls is None:
                continue
            instance = route_cls()
            if not isinstance(instance, Route):
                log.warning(
                    "Module %s exposes Route but does not satisfy protocol",
                    module_info.name,
                )
                continue
            self._routes[instance.name] = instance
            log.info("Registered route: %s v%s", instance.name, instance.version)

    @property
    def registered(self) -> list[str]:
        return sorted(self._routes.keys())

    def dispatch(self, pdf_path: Path, triage: TriageResult) -> ExtractedDocument:
        """
        Pick the best route for `triage` and run extraction.
        Falls back to triage.fallback_route on ExtractionError.
        """
        # Try suggested route first if it exists and accepts.
        suggested = self._routes.get(triage.suggested_route)
        if suggested is not None and suggested.can_handle(triage) > 0.0:
            try:
                return suggested.extract(pdf_path, triage)
            except ExtractionError as e:
                log.warning(
                    "Suggested route %s failed: %s. Falling back to %s.",
                    triage.suggested_route,
                    e,
                    triage.fallback_route,
                )

        # Fall back.
        fallback = self._routes.get(triage.fallback_route)
        if fallback is None:
            raise ExtractionError(
                f"No route registered for fallback '{triage.fallback_route}' "
                f"(registered: {self.registered})",
                route_name="<router>",
            )
        return fallback.extract(pdf_path, triage)

    def best_route_for(self, triage: TriageResult) -> str:
        """Return the name of the highest-scoring route for diagnostic purposes."""
        scores = {name: r.can_handle(triage) for name, r in self._routes.items()}
        if not scores or max(scores.values()) == 0.0:
            return triage.fallback_route
        return max(scores, key=scores.get)
