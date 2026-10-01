"use client";

import type { Patient } from "@/lib/types";
import { Button } from "../ui/Button";
import { DataCard } from "../ui/DataCard";
import { Select } from "../ui/Select";
import { Tag } from "../ui/Tag";
import { Timeline } from "../ui/Timeline";

export interface PatientCardProps {
  patients: Patient[];
  patient: Patient;
  onSelect: (id: string) => void;
  onRun: () => void;
  runDisabled: boolean;
  running: boolean;
}

function fmt(n: number | null, unit: string): string {
  return n === null ? "not recorded" : `${n}${unit}`;
}

export function PatientCard({ patients, patient, onSelect, onRun, runDisabled, running }: PatientCardProps) {
  return (
    <aside className="panel flex flex-col gap-6 bg-cream p-6" aria-label="Patient profile">
      <Select
        label="patient"
        value={patient.id}
        onChange={(e) => onSelect(e.target.value)}
        options={patients.map((p) => ({ value: p.id, label: p.label }))}
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Tag variant="mono">{patient.kind}</Tag>
          <Tag>stage {patient.stage}</Tag>
          <Tag>ecog {patient.ecog}</Tag>
        </div>
        <p className="text-label text-ink">
          {patient.diagnosis}, {patient.age}, {patient.sex}
          {patient.smoking ? `, ${patient.smoking} smoker` : ""}
        </p>
        <p className="text-micro text-stone">{patient.note}</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="label">mutations</p>
        <ul className="flex flex-wrap gap-2">
          {patient.mutations.map((m) => (
            <li key={`${m.gene}-${m.short}`}>
              <Tag variant={m.strength === "strong" ? "strong" : "default"} title={`${m.gene} ${m.protein_change}`}>
                {m.gene} {m.short}
                {m.driver && <span className="rounded-pill bg-sage-ghost px-1.5 font-mono text-[10px] text-sage">DRIVER</span>}
              </Tag>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DataCard size="sm" value={fmt(patient.tmb, "")} unit="TMB, mut/Mb" noSource />
        <DataCard size="sm" value={fmt(patient.pd_l1, "%")} unit="PD-L1 TPS" noSource />
      </div>

      <div className="flex flex-col gap-3">
        <p className="label">treatment course</p>
        <Timeline items={patient.timeline} />
      </div>

      <Button variant="sage" onClick={onRun} disabled={runDisabled} aria-busy={running}>
        {running ? "Running match" : "Run match"}
      </Button>
    </aside>
  );
}
