"use client";

import { useEffect, useState } from "react";
import { fetchMetrics } from "@/lib/client";
import type { Metrics } from "@/lib/types";

/** Loads chart data for the methods section. */
export function useMetrics(): { metrics: Metrics | null; error: string | null } {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    fetchMetrics()
      .then((m) => live && setMetrics(m))
      .catch((e: Error) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, []);
  return { metrics, error };
}
