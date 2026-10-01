"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { formatScore } from "@/lib/status";
import type { TrialResult } from "@/lib/types";
import { Chip } from "../ui/Chip";
import { CriterionRow } from "./CriterionRow";

export interface TrialRowProps {
  trial: TrialResult;
  rank: number;
}

export function TrialRow({ trial, rank }: TrialRowProps) {
  const [open, setOpen] = useState(false);
  const opened = useRef(0); // meters draw from zero on the first expand only
  const panelId = `trial-${trial.nct_id}`;
  const { pass, fail, unknown, abstained, pending } = trial.counts;

  const toggle = () => {
    if (!open) opened.current += 1;
    setOpen((o) => !o);
  };

  return (
    <li className="border-t border-chalk first:border-t-0" data-testid="trial-row">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="grid w-full gap-2 py-4 text-left md:grid-cols-[32px_1fr_auto] md:items-center md:gap-4"
      >
        <span className="font-mono text-data text-stone">{rank}</span>
        <span className="flex flex-col gap-1">
          <span className="font-mono text-data text-ink">{trial.nct_id}</span>
          <span className="text-label text-slate">{trial.title}</span>
          <span className="font-mono text-micro text-stone">
            pass {pass} · fail {fail} · unknown {unknown} · abstained {abstained}
            {pending > 0 && ` · pending ${pending}`}
          </span>
        </span>
        <span className="flex items-center gap-3">
          <Chip status={trial.status} />
          <span className="w-12 text-right font-mono text-data text-ink">{formatScore(trial.score)}</span>
          <span aria-hidden className="w-10 text-micro text-stone">{open ? "hide" : "show"}</span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <ul className="pb-4" aria-label={`Criteria for ${trial.nct_id}`}>
              {trial.criteria.map((c) => (
                <CriterionRow key={`${c.kind}-${c.idx}`} criterion={c} animateMeter={opened.current === 1} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
