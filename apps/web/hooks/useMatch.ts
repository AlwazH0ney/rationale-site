"use client";

import { useCallback, useRef, useState } from "react";
import { fetchMatch } from "@/lib/client";
import type { MatchResult } from "@/lib/types";

export interface UseMatchResult {
  result: MatchResult | null;
  status: "idle" | "running" | "done" | "error";
  error: string | null;
  run: (patientId: string) => Promise<void>;
  reset: () => void;
}

/** Runs a match for one patient; reset() returns to the empty state on patient swap. */
export function useMatch(): UseMatchResult {
  const [result, setResult] = useState<MatchResult | null>(null);
  const [status, setStatus] = useState<UseMatchResult["status"]>("idle");
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);

  const run = useCallback(async (patientId: string) => {
    const id = ++request.current;
    setStatus("running");
    setError(null);
    try {
      const r = await fetchMatch(patientId);
      if (id !== request.current) return; // a newer request or a reset superseded this one
      setResult(r);
      setStatus("done");
    } catch (e) {
      if (id !== request.current) return;
      setError((e as Error).message);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    request.current++;
    setResult(null);
    setError(null);
    setStatus("idle");
  }, []);

  return { result, status, error, run, reset };
}
