"""
Build the site's mock data from the luad-match (trial-matcher) package.

Writes the same three files to apps/web/public/mock/ and apps/api/data/:
  patients.json        3 demo patients
  match-results.json   patient_id -> ranked trial result
  metrics.json         calibration / coverage-risk (illustrative) + evidence sunburst (real)

Provenance, so the site never shows invented pipeline output:
  - TCGA-05-4418-derived: the Phase 3 rescore of the Phase 2 phi4 run
    (trial-matcher/reports/phase3_preview/evaluated_with.json).
  - Two synthetic patients: no LLM run exists, so only the pipeline's
    deterministic layer (trial_matcher.verify.derive_verdict) is run for real;
    every criterion it cannot settle is marked "pending".
  - Calibration and coverage-risk curves are ILLUSTRATIVE until the
    annotation set is labelled and calibrators are fitted; they are flagged so.

Run with the trial-matcher virtualenv's Python:
    TRIAL_MATCHER_DIR=... <trial-matcher>/.venv/Scripts/python scripts/build_mock.py
"""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TM = Path(os.environ.get(
    "TRIAL_MATCHER_DIR", Path.home() / "OneDrive" / "Documents" / "Projects" / "trial-matcher"))
sys.path.insert(0, str(TM))

from trial_matcher.match import aggregate, criterion_weight, rank_trials  # noqa: E402
from trial_matcher.patient import (Mutation, PatientProfile, TreatmentEvent,  # noqa: E402
                                   example_patient_kras_g12c)
from trial_matcher.verify import derive_verdict  # noqa: E402

OUT_DIRS = [ROOT / "apps" / "web" / "public" / "mock", ROOT / "apps" / "api" / "data"]
UI_STATUS = {"eligible": "eligible", "unresolved": "unresolved", "abstained": "abstained",
             "ineligible": "rejected"}
VERDICT = {True: "met", False: "not_met", None: "unknown"}
DRIVER_GENES = {"KRAS", "EGFR", "STK11", "KEAP1", "RBM10", "TP53", "BRCA1", "BRAF", "ERBB2"}


# ---- Patients -----------------------------------------------------------------

def synthetic_egfr() -> PatientProfile:
    return PatientProfile(
        patient_id="SYN-EGFR-L858R", diagnosis="Lung adenocarcinoma", stage="IV",
        age_years=54, sex="FEMALE", ecog=0, smoking_status="never",
        histology="adenocarcinoma", brain_metastases=False,
        mutations=[Mutation("EGFR", "p.L858R", "Missense_Mutation", 0.38, True),
                   Mutation("TP53", "p.R273H", "Missense_Mutation", 0.35, False)],
        tmb=1.8, pd_l1_tps=5.0, msi_status="MSS", treatment_history=[])


def synthetic_brca1() -> PatientProfile:
    return PatientProfile(
        patient_id="SYN-BRCA1", diagnosis="Lung adenocarcinoma", stage="IV",
        age_years=67, sex="MALE", ecog=2, smoking_status="former",
        histology="adenocarcinoma", brain_metastases=None,
        mutations=[Mutation("BRCA1", "p.C61G", "Missense_Mutation", 0.47, False),
                   Mutation("TP53", "p.R175H", "Missense_Mutation", 0.41, True)],
        tmb=None, pd_l1_tps=None, msi_status=None,
        treatment_history=[TreatmentEvent(1, "carboplatin + pemetrexed", "2025-09-02",
                                          "2026-02-10", "PR", "completed")])


def timeline(p: PatientProfile) -> list[dict]:
    """Treatment events for the demo timeline: lines, progression, proposed next line."""
    items = [{"label": "diagnosis", "detail": f"stage {p.stage}", "kind": "event"}]
    for t in sorted(p.treatment_history, key=lambda e: e.line):
        items.append({"label": f"line {t.line}", "detail": t.drug, "date": t.start_date,
                      "kind": "line"})
        if t.discontinuation_reason == "progression":
            items.append({"label": "progression", "detail": f"best response {t.best_response}",
                          "date": t.end_date, "kind": "event"})
        elif t.end_date:
            items.append({"label": "completed", "detail": f"best response {t.best_response}",
                          "date": t.end_date, "kind": "event"})
    items.append({"label": f"line {p.current_line()}", "detail": "proposed: trial", "kind": "proposed"})
    return items


