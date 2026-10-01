"use client";

import { useState } from "react";
import { ClayLung } from "../three/dynamic";
import { SectionHeader } from "../ui/SectionHeader";

type Region = "right lung" | "left lung" | "trachea" | "bronchi" | "tumour site";

const CARDS = [
  {
    gene: "KRAS p.G12C",
    line: "Glycine to cysteine at codon 12 holds KRAS in its active, GTP-bound state. The new cysteine is what sotorasib and adagrasib bind.",
    tone: "ghost",
  },
  {
    gene: "EGFR p.L858R",
    line: "Leucine to arginine in the kinase domain switches EGFR on without its ligand. It responds to EGFR tyrosine kinase inhibitors.",
    tone: "ghost",
  },
  {
    gene: "STK11 loss",
    line: "Losing the LKB1 tumour suppressor alongside KRAS is associated with poorer response to PD-1 blockade.",
    tone: "ink",
  },
] as const;

const REGION_NOTE: Record<Region, string> = {
  "right lung": "Right lung: three lobes, slightly larger.",
  "left lung": "Left lung: two lobes, room for the heart.",
  trachea: "Trachea: the airway into both lungs.",
  bronchi: "Main bronchi: where the airway divides.",
  "tumour site": "Illustrative primary tumour site. Genes are positions in DNA, not places in the lung.",
};

export function Anatomy() {
  const [region, setRegion] = useState<Region | null>(null);
  return (
    <section className="band viewport-section flex flex-col gap-10 bg-cream" aria-labelledby="anatomy-title">
      <SectionHeader
        id="anatomy-title"
        label="where cancer starts"
        title="The genes you'll meet in this project, mapped onto the thing they break."
      />
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-2">
          <ClayLung height="clamp(320px, 85vw, 520px)" onRegion={setRegion} label="Interactive clay lungs; hover a region to name it" />
          <p className="min-h-[20px] text-center font-mono text-micro text-stone" aria-live="polite">
            {region ? REGION_NOTE[region] : "hover a region"}
          </p>
        </div>
        <ul className="flex flex-col gap-3">
          {CARDS.map((c) => (
            <li
              key={c.gene}
              className={`flex flex-col gap-2 rounded-md p-6 ${c.tone === "ink" ? "bg-ink text-paper" : "bg-sage-ghost text-slate"}`}
            >
              <span className={`font-mono text-data ${c.tone === "ink" ? "text-paper" : "text-ink"}`}>{c.gene}</span>
              <p className={`text-body ${c.tone === "ink" ? "text-paper" : "text-slate"}`}>{c.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
