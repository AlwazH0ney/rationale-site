import { Marquee } from "../ui/Marquee";

const REPO = "https://github.com/AlwazH0ney/trial-matcher";

const COLUMNS = [
  {
    label: "code",
    title: "github.com/AlwazH0ney/trial-matcher",
    href: REPO,
    sub: "Python package, pytest suite and dated regression baselines. License to be added.",
  },
  {
    label: "methods",
    title: "Paper draft (in progress)",
    sub: "Preprint on bioRxiv once Phase 4 completes.",
  },
  {
    label: "context",
    title: "Preparation for an MRes on oncology digital twins",
    sub: "Swinburne University, Melbourne.",
  },
];

const WORDS = ["open code", "calibrated", "open data", "verified", "open methods", "versioned"];

export function Credits() {
  return (
    <section className="section flex flex-col gap-12 !pb-0" aria-labelledby="credits-title">
      <h2 id="credits-title" className="max-w-[760px] text-display2">
        Open code. Open data. Open to collaboration.
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {COLUMNS.map((c) => (
          <div key={c.label} className="rule-top flex flex-col gap-2">
            <p className="label">{c.label}</p>
            {c.href ? (
              <a href={c.href} className="break-words text-h2 underline decoration-chalk underline-offset-4 hover:decoration-ink">
                {c.title}
              </a>
            ) : (
              <p className="text-h2 text-ink">{c.title}</p>
            )}
            <p className="text-body text-slate">{c.sub}</p>
          </div>
        ))}
      </div>
      <Marquee words={WORDS} />
    </section>
  );
}
