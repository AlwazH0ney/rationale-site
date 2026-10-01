import { VERDICT_LABEL } from "@/lib/status";
import type { Criterion } from "@/lib/types";
import { ConfidenceMeter } from "../ui/ConfidenceMeter";
import { Tag } from "../ui/Tag";

export interface CriterionRowProps {
  criterion: Criterion;
  animateMeter: boolean;
}

const PASS_MARK = { true: "clears", false: "fails", null: "open" } as const;

export function CriterionRow({ criterion: c, animateMeter }: CriterionRowProps) {
  const abstained = c.action === "abstain";
  return (
    <li className="grid gap-2 border-t border-chalk py-3 md:grid-cols-[64px_1fr_150px]">
      <span className="font-mono text-micro text-stone">
        {c.kind === "inclusion" ? "inc" : "exc"} {c.idx}
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-label text-ink">{c.text}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag variant="mono" title="Cited patient feature">
            {c.cited_feature}
          </Tag>
          {c.decided_by === "rule" && <Tag variant="sage">rule-derived</Tag>}
          {abstained && <Tag variant="strong">abstained</Tag>}
        </div>
        <p className="text-micro text-slate">{abstained && c.abstain_reason ? c.abstain_reason : c.reasoning}</p>
        {c.raw && c.raw.verdict !== c.verdict && (
          <p className="font-mono text-micro text-stone">
            llm said {VERDICT_LABEL[c.raw.verdict]} at {c.raw.confidence.toFixed(2)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5 md:items-end">
        <span className="text-label text-ink">
          {VERDICT_LABEL[c.verdict]} <span className="text-stone">· {PASS_MARK[String(c.passes) as "true" | "false" | "null"]}</span>
        </span>
        {abstained ? (
          <span className="font-mono text-micro text-stone">held for review</span>
        ) : (
          c.verdict !== "pending" && <ConfidenceMeter value={c.confidence} animate={animateMeter} />
        )}
      </div>
    </li>
  );
}
