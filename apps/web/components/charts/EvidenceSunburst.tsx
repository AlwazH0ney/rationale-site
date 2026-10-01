"use client";

import { arc as d3arc, hierarchy, partition, type HierarchyRectangularNode } from "d3";
import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import { VERDICT_LABEL } from "@/lib/status";
import type { EvidenceSource, Metrics, SunburstNode } from "@/lib/types";
import { Modal } from "../ui/Modal";
import { ChartFrame } from "./ChartFrame";

export interface EvidenceSunburstProps {
  data: Metrics["evidence"];
  size?: number;
}

type Node = HierarchyRectangularNode<SunburstNode>;

const RING_FILL = ["#FFFFFF", "#F2F0EA", "#FAFAF7", "#FFFFFF"];

/** Patient feature → criterion → trial record. Click or press Enter on an outer leaf for its source. */
export function EvidenceSunburst({ data, size = 240 }: EvidenceSunburstProps) {
  const [active, setActive] = useState<EvidenceSource | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const close = useCallback(() => setActive(null), []);
  const radius = size / 2;

  const nodes = useMemo(() => {
    const root = hierarchy<SunburstNode>(data.tree)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    return partition<SunburstNode>().size([2 * Math.PI, radius])(root).descendants().filter((d) => d.depth > 0) as Node[];
  }, [data.tree, radius]);

  const ring = radius / 3.4;
  const arcPath = useMemo(
    () =>
      d3arc<Node>()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .padAngle(0.004)
        .innerRadius((d) => ring * (d.depth - 1) + ring * 0.4)
        .outerRadius((d) => ring * d.depth + ring * 0.4 - 1),
    [ring],
  );

  const features = nodes.filter((n) => n.depth === 1);
  const total = data.tree.children?.reduce((s, c) => s + (c.children?.length ?? 0), 0) ?? 0;

  const onKey = (e: KeyboardEvent<SVGPathElement>, src?: EvidenceSource) => {
    if (src && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setActive(src);
    }
  };

  return (
    <ChartFrame title="Evidence chain" illustrative={data.illustrative} caption={data.note}>
      <div className="flex flex-col items-center gap-4">
        <svg viewBox={`${-radius} ${-radius} ${size} ${size}`} width="100%" style={{ maxWidth: size }} aria-label="Evidence sunburst">
          {nodes.map((n, i) => {
            const leaf = n.depth === 3 && n.data.source;
            const key = `${n.depth}-${n.data.name}-${i}`;
            const lit = hover !== null && n.ancestors().some((a) => a.data.name === hover && a.depth === 1);
            return (
              <path
                key={key}
                d={arcPath(n) ?? undefined}
                fill={lit ? "#E9EDE9" : RING_FILL[n.depth]}
                stroke={lit ? "#6B7E73" : "#C9C6BE"}
                strokeWidth={0.75}
                tabIndex={leaf ? 0 : undefined}
                role={leaf ? "button" : undefined}
                aria-label={leaf ? `${n.data.source!.nct_id} ${n.data.source!.criterion}: show source` : undefined}
                className={leaf ? "cursor-pointer outline-none focus:stroke-ink" : undefined}
                onClick={leaf ? () => setActive(n.data.source!) : undefined}
                onKeyDown={leaf ? (e) => onKey(e, n.data.source) : undefined}
                onMouseEnter={() => setHover(n.ancestors().find((a) => a.depth === 1)?.data.name ?? null)}
                onMouseLeave={() => setHover(null)}
              >
                <title>{n.depth === 3 ? `${n.data.name}` : `${n.data.name} (${n.value})`}</title>
              </path>
            );
          })}
          <text textAnchor="middle" dy="-0.1em" className="fill-ink text-h2 font-extrabold">{total}</text>
          <text textAnchor="middle" dy="1.3em" className="fill-stone font-mono" fontSize={9}>criteria</text>
        </svg>
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-1" aria-label="Patient features cited">
          {features.map((f) => (
            <li key={f.data.name} className="flex justify-between text-micro text-slate">
              <span>{f.data.name}</span>
              <span className="font-mono">{f.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <Modal open={active !== null} onClose={close} title={active ? `${active.nct_id} · ${active.criterion}` : ""} label="source reference">
        {active && (
          <dl className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <dt className="label">criterion</dt>
              <dd className="text-body text-ink">{active.criterion_text}</dd>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <dt className="label">verdict</dt>
                <dd className="text-label text-ink">{VERDICT_LABEL[active.verdict]}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="label">decided by</dt>
                <dd className="text-label text-ink">{active.decided_by === "rule" ? "deterministic rule" : "LLM judgment"}</dd>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="label">cited patient feature</dt>
              <dd className="font-mono text-data text-ink">{active.cited_feature}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="label">source document</dt>
              <dd className="text-label">
                <a className="text-ink underline decoration-fog underline-offset-2" href={active.url} target="_blank" rel="noreferrer">
                  {active.trial_title}
                </a>
                <span className="block font-mono text-micro text-stone">{active.url}</span>
              </dd>
            </div>
          </dl>
        )}
      </Modal>
    </ChartFrame>
  );
}
