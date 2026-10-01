"""
rationale API. Week 1 serves recorded luad-match output through matcher.get_matcher().

    uvicorn main:app --reload        # from apps/api, serves on :8000
"""

from __future__ import annotations

import os

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from matcher import Matcher, get_matcher
from schemas import Health, MatchRequest, MatchResult, Patient, PatientSummary

VERSION = "0.1.0"

app = FastAPI(
    title="rationale API",
    version=VERSION,
    description="Clinical trial matching for lung adenocarcinoma. Research prototype. Not for clinical use.",
)

_extra = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", *_extra],
    allow_origin_regex=r"https://[a-z0-9-]+\.vercel\.app",
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health", response_model=Health)
def health(matcher: Matcher = Depends(get_matcher)) -> Health:
    return Health(status="ok", version=VERSION, matcher=matcher.name)


@app.get("/patients", response_model=list[PatientSummary])
def list_patients(matcher: Matcher = Depends(get_matcher)) -> list[dict]:
    return matcher.list_patients()


@app.get("/patients/{patient_id}", response_model=Patient)
def get_patient(patient_id: str, matcher: Matcher = Depends(get_matcher)) -> dict:
    patient = matcher.get_patient(patient_id)
    if patient is None:
        raise HTTPException(404, f"No patient '{patient_id}'. GET /patients lists the available ids.")
    return patient


@app.post("/match", response_model=MatchResult)
def match(req: MatchRequest, matcher: Matcher = Depends(get_matcher)) -> dict:
    if matcher.get_patient(req.patient_id) is None:
        raise HTTPException(404, f"No patient '{req.patient_id}'. GET /patients lists the available ids.")
    result = matcher.match(req.patient_id)
    if result is None:
        raise HTTPException(404, f"No match result for '{req.patient_id}'. Regenerate data with `pnpm mock`.")
    return result


@app.get("/metrics")
def metrics(matcher: Matcher = Depends(get_matcher)) -> dict:
    return matcher.metrics()
