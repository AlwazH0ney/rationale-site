# rationale

The public site for **luad-match**, an uncertainty-aware, evidence-grounded clinical trial matcher
for lung adenocarcinoma. Research prototype. **Not for clinical use.**

```
apps/web   Next.js 14 (App Router) + TypeScript + Tailwind, react-three-fiber, Recharts, D3
apps/api   FastAPI (Python 3.11 in Docker)
scripts/   build_mock.py: regenerates demo data from the trial-matcher package
```

## Run it

```bash
pnpm install
pnpm --filter web dev                 # http://localhost:3000
pnpm --filter web test                # Vitest + Testing Library
pnpm --filter web test:coverage

cd apps/api
python -m venv .venv && .venv/Scripts/activate   # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn main:app --reload             # http://localhost:8000
pytest
```

The web app reads static JSON from `apps/web/public/mock/` by default. Set
`NEXT_PUBLIC_API_URL=http://localhost:8000` to read the same shapes from the API instead.

## Where the data comes from

`scripts/build_mock.py` writes identical files to `apps/web/public/mock/` and `apps/api/data/`:

| Data | Provenance |
|---|---|
| TCGA-05-4418-derived match | phi4 judgments from the Phase 2 Colab run, re-scored with Phase 3 verification, rules and abstention (`trial-matcher/reports/phase3_preview/evaluated_with.json`) |
| Synthetic EGFR and BRCA1 matches | Deterministic rule layer only (`trial_matcher.verify.derive_verdict`); criteria it cannot settle are marked `pending` |
| Evidence sunburst | Real: the 43 criterion judgments above, grouped by cited patient feature |
| Calibration and coverage-risk curves | **Illustrative** until the annotation set is labelled; labelled as such on the page |

```bash
TRIAL_MATCHER_DIR=/path/to/trial-matcher /path/to/trial-matcher/.venv/bin/python scripts/build_mock.py
```

## Swapping the mock for the live matcher

All routes go through `apps/api/matcher.py:get_matcher()`. Implement `LuadMatcher` there and change
that one function; `main.py` does not change.

## Deploy (configured, not deployed)

- **Web (Vercel):** `vercel.json` sets the build and install commands. In a monorepo, Vercel
  is most reliable with the project **Root Directory set to `apps/web`** in project settings;
  `outputDirectory` is ignored for Next.js projects.
- **API (Fly.io, Sydney):** `cd apps/api && fly deploy` uses `fly.toml` and the Dockerfile.
  Extra CORS origins: `ALLOWED_ORIGINS=https://example.org,...`. Vercel preview URLs
  (`*.vercel.app`) are allowed by default.

## Interaction and motion rules

Animation happens only on user action, except the hero lung's intro and idle rotation, the
tumour-site pulse, and the credits marquee (which pauses on hover and focus). Under
`prefers-reduced-motion`, all of it stops: Framer Motion via `MotionConfig reducedMotion="user"`,
3D via `useReducedMotion`, CSS via a global override.

3D zoom is pinch or ctrl/⌘ + wheel; a plain wheel keeps scrolling the page.

## Open content items

- S2 figures (3-5%, 90 min, 90k) show `[source needed]` until citations are supplied.
- S8 links the existing repo; add a LICENSE there before claiming MIT.
