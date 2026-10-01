"use client";

import { motion } from "framer-motion";

export interface PipelineSweepProps {
  chips: string[];
}

const STEPS = ["fetch", "parse", "retrieve", "judge", "verify", "rank"];

/** One sweep of the patient's feature chips along a six-step bar (not a loop). */
export function PipelineSweep({ chips }: PipelineSweepProps) {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      <div className="relative h-7 overflow-hidden rounded-pill border border-chalk bg-cream">
        {chips.slice(0, 4).map((chip, i) => (
          <motion.span
            key={chip}
            className="absolute top-1 rounded-pill bg-ink px-2 py-0.5 font-mono text-[10px] text-paper"
            initial={{ left: "-20%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {chip}
          </motion.span>
        ))}
      </div>
      <ol className="grid grid-cols-6 text-center font-mono text-[10px] text-stone">
        {STEPS.map((s, i) => (
          <li key={s}>
            0{i + 1} {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
