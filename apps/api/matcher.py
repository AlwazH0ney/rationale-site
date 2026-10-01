"""
The single swap point between the API and the matching engine.

Week 1 serves recorded pipeline output (MockMatcher). To go live, implement
LuadMatcher against the luad-match package and change get_matcher(); no
route in main.py needs to change.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional, Protocol

DATA_DIR = Path(__file__).parent / "data"


class Matcher(Protocol):
    """What the routes need from a matching engine."""

    name: str

    def list_patients(self) -> list[dict[str, Any]]: ...

    def get_patient(self, patient_id: str) -> Optional[dict[str, Any]]: ...

    def match(self, patient_id: str) -> Optional[dict[str, Any]]: ...

    def metrics(self) -> dict[str, Any]: ...


class MockMatcher:
    """Serves the JSON written by scripts/build_mock.py (same files as the web app's /mock)."""

    name = "mock"

    def __init__(self, data_dir: Path = DATA_DIR) -> None:
        self._patients: list[dict[str, Any]] = self._load(data_dir / "patients.json")
        self._results: dict[str, Any] = self._load(data_dir / "match-results.json")
        self._metrics: dict[str, Any] = self._load(data_dir / "metrics.json")

    @staticmethod
    def _load(path: Path) -> Any:
        if not path.exists():
            raise FileNotFoundError(f"{path} is missing. Run `pnpm mock` from the repo root to generate it.")
        return json.loads(path.read_text(encoding="utf-8"))

    def list_patients(self) -> list[dict[str, Any]]:
        return self._patients

    def get_patient(self, patient_id: str) -> Optional[dict[str, Any]]:
        return next((p for p in self._patients if p["id"] == patient_id), None)

    def match(self, patient_id: str) -> Optional[dict[str, Any]]:
        return self._results.get(patient_id)

    def metrics(self) -> dict[str, Any]:
        return self._metrics


class LuadMatcher:
    """Placeholder for the live engine: retrieve -> evaluate -> rescore via trial_matcher.

    Sketch of match(): build PatientProfile from the stored profile, call
    trial_matcher.retrieve.retrieve_candidates, then trial_matcher.match.evaluate_trial
    with an OllamaBackend and PostProcessConfig, and map the result with the same
    shaping as scripts/build_mock.py (ui_trial / result_record).
    """

    name = "luad-match"

    def __init__(self) -> None:
        raise NotImplementedError("LuadMatcher is planned for a later week; use MockMatcher.")


@lru_cache(maxsize=1)
def get_matcher() -> Matcher:
    """Change this one line to switch engines."""
    return MockMatcher()
