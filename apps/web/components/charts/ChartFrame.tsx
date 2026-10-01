import type { ReactNode } from "react";
import { Tag } from "../ui/Tag";

export interface ChartFrameProps {
  title: string;
  caption: string;
  illustrative: boolean;
  children: ReactNode;
  legend?: { label: string; swatch: "ink" | "sage" | "dashed" }[];
}

const SWATCH = {
  ink: "h-0.5 w-5 bg-ink",
  sage: "h-0.5 w-5 bg-sage",
  dashed: "h-0 w-5 border-t border-dashed border-stone",
};

/** Paper panel for one chart, with an explicit illustrative-or-real marker. */
export function ChartFrame({ title, caption, illustrative, children, legend }: ChartFrameProps) {
  return (
    <figure className="panel flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h2">{title}</h3>
        <Tag variant={illustrative ? "strong" : "sage"}>{illustrative ? "illustrative data" : "real data"}</Tag>
      </div>
      {children}
      {legend && (
        <ul className="flex flex-wrap gap-4">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2 text-micro text-slate">
              <span aria-hidden className={SWATCH[l.swatch]} />
              {l.label}
            </li>
          ))}
        </ul>
      )}
      <figcaption className="text-micro text-stone">{caption}</figcaption>
    </figure>
  );
}