def patient_record(p: PatientProfile, kind: str, label: str, note: str) -> dict:
    """UI-shaped patient plus the raw profile the API returns."""
    return {
        "id": p.patient_id, "label": label, "kind": kind, "note": note,
        "diagnosis": p.diagnosis, "stage": p.stage, "age": p.age_years, "sex": p.sex.lower(),
        "ecog": p.ecog, "smoking": p.smoking_status, "brain_metastases": p.brain_metastases,
        "mutations": [{"gene": m.gene, "protein_change": m.protein_change,
                       "short": m.protein_change.removeprefix("p."),
                       "driver": m.gene in DRIVER_GENES,
                       "strength": "strong" if m.is_hotspot else "standard",
                       "vaf": m.tumor_vaf} for m in p.mutations],
        "tmb": p.tmb, "pd_l1": p.pd_l1_tps, "msi": p.msi_status,
        "next_line": p.current_line(),
        "timeline": timeline(p),
        "profile": p.to_dict(),
    }


# ---- Results ------------------------------------------------------------------

def _checks(c: dict) -> list[str]:
    out = []
    if c.get("verification_failed"):
        out.append("verification failed")
    elif (c.get("verification") or {}).get("status") == "verified":
        out.append("citation verified")
    if c.get("derived_by") == "rule":
        out.append(f"rule-filled: {c['derivation']['rule']}")
    elif c.get("rule_disagrees"):
        out.append("rule disagrees")
    elif c.get("derivation"):
        out.append(f"rule agrees: {c['derivation']['rule']}")
    return out


def ui_criterion(c: dict) -> dict:
    """Pipeline criterion result -> the demo's criterion row."""
    llm = c.get("api") or c.get("local")
    pending = c.get("pending", False)
    return {
        "kind": c["kind"], "idx": c["idx"], "text": c["text"],
        "verdict": "pending" if pending else VERDICT[c["eligible"]],
        "confidence": 0.0 if pending else round(float(c["confidence"]), 4),
        "passes": c["passes"],
        "action": (c.get("abstention") or {}).get("action", "commit"),
        "abstain_reason": (c.get("abstention") or {}).get("reason") if
        (c.get("abstention") or {}).get("action") == "abstain" else None,
        "decided_by": "none" if pending else c.get("derived_by", "llm"),
        "cited_feature": c["evidence"]["patient_feature"],
        "reasoning": c["reasoning"],
        "route": c.get("route", "local"),
        "biomarker": bool(c.get("is_biomarker")),
        "checks": _checks(c),
        "raw": None if llm is None else {"verdict": VERDICT[llm["eligible"]],
                                         "confidence": llm["confidence"]},
    }


def ui_trial(t: dict) -> dict:
    crits = [ui_criterion(c) for c in t["criteria"]]
    return {
        "nct_id": t["nct_id"], "title": t["title"], "phase": t.get("phase") or [],
        "interventions": [i if isinstance(i, str) else i.get("name") for i in t.get("interventions") or []],
        "status": UI_STATUS[t["status"]], "score": round(t["score"], 4),
        "retrieval_score": t.get("retrieval_score"),
        "counts": {"pass": t["n_pass"], "fail": t["n_fail"], "unknown": t["n_unknown"],
                   "abstained": t.get("n_abstained", 0),
                   "pending": sum(1 for c in crits if c["verdict"] == "pending")},
        "criteria": crits,
    }


def result_record(patient_id: str, trials: list[dict], source: dict) -> dict:
    ranked = [ui_trial(t) for t in rank_trials(trials)]
    summary = {s: sum(1 for t in ranked if t["status"] == s)
               for s in ("eligible", "unresolved", "abstained", "rejected")}
    return {"patient_id": patient_id, "source": source, "summary": summary, "trials": ranked}


