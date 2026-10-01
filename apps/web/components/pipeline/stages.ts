/** The luad-match pipeline. Every figure comes from the committed Phase 2 baseline or the Phase 3 rescore. */
export interface Stage {
  id: string;
  name: string;
  figure: string;
  unit: string;
  input: string;
  output: string;
  description: string;
}

export const STAGES: Stage[] = [
  {
    id: "01",
    name: "fetch",
    figure: "200",
    unit: "recruiting trials",
    input: "ClinicalTrials.gov API v2, condition lung adenocarcinoma, status recruiting",
    output: "data/raw/trials.json (1.4 MB)",
    description:
      "Pulls only the fields matching needs: titles, conditions, interventions and the free-text eligibility block.",
  },
  {
    id: "02",
    name: "parse",
    figure: "3,409",
    unit: "criteria",
    input: "200 raw trial records",
    output: "Inclusion and exclusion criteria, one per row, with regex features",
    description:
      "Splits each eligibility block into addressable criteria and tags genes, variants, ECOG ceilings and minimum age.",
  },
  {
    id: "03",
    name: "retrieve",
    figure: "50",
    unit: "candidates per patient",
    input: "Patient profile and the parsed corpus",
    output: "Top 50 trials by reciprocal rank fusion",
    description:
      "BM25 catches exact biomarker tokens; MiniLM embeddings catch paraphrase. Fused with RRF (k = 60).",
  },
  {
    id: "04",
    name: "judge",
    figure: "3.3 s",
    unit: "per criterion, phi4 on a T4",
    input: "One criterion and a compact patient summary",
    output: "Verdict, confidence, one-sentence reasoning, cited patient feature",
    description:
      "A local 14B model judges each criterion separately at temperature 0. Uncertain answers can be re-asked of an API model.",
  },
  {
    id: "05",
    name: "verify",
    figure: "2",
    unit: "corrections in the 43-criterion sample",
    input: "Each LLM judgment and the structured patient object",
    output: "Verified, rule-filled or abstained judgments",
    description:
      "Cited features are checked against the patient. Deterministic rules fill provable gaps. Untrustworthy judgments abstain.",
  },
  {
    id: "06",
    name: "rank",
    figure: "3",
    unit: "sections: committed, abstained, rejected",
    input: "Per-criterion judgments for every candidate trial",
    output: "reports/matches.md with evidence for every decision",
    description:
      "Trials are ordered by status, then by a weighted score where biomarker criteria count double.",
  },
];
