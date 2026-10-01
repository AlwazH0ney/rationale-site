export interface ComparisonRow {
  property: string;
  values: [string, string, string];
}

export const COMPARISON_COLUMNS = ["rationale", "TrialMatchAI", "TrialGPT"] as const;

/**
 * Third-party cells read "not reported" unless the published paper or code
 * states the property; see the notes for sources.
 */
export const COMPARISON_ROWS: ComparisonRow[] = [
  { property: "Calibrated confidence", values: ["in progress", "not reported", "not reported"] },
  { property: "Versioned evidence", values: ["yes", "not reported", "not reported"] },
  { property: "Longitudinal state", values: ["in progress", "not reported", "not reported"] },
  { property: "Open source", values: ["yes", "not confirmed", "yes"] },
  { property: "Oncology-specific", values: ["yes", "yes", "no"] },
];

export const COMPARISON_NOTES = [
  { label: "TrialMatchAI", text: "Abdallah et al., arXiv:2505.08508; oncology validation, criterion-level rationales.", href: "https://arxiv.org/abs/2505.08508" },
  { label: "TrialGPT", text: "Jin et al., Nature Communications 2024; code at github.com/ncbi-nlp/TrialGPT.", href: "https://github.com/ncbi-nlp/TrialGPT" },
];

export interface ComparisonTableProps {
  rows?: ComparisonRow[];
}

export function ComparisonTable({ rows = COMPARISON_ROWS }: ComparisonTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <caption className="sr-only">rationale compared with TrialMatchAI and TrialGPT</caption>
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="py-3 pr-4 text-label text-stone">property</th>
              {COMPARISON_COLUMNS.map((c) => (
                <th key={c} scope="col" className="py-3 pr-4 text-label text-ink">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.property} className="border-b border-chalk">
                <th scope="row" className="py-3 pr-4 text-label font-medium text-ink">{r.property}</th>
                {r.values.map((v, i) => (
                  <td key={i} className={`py-3 pr-4 font-mono text-data ${v === "yes" ? "text-ink" : "text-stone"}`}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-1">
        {COMPARISON_NOTES.map((n) => (
          <li key={n.label} className="text-micro text-stone">
            {n.label}:{" "}
            <a className="underline decoration-fog underline-offset-2 hover:text-ink" href={n.href}>
              {n.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
