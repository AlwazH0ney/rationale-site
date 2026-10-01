import { ComparisonTable } from "../ComparisonTable";
import { ClayCluster } from "../three/dynamic";
import { SectionHeader } from "../ui/SectionHeader";

const PROPERTIES = [
  {
    title: "Calibrated confidence",
    body: "Each criterion judgment carries a confidence that is meant to equal its observed accuracy. Temperature scaling and conformal prediction sets are built; fitting waits on the hand-annotated labels.",
  },
  {
    title: "Versioned evidence",
    body: "Every decision cites the criterion text and the patient feature it used, is checked against the structured profile, and is logged with the model and prompt version that produced it.",
  },
  {
    title: "Longitudinal state",
    body: "Treatment history already shapes eligibility: prior drug classes and progression are derived from it. Modelling state over time beyond that is the next phase.",
  },
];

export function Differentiation() {
  return (
    <section className="section flex flex-col gap-12" aria-labelledby="diff-title">
      <SectionHeader id="diff-title" label="our contribution" title="Three properties no existing matcher has together." />
      <div className="grid gap-8 md:grid-cols-3">
        {PROPERTIES.map((p) => (
          <article key={p.title} className="flex flex-col gap-3 border-t border-ink pt-5">
            <h3 className="text-h2">{p.title}</h3>
            <p className="text-body text-slate">{p.body}</p>
          </article>
        ))}
      </div>
      <ComparisonTable />
      <ClayCluster height={340} label="Clay molecular cluster; hover to rearrange into orbital shells" />
    </section>
  );
}
