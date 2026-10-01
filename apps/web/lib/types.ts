/** Shapes of the mock JSON (scripts/build_mock.py) and the FastAPI responses. Keep in sync with apps/api/schemas.py. */

export type TrialStatus = "eligible" | "unresolved" | "abstained" | "rejected";
export type Verdict = "met" | "not_met" | "unknown" | "pending";
export type DecidedBy = "llm" | "rule" | "none";

export interface Mutation {
  gene: string;
  protein_change: string;
  short: string;
  driver: boolean;
  strength: "strong" | "standard";
  vaf: number | null;
}

export interface TimelineItem {
  label: string;
  detail: string;
  date?: string | null;
  kind: "event" | "line" | "proposed";
}

export interface Patient {
  id: string;
  label: string;
  kind: "tcga-derived" | "synthetic";
  note: string;
  diagnosis: string;
  stage: string;
  age: number;
  sex: string;
  ecog: number;
  smoking: string | null;
  brain_metastases: boolean | null;
  mutations: Mutation[];
  tmb: number | null;
  pd_l1: number | null;
  msi: string | null;
  next_line: number;
  timeline: TimelineItem[];
  profile: Record<string, unknown>;
}

export interface Criterion {
  kind: "inclusion" | "exclusion";
  idx: number;
  text: string;
  verdict: Verdict;
  confidence: number;
  passes: boolean | null;
  action: "commit" | "abstain";
  abstain_reason: string | null;
  decided_by: DecidedBy;
  cited_feature: string;
  reasoning: string;
  route: string;
  biomarker: boolean;
  checks: string[];
  raw: { verdict: Verdict; confidence: number } | null;
}

export interface TrialResult {
  nct_id: string;
  title: string;
  phase: string[];
  interventions: string[];
  status: TrialStatus;
  score: number;
  retrieval_score: number | null;
  counts: { pass: number; fail: number; unknown: number; abstained: number; pending: number };
  criteria: Criterion[];
}

export interface MatchSource {
  kind: "phase3_rescore" | "rule_layer_only";
  description: string;
  model: string | null;
  prompt_version: string | null;
  generated_at: string | null;
}

export interface MatchResult {
  patient_id: string;
  source: MatchSource;
  summary: Record<TrialStatus, number>;
  trials: TrialResult[];
}

export interface CurvePoint {
  raw: number;
  calibrated: number;
}

export interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
  source?: EvidenceSource;
}

export interface EvidenceSource {
  nct_id: string;
  url: string;
  trial_title: string;
  criterion: string;
  criterion_text: string;
  verdict: Verdict;
  decided_by: DecidedBy;
  cited_feature: string;
}

export interface Metrics {
  calibration: { illustrative: boolean; note: string; points: (CurvePoint & { confidence: number })[] };
  coverage_risk: { illustrative: boolean; note: string; points: (CurvePoint & { coverage: number })[] };
  evidence: { illustrative: boolean; note: string; tree: SunburstNode };
  run: { model: string; hardware: string; mean_criterion_s: number; n_criteria: number; prompt_version: string };
}
