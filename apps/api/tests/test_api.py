from fastapi.testclient import TestClient

from main import app

client = TestClient(app)
TCGA = "TCGA-05-4418-derived"


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "version": "0.1.0", "matcher": "mock"}


def test_patients_lists_three():
    r = client.get("/patients")
    assert [p["id"] for p in r.json()] == [TCGA, "SYN-EGFR-L858R", "SYN-BRCA1"]


def test_patient_profile_and_404():
    assert client.get(f"/patients/{TCGA}").json()["tmb"] == 4.6
    r = client.get("/patients/nope")
    assert r.status_code == 404 and "GET /patients" in r.json()["detail"]


def test_match_returns_phase3_ranking():
    r = client.post("/match", json={"patient_id": TCGA})
    assert r.status_code == 200
    trials = r.json()["trials"]
    assert [(t["nct_id"], t["status"], t["score"]) for t in trials] == [
        ("NCT04303780", "unresolved", 0.8625),
        ("NCT03600883", "unresolved", 0.7316),
        ("NCT03778229", "rejected", 0.5012),
    ]
    assert r.json()["summary"] == {"eligible": 0, "unresolved": 2, "abstained": 0, "rejected": 1}


def test_match_unknown_patient_and_bad_body():
    assert client.post("/match", json={"patient_id": "nope"}).status_code == 404
    assert client.post("/match", json={}).status_code == 422


def test_metrics_shape():
    m = client.get("/metrics").json()
    assert m["calibration"]["illustrative"] is True
    assert m["evidence"]["illustrative"] is False


def test_cors_allows_local_and_vercel_preview():
    for origin in ("http://localhost:3000", "https://rationale-git-main-alwaz.vercel.app"):
        r = client.get("/health", headers={"Origin": origin})
        assert r.headers.get("access-control-allow-origin") == origin
    r = client.get("/health", headers={"Origin": "https://evil.example.com"})
    assert "access-control-allow-origin" not in r.headers