def rule_layer_trial(p: PatientProfile, trial: dict) -> dict:
    """Run only the deterministic layer; unsettled criteria are pending, not guessed."""
    results = []
    for c in trial["criteria"]:
        d = derive_verdict(c, p)
        base = {"kind": c["kind"], "idx": c["idx"], "text": c["text"],
                "is_biomarker": bool((c.get("features") or {}).get("biomarkers")
                                     or (c.get("features") or {}).get("mutations")),
                "weight": criterion_weight(c), "route": "none", "local": None, "api": None,
                "abstention": {"action": "commit"}}
        if d is None:
            base.update({"eligible": None, "confidence": 0.0, "passes": None,
                         "pass_confidence": 0.5, "pending": True, "derived_by": "none",
                         "reasoning": "Not settled by a deterministic rule; awaits an LLM run.",
                         "evidence": {"patient_feature": "pending LLM run",
                                      "criterion_text": c["text"]}})
        else:
            passes = d.eligible if c["kind"] == "inclusion" else not d.eligible
            base.update({"eligible": d.eligible, "confidence": d.confidence, "passes": passes,
                         "pass_confidence": d.confidence if passes else 1 - d.confidence,
                         "derived_by": "rule", "derivation": d.to_dict(),
                         "reasoning": d.reason,
                         "evidence": {"patient_feature": f"rule {d.rule}",
                                      "criterion_text": c["text"]}})
        results.append(base)
    return {"nct_id": trial["nct_id"], "title": trial["title"], "phase": trial.get("phase"),
            "interventions": trial.get("interventions"), "retrieval_score": None,
            **aggregate(results), "criteria": results}


# ---- Metrics --------------------------------------------------------------------

def feature_category(c: dict) -> str:
    """Group a criterion's cited evidence into the patient feature it rests on."""
    if c.get("derived_by") == "rule":
        rule = c["derivation"]["rule"]
        return ("treatment history" if rule.startswith(("never_received", "received", "progressed"))
                else "mutations" if rule.startswith(("gene_", "variant_")) else
                "ECOG" if rule.startswith("ecog") else "age")
    f = (c["evidence"]["patient_feature"] or "").lower()
    for key, cat in (("not recorded", "not recorded"), ("mutation", "mutations"),
                     ("treatment", "treatment history"), ("ecog", "ECOG"), ("age", "age"),
                     ("brain", "brain metastases"), ("gender", "sex"), ("male", "sex"),
                     ("diagnosis", "diagnosis")):
        if key in f:
            return cat
    return "no feature cited"


def sunburst(evaluated: dict) -> dict:
    """Real evidence chain: patient feature -> criterion -> trial record."""
    groups: dict[str, list[dict]] = {}
    for t in evaluated["trials"]:
        for c in t["criteria"]:
            short = re.sub(r"\s+", " ", c["text"])[:64]
            leaf = {"name": t["nct_id"], "value": 1, "source": {
                "nct_id": t["nct_id"], "url": f"https://clinicaltrials.gov/study/{t['nct_id']}",
                "trial_title": t["title"], "criterion": f"{c['kind']} #{c['idx']}",
                "criterion_text": c["text"], "verdict": VERDICT[c["eligible"]],
                "decided_by": c.get("derived_by", "llm"),
                "cited_feature": c["evidence"]["patient_feature"]}}
            groups.setdefault(feature_category(c), []).append(
                {"name": f"{c['kind'][:3]} {c['idx']} · {short}", "children": [leaf]})
    return {"name": "TCGA-05-4418-derived", "children": [
        {"name": cat, "children": kids} for cat, kids in sorted(groups.items(), key=lambda kv: -len(kv[1]))]}


