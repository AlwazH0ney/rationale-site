import type { TrialStatus } from "@/lib/types";

export interface ChipProps {
  status: TrialStatus;
  count?: number;
}

/** Status is encoded by dot shape and fill, never by colour. */
const DOT: Record<TrialStatus, string> = {
  eligible: "bg-ink",
  unresolved: "border border-ink",
  abstained: "border border-dashed border-ink",
  rejected: "bg-paper",
};

export function Chip({ status, count }: ChipProps) {
  const inverted = status === "rejected";
  return (
    <span
      data-status={status}
      className={`inline-flex h-7 items-center gap-2 rounded-pill border px-3 text-label ${
        inverted ? "border-ink bg-ink text-paper" : "border-chalk bg-paper text-ink"
      }`}
    >
      <span aria-hidden className={`h-2 w-2 rounded-pill ${DOT[status]}`} />
      {status}
      {count !== undefined && <span className="font-mono">{count}</span>}
    </span>
  );
}
