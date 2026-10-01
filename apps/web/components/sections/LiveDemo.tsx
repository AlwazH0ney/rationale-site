"use client";

import { useMatch } from "@/hooks/useMatch";
import { usePatient } from "@/hooks/usePatient";
import { PatientCard } from "../demo/PatientCard";
import { ResultsPanel } from "../demo/ResultsPanel";
import { SectionHeader } from "../ui/SectionHeader";

export function LiveDemo() {
  const { patients, patient, select, status, error } = usePatient();
  const match = useMatch();

  const onSelect = (id: string) => {
    select(id);
    match.reset();
  };

  return (
    <section id="demo" className="section viewport-section flex scroll-mt-8 flex-col gap-10" aria-labelledby="demo-title">
      <SectionHeader
        id="demo-title"
        label="try it"
        title="A TCGA-derived patient. The Phase 3 pipeline's recorded output."
        lede="Mutations come from TCGA-05-4418; the treatment history is constructed. Results are replayed from the pipeline run, not computed live."
      />
      {status === "error" && <p className="text-label text-ink">{error}</p>}
      {status === "loading" && <p className="text-label text-stone">Loading patients</p>}
      {patient && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <PatientCard
            patients={patients}
            patient={patient}
            onSelect={onSelect}
            onRun={() => match.run(patient.id)}
            runDisabled={match.status === "running" || match.status === "done"}
            running={match.status === "running"}
          />
          <ResultsPanel
            result={match.result}
            status={match.status}
            error={match.error}
            chips={patient.mutations.map((m) => `${m.gene} ${m.short}`)}
          />
        </div>
      )}
    </section>
  );
}
