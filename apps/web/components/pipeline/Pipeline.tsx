"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { Drawer } from "../ui/Drawer";
import { STAGES, type Stage } from "./stages";

export interface PipelineProps {
  stages?: Stage[];
}

/** Six clickable stages; arrow keys move between them, Enter opens the drawer. */
export function Pipeline({ stages = STAGES }: PipelineProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useCallback(() => setOpenId(null), []);
  const stage = stages.find((s) => s.id === openId) ?? null;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    refs.current[(next + stages.length) % stages.length]?.focus();
  };

  return (
    <>
      <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-chalk bg-chalk md:grid-cols-3 lg:grid-cols-6">
        {stages.map((s, i) => (
          <li key={s.id} className="bg-paper">
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              onClick={() => setOpenId(s.id)}
              onKeyDown={(e) => onKey(e, i)}
              aria-haspopup="dialog"
              className="flex h-full w-full flex-col gap-3 p-5 text-left transition-colors hover:bg-cream"
            >
              <span className="font-mono text-micro text-stone">{s.id}</span>
              <span className="text-h2">{s.name}</span>
              <span className="mt-auto text-h1">{s.figure}</span>
              <span className="text-micro text-slate">{s.unit}</span>
            </button>
          </li>
        ))}
      </ol>
      <Drawer open={stage !== null} onClose={close} title={stage ? stage.name : ""} label={stage ? `stage ${stage.id}` : undefined}>
        {stage && <p className="text-body text-slate">{stage.description}</p>}
        {stage && (
          <dl className="flex flex-col gap-5">
            <div className="rule-top flex flex-col gap-1">
              <dt className="label">input</dt>
              <dd className="text-label text-ink">{stage.input}</dd>
            </div>
            <div className="rule-top flex flex-col gap-1">
              <dt className="label">output</dt>
              <dd className="text-label text-ink">{stage.output}</dd>
            </div>
            <div className="rule-top flex flex-col gap-1">
              <dt className="label">figure</dt>
              <dd className="font-mono text-data text-ink">
                {stage.figure} {stage.unit}
              </dd>
            </div>
          </dl>
        )}
      </Drawer>
    </>
  );
}
