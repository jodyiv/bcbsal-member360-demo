# BCBS AL — Member 360 Lakehouse Demo

**Built with IBM watsonx** | Demo code: `DEMO-BCBSAL-001`

> ⚠️ **Demonstration Environment** — All data is synthetic. No real member PII, claims data, or clinical information is used.

---

## Business Value Summary

The **BCBS AL Member 360 Lakehouse** demonstrates how a regional health insurer can break down data silos, unify structured and unstructured member data, and deliver AI-powered insights to care managers — using three IBM watsonx.data SaaS products working together.

**Why fund this?**
> *"The Lakehouse enables BCBS AL to create a Member 360 experience that combines structured claims and enrollment data with unstructured clinical content, delivering faster member insights, improved care-management effectiveness, and an AI-ready foundation without waiting for a multi-year platform transformation."*

---

## IBM Product Stack (All SaaS)

| Product | Role | Capability Demonstrated |
|---------|------|------------------------|
| **watsonx.data SaaS** | Iceberg Lakehouse Engine | Apache Iceberg tables on IBM Cloud Object Storage; Presto (OLAP SQL) + Spark (ETL/ML); time-travel queries; open format |
| **watsonx.data Integration SaaS** | Pipeline Engine | IBM App Connect; 100+ connectors; EDI 834/837, FHIR R4, NCPDP D.0; ingests all 6 source systems |
| **watsonx.data Intelligence SaaS** | Governance + AI Engine | IBM Knowledge Catalog auto-profiling; end-to-end lineage; HIPAA policy enforcement; NLP document vectorization; ML risk scoring |

---

## Demo Pages

| Route | Page | What it shows |
|-------|------|--------------|
| `/` | Executive Dashboard | KPIs, risk distribution donut, cost trend, HEDIS gap bar chart, high-risk alerts table, time-to-value milestones |
| `/ingestion` | Lakehouse Ingestion | 6 fragmented source systems → App Connect pipelines → Iceberg table registry; animated pipeline progress |
| `/member360` | Member 360 — Jane Smith | Unified member profile, AI assistant (5 preset questions), adherence bars, care gaps, clinical documents, cost trend |
| `/governance` | Governance & Lineage | End-to-end lineage graph, Knowledge Catalog table, HIPAA policy rules, Intelligence capability cards |
| `/architecture` | Architecture | Mermaid diagram of full stack, 3-product capability cards, component inventory table |

### Demo Scenario — "Why is Jane Smith high risk?"
1. Open `/member360`
2. Click any preset question button — the AI assistant responds in 1–2 seconds with a structured answer combining claims, pharmacy, care management, and clinical document evidence
3. Explore the adherence bars, care gap indicators, and clinical documents panel

---

## Quick Start (Local)

### Prerequisites
- Node.js 20+
- Python 3.11+

### 1. Setup
```bash
cd demo-bcbsal-member360
bash scripts/setup.sh
```

### 2. Start Backend
```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

### 3. Start Frontend
```bash
# In a new terminal
cd frontend
npm run dev
# Open http://localhost:3000
```

### 4. Verify
```bash
bash scripts/verify-demo.sh
```

---

## Environment Variables

Copy `.env.example` → `.env`. For mock mode (default), no credentials are required.

| Variable | Purpose | Required for Mock |
|----------|---------|-------------------|
| `DEMO_MODE` | `mock` (default) or `live` | No |
| `WXDATA_HOST` | watsonx.data SaaS endpoint | No (mock) |
| `WXDATA_API_KEY` | watsonx.data API key | No (mock) |
| `WXINTEGRATION_HOST` | watsonx.data Integration SaaS host | No (mock) |
| `WXINTELLIGENCE_HOST` | watsonx.data Intelligence SaaS host | No (mock) |
| `WATSONX_AI_API_KEY` | watsonx.ai API key (AI assistant live mode) | No (mock) |
| `WATSONX_AI_PROJECT_ID` | watsonx.ai Project ID | No (mock) |

---

## Container Deployment (OpenShift)

```bash
# DEPLOY_TARGET: openshift | BUILD_ARCH: arm64
docker build --platform linux/amd64 -t bcbsal-member360-frontend:latest -f Dockerfile.frontend ./frontend
docker build --platform linux/amd64 -t bcbsal-member360-backend:latest  -f Dockerfile.backend  ./backend
```

Or with Docker Compose:
```bash
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build
docker compose up
```

---

## Compliance

```bash
bash scripts/check-compliance.sh
```

All checks must pass before demo delivery:
- ✅ No PII or real client data
- ✅ DemoBanner visible on all pages
- ✅ No hardcoded credentials
- ✅ Carbon Design System v11 (g90 dark theme)
- ✅ UBI 9 base images (OpenShift-safe)
- ✅ All 4 documentation files present

---

*Demo Client Code: DEMO-BCBSAL-001 | Built with IBM watsonx | © IBM Corporation — Internal demonstration use only*
