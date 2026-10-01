export interface MarqueeProps {
  words: string[];
}

/**
 * Ambient 28s loop. Pauses on hover and keyboard focus, and stops entirely
 * under prefers-reduced-motion (globals.css).
 */
export function Marquee({ words }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className={`text-h1 ${i % 2 === 0 ? "text-sage" : "text-ink"}`}>
          {w}
        </span>
      ))}
    </div>
  );
  return (
    <div role="marquee" className="group band overflow-hidden border-y border-chalk !py-6" tabIndex={0} aria-label={words.join(", ")}>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
