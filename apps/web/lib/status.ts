import type { TrialResult, TrialStatus, Verdict } from "./types";

export const STATUS_ORDER: Record<TrialStatus, number> = {
  eligible: 0,
  unresolved: 1,
  abstained: 2,
  rejected: 3,
};

/** Status first (eligible → rejected), then score, matching the pipeline's rank_trials. */
export function sortTrials(trials: TrialResult[]): TrialResult[] {
  return [...trials].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.score - a.score,
  );
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  met: "met",
  not_met: "not met",
  unknown: "unknown",
  pending: "pending",
};

export function formatScore(n: number): string {
  return n.toFixed(3);
}
