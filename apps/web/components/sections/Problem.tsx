import { DataCard } from "../ui/DataCard";
import { SectionHeader } from "../ui/SectionHeader";

/** Figures carry a visible "[source needed]" marker until citations are supplied. */
const FIGURES = [
  { value: "3-5", unit: "% of eligible cancer patients enroll in trials" },
  { value: "90", unit: "min manual review per patient" },
  { value: "90k", unit: "recruiting trials on ClinicalTrials.gov" },
];

export function Problem() {
  return (
    <section className="band bg-cream" aria-labelledby="problem-title">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start">
        <SectionHeader
          id="problem-title"
          label="the status quo"
          title="A molecular tumor board spends 90 minutes per patient on trial lookup."
          lede="Not because the trials are hidden. Because eligibility criteria are 40-page free-text documents, and matching them against a mutation profile is manual, repetitive, high-stakes work."
        />
        <div className="flex flex-col gap-3">
          {FIGURES.map((f) => (
            <DataCard key={f.unit} value={f.value} unit={f.unit} />
          ))}
        </div>
      </div>
    </section>
  );
}
