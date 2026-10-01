import type { TrialStatus } from "@/lib/types";
import { Chip } from "../ui/Chip";

const ORDER: TrialStatus[] = ["eligible", "unresolved", "abstained", "rejected"];

export function StatusCounts({ summary }: { summary: Record<TrialStatus, number> }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Trials by status">
      {ORDER.map((s) => (
        <li key={s}>
          <Chip status={s} count={summary[s] ?? 0} />
        </li>
      ))}
    </ul>
  );
}
