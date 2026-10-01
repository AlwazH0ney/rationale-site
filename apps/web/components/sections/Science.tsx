"use client";

import { useMetrics } from "@/hooks/useMetrics";
import { CalibrationChart } from "../charts/CalibrationChart";
import { CoverageRiskChart } from "../charts/CoverageRiskChart";
import { EvidenceSunburst } from "../charts/EvidenceSunburst";
import { SectionHeader } from "../ui/SectionHeader";

export function Science() {
  const { metrics, error } = useMetrics();
  return (
    <section id="methods" className="band flex scroll-mt-8 flex-col gap-10 bg-linen" aria-labelledby="methods-title">
      <SectionHeader
        id="methods-title"
        label="methods"
        title="Every result here is reproducible from the public code."
        lede="Benchmarks against TrialMatchAI and TrialGPT on the TREC-CDS 2023 corpus and a hand-annotated LUAD subset are in progress. Charts marked illustrative show the method, not results."
      />
      {error && <p className="text-label text-ink">{error}</p>}
      {metrics ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <CalibrationChart data={metrics.calibration} />
          <CoverageRiskChart data={metrics.coverage_risk} />
          <EvidenceSunburst data={metrics.evidence} />
        </div>
      ) : (
        !error && <p className="text-label text-stone">Loading charts</p>
      )}
      {metrics && (
        <p className="font-mono text-micro text-stone">
          baseline run: {metrics.run.model} on {metrics.run.hardware}, {metrics.run.mean_criterion_s} s per criterion,{" "}
          {metrics.run.n_criteria} criteria, prompt {metrics.run.prompt_version}
        </p>
      )}
    </section>
  );
}
