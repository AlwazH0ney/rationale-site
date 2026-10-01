import matchResults from "@/public/mock/match-results.json";
import metrics from "@/public/mock/metrics.json";
import patients from "@/public/mock/patients.json";
import type { MatchResult, Metrics, Patient } from "@/lib/types";

export const PATIENTS = patients as unknown as Patient[];
export const RESULTS = matchResults as unknown as Record<string, MatchResult>;
export const METRICS = metrics as unknown as Metrics;
export const TCGA = "TCGA-05-4418-derived";

/** Route fetch() to the mock JSON under public/, like the browser does. */
export function mockFetch(): void {
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = String(input);
    const body = url.endsWith("patients.json")
      ? PATIENTS
      : url.endsWith("match-results.json")
        ? RESULTS
        : url.endsWith("metrics.json")
          ? METRICS
          : null;
    return new Response(body ? JSON.stringify(body) : "not found", { status: body ? 200 : 404 });
  });
}
