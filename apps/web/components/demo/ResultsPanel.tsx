"use client";

import { motion } from "framer-motion";
import { sortTrials } from "@/lib/status";
import type { MatchResult } from "@/lib/types";
import { Tag } from "../ui/Tag";
import { PipelineSweep } from "./PipelineSweep";
import { StatusCounts } from "./StatusCounts";
import { TrialRow } from "./TrialRow";

export interface ResultsPanelProps {
  result: MatchResult | null;
  status: "idle" | "running" | "done" | "error";
  error?: string | null;
  chips?: string[];
}

const SOURCE_LABEL = {
  phase3_rescore: "phase 3 pipeline output",
  rule_layer_only: "rule layer only",
} as const;

export function ResultsPanel({ result, status, error, chips = [] }: ResultsPanelProps) {
  if (status === "error") {
    return (
      <section className="panel flex min-h-[420px] items-center justify-center p-8" aria-live="polite">
        <p className="text-label text-ink">{error}</p>
      </section>
    );
  }
  if (!result || status === "idle") {
    return (
      <section className="panel flex min-h-[420px] flex-col items-center justify-center gap-2 p-8 text-center" aria-live="polite">
        <p className="text-h2">No match yet</p>
        <p className="max-w-[320px] text-label text-stone">Choose a patient and run the match to see ranked trials with per-criterion evidence.</p>
      </section>
    );
  }

  const trials = sortTrials(result.trials);
  return (
    <section className="flex flex-col gap-5" aria-live="polite" aria-label="Match results">
      <PipelineSweep key={result.patient_id} chips={chips} />
      <motion.div
        className="panel flex flex-col gap-5 p-6"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <StatusCounts summary={result.summary} />
          <Tag variant="mono">{SOURCE_LABEL[result.source.kind]}</Tag>
        </div>
        <p className="text-micro text-stone">
          {result.source.description}
          {result.source.prompt_version && ` Prompt ${result.source.prompt_version}, model ${result.source.model}.`} Sample corpus: 3 trials.
        </p>
        <ol aria-label="Ranked trials">
          {trials.map((t, i) => (
            <TrialRow key={t.nct_id} trial={t} rank={i + 1} />
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
