"use client";

import { motion } from "framer-motion";

export interface ConfidenceMeterProps {
  value: number;
  /** Draw from zero (first expand only); otherwise render at the final width. */
  animate?: boolean;
  label?: string;
}

/** Thin bar, ink fill on chalk. Width encodes confidence; text gives the exact value. */
export function ConfidenceMeter({ value, animate = false, label = "confidence" }: ConfidenceMeterProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="flex items-center gap-2" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={1} aria-valuenow={value}>
      <div className="h-1 w-16 overflow-hidden rounded-pill bg-chalk">
        <motion.div
          className="h-full bg-ink"
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </div>
      <span className="w-9 font-mono text-micro text-slate">{value.toFixed(2)}</span>
    </div>
  );
}
