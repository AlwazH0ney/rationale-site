import type { MatchResult, Metrics, Patient } from "./types";

/**
 * Data access for the demo. Static mock JSON by default; set
 * NEXT_PUBLIC_API_URL to read the same shapes from the FastAPI backend.
 */
const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export class DataError extends Error {}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new DataError(`Could not reach ${url}. Check the network or that the API is running.`);
  }
  if (!res.ok) {
    throw new DataError(`${url} returned ${res.status}. Regenerate the mock data with pnpm mock.`);
  }
  return (await res.json()) as T;
}

export function fetchPatients(): Promise<Patient[]> {
  return getJson<Patient[]>(API ? `${API}/patients` : "/mock/patients.json");
}

export async function fetchMatch(patientId: string): Promise<MatchResult> {
  if (API) {
    return getJson<MatchResult>(`${API}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_id: patientId }),
    });
  }
  const all = await getJson<Record<string, MatchResult>>("/mock/match-results.json");
  const result = all[patientId];
  if (!result) throw new DataError(`No match result for ${patientId}. Add it in scripts/build_mock.py.`);
  return result;
}

export function fetchMetrics(): Promise<Metrics> {
  return getJson<Metrics>(API ? `${API}/metrics` : "/mock/metrics.json");
}
