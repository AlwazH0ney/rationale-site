"""Response models. Mirror apps/web/lib/types.ts; the web client reads both the API and the static mock."""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

TrialStatus = Literal["eligible", "unresolved", "abstained", "rejected"]
Verdict = Literal["met", "not_met", "unknown", "pending"]


class Health(BaseModel):
    status: Literal["ok"]
    version: str
    matcher: str


class Mutation(BaseModel):
    gene: str
    protein_change: str
    short: str
    driver: bool
    strength: Literal["strong", "standard"]
    vaf: Optional[float] = None


class TimelineItem(BaseModel):
    label: str
    detail: str
    date: Optional[str] = None
    kind: Literal["event", "line", "proposed"]


class PatientSummary(BaseModel):
    id: str
    label: str
    kind: Literal["tcga-derived", "synthetic"]
    note: str


class Patient(PatientSummary):
    model_config = ConfigDict(extra="allow")

    diagnosis: str
    stage: str
    age: int
    sex: str
    ecog: int
    smoking: Optional[str] = None
    brain_metastases: Optional[bool] = None
    mutations: list[Mutation]
    tmb: Optional[float] = None
    pd_l1: Optional[float] = None
    msi: Optional[str] = None
    next_line: int
    timeline: list[TimelineItem]
    profile: dict


class RawJudgment(BaseModel):
    verdict: Verdict
    confidence: float


class Criterion(BaseModel):
    kind: Literal["inclusion", "exclusion"]
    idx: int
    text: str
    verdict: Verdict
    confidence: float
    passes: Optional[bool] = None
    action: Literal["commit", "abstain"]
    abstain_reason: Optional[str] = None
    decided_by: Literal["llm", "rule", "none"]
    cited_feature: str
    reasoning: str
    route: str
    biomarker: bool
    checks: list[str]
    raw: Optional[RawJudgment] = None


class TrialResult(BaseModel):
    nct_id: str
    title: str
    phase: list[str]
    interventions: list[str]
    status: TrialStatus
    score: float
    retrieval_score: Optional[float] = None
    counts: dict[str, int]
    criteria: list[Criterion]


class MatchSource(BaseModel):
    model_config = ConfigDict(extra="allow")

    kind: Literal["phase3_rescore", "rule_layer_only"]
    description: str
    model: Optional[str] = None
    prompt_version: Optional[str] = None
    generated_at: Optional[str] = None


class MatchResult(BaseModel):
    patient_id: str
    source: MatchSource
    summary: dict[TrialStatus, int]
    trials: list[TrialResult]


class MatchRequest(BaseModel):
    patient_id: str
