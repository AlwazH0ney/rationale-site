import { Pipeline } from "../pipeline/Pipeline";
import { SectionHeader } from "../ui/SectionHeader";

const NOISE = [
  ["retrieval", "BM25 and embeddings cut 200 recruiting trials to the 50 worth reading."],
  ["verification", "A judgment whose cited evidence contradicts the patient is set to unknown."],
  ["abstention", "Judgments that are uncertain or disputed are held for review, not committed."],
];

const EVIDENCE = [
  ["citation", "Every verdict names the patient feature it relied on."],
  ["rules", "Facts the structured profile settles are derived, not guessed: drug classes, genes, ECOG, age."],
  ["versioning", "Every LLM call is logged with model, prompt version, tokens and latency."],
];

function Column({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="rule-top text-h2">{title}</h3>
      <dl className="flex flex-col gap-3">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[110px_1fr] gap-3">
            <dt className="font-mono text-data text-stone">{k}</dt>
            <dd className="text-body text-slate">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function PipelineSection() {
  return (
    <section className="section flex flex-col gap-12" aria-labelledby="pipeline-title">
      <SectionHeader
        id="pipeline-title"
        label="how it works"
        title="Six stages. Open data in, ranked trials out."
        lede="Select a stage to see what goes in, what comes out, and the measured figure from the current baseline."
      />
      <Pipeline />
      <div className="grid gap-10 md:grid-cols-2">
        <Column title="Remove noise" rows={NOISE} />
        <Column title="Add evidence" rows={EVIDENCE} />
      </div>
    </section>
  );
}