def metrics(evaluated: dict, baseline: dict) -> dict:
    xs = [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95]
    raw = [0.10, 0.12, 0.20, 0.26, 0.31, 0.38, 0.47, 0.55, 0.66, 0.78]
    cal = [0.06, 0.16, 0.24, 0.36, 0.44, 0.56, 0.63, 0.76, 0.84, 0.93]
    cov = [round(0.1 * i, 1) for i in range(1, 11)]
    risk_raw = [0.02, 0.03, 0.04, 0.05, 0.07, 0.09, 0.11, 0.14, 0.17, 0.21]
    risk_cal = [0.00, 0.01, 0.02, 0.03, 0.04, 0.06, 0.08, 0.10, 0.14, 0.21]
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "calibration": {
            "illustrative": True,
            "note": "Illustrative curve. Real reliability data lands when the 43-criterion "
                    "annotation set is labelled and calibrators are fitted.",
            "points": [{"confidence": x, "raw": r, "calibrated": c} for x, r, c in zip(xs, raw, cal)],
        },
        "coverage_risk": {
            "illustrative": True,
            "note": "Illustrative curve. Real coverage-risk data needs ground-truth labels.",
            "points": [{"coverage": c, "raw": a, "calibrated": b}
                       for c, a, b in zip(cov, risk_raw, risk_cal)],
        },
        "evidence": {
            "illustrative": False,
            "note": "Real: every criterion judgment in the TCGA-05-4418-derived Phase 3 run, "
                    "grouped by the patient feature it cites.",
            "tree": sunburst(evaluated),
        },
        "run": {
            "model": baseline["model"]["local"]["name"],
            "hardware": baseline["hardware"]["gpu"],
            "mean_criterion_s": baseline["speed"]["mean_criterion_s"],
            "n_criteria": baseline["corpus"]["n_criteria"],
            "prompt_version": baseline["run"]["prompt_version"],
        },
    }


def main() -> None:
    evaluated = json.loads((TM / "reports" / "phase3_preview" / "evaluated_with.json").read_text(encoding="utf-8"))
    baseline = json.loads((TM / "reports" / "baselines" / "phase2_2026-09-30" / "run_summary.json").read_text(encoding="utf-8"))
    trials = json.loads((TM / "data" / "processed" / "trials_parsed.json").read_text(encoding="utf-8"))

    tcga = example_patient_kras_g12c()
    egfr, brca = synthetic_egfr(), synthetic_brca1()
    patients = [
        patient_record(tcga, "tcga-derived", "TCGA-05-4418 (derived)",
                       "Mutations from TCGA-05-4418; treatment history constructed for the demo."),
        patient_record(egfr, "synthetic", "Synthetic EGFR L858R",
                       "Synthetic never-smoker, treatment-naive."),
        patient_record(brca, "synthetic", "Synthetic BRCA1",
                       "Synthetic. TMB, PD-L1 and brain imaging not recorded."),
    ]
    pp = evaluated.get("postprocess") or {}
    results = {
        tcga.patient_id: result_record(tcga.patient_id, evaluated["trials"], {
            "kind": "phase3_rescore",
            "description": "phi4 judgments from the Phase 2 Colab run (T4), re-scored with "
                           "Phase 3 verification, rules and abstention.",
            "model": evaluated["backends"]["local"]["model"],
            "prompt_version": evaluated["prompt_version"],
            "postprocess": pp, "generated_at": evaluated.get("rescored_at")}),
    }
    for p in (egfr, brca):
        results[p.patient_id] = result_record(p.patient_id, [rule_layer_trial(p, t) for t in trials], {
            "kind": "rule_layer_only",
            "description": "Deterministic layer only (rules over the structured profile). "
                           "Criteria it cannot settle are pending an LLM run.",
            "model": None, "prompt_version": None, "postprocess": {"verify": True},
            "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds")})

    files = {"patients.json": patients, "match-results.json": results,
             "metrics.json": metrics(evaluated, baseline)}
    for d in OUT_DIRS:
        d.mkdir(parents=True, exist_ok=True)
        for name, data in files.items():
            (d / name).write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for pid, r in results.items():
        print(f"{pid:<22} {r['source']['kind']:<16} {r['summary']}  "
              + ", ".join(f"{t['nct_id']} {t['status']} {t['score']:.3f}" for t in r["trials"]))
    print("wrote", ", ".join(files), "to", ", ".join(str(d.relative_to(ROOT)) for d in OUT_DIRS))


if __name__ == "__main__":
    main()
