import type { TimelineItem } from "@/lib/types";

export interface TimelineProps {
  items: TimelineItem[];
}

/** Treatment course; the proposed next line is the active (sage) dot. */
export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="flex flex-col" aria-label="Treatment timeline">
      {items.map((item, i) => {
        const active = item.kind === "proposed";
        const last = i === items.length - 1;
        return (
          <li key={`${item.label}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
            {!last && <span aria-hidden className="absolute left-[5px] top-4 h-[calc(100%-12px)] w-px bg-chalk" />}
            <span
              aria-hidden
              data-active={active || undefined}
              className={`mt-1 h-[11px] w-[11px] shrink-0 rounded-pill ${
                active ? "bg-sage" : item.kind === "line" ? "bg-ink" : "border border-ink bg-paper"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-label text-ink">
                {item.label}
                {item.date && <span className="ml-2 font-mono text-micro text-stone">{item.date}</span>}
              </span>
              <span className="text-micro text-slate">{item.detail}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
