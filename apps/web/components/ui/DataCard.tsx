export interface DataCardProps {
  value: string;
  unit: string;
  /** Citation shown under the unit. Omit to show a visible "source needed" marker. */
  source?: string;
  sourceHref?: string;
  /** Hide the source line entirely (for patient data, which is not a claim). */
  noSource?: boolean;
  size?: "lg" | "sm";
}

export function DataCard({ value, unit, source, sourceHref, noSource = false, size = "lg" }: DataCardProps) {
  return (
    <div className="panel flex flex-col gap-1 p-5">
      <span className={`font-extrabold tracking-[-0.03em] text-ink ${size === "lg" ? "text-h1 md:text-[44px]" : "text-h2"}`}>
        {value}
      </span>
      <span className="text-label text-slate">{unit}</span>
      {!noSource &&
        (source ? (
          <span className="mt-1 text-micro text-stone">
            source:{" "}
            {sourceHref ? (
              <a className="underline decoration-fog underline-offset-2 hover:text-ink" href={sourceHref}>
                {source}
              </a>
            ) : (
              source
            )}
          </span>
        ) : (
          <span className="mt-1 font-mono text-micro text-stone">[source needed]</span>
        ))}
    </div>
  );
}
