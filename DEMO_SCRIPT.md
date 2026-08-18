# Demo Script — BCBS AL Member 360 Lakehouse

**Demo Code:** DEMO-BCBSAL-001 | **Duration:** 20–30 minutes | **Platform:** IBM watsonx.data SaaS

---

## Pre-Demo Checklist

- [ ] Backend running: `cd backend && uvicorn main:app --port 8000` (confirm `http://localhost:8000/api/health` returns 200)
- [ ] Frontend running: `cd frontend && npm run dev` (confirm `http://localhost:3000` loads)
- [ ] Browser at `http://localhost:3000`, fullscreen, 1920×1080 or wider
- [ ] g90 dark theme rendering correctly (IBM Plex Sans font, dark grey background)
- [ ] Demo banner visible: "Demonstration Environment — All data is synthetic"
- [ ] Backup slides ready in case of technical issues
- [ ] Tab pre-opened to each page: `/`, `/ingestion`, `/member360`, `/governance`, `/architecture`

---

## Opening — The Business Problem (2 min)

**Navigate to:** `/` — Executive Dashboard

**Say:**
> "Let me start with the question your care managers ask every day: why is member Jane Smith high risk — and what should we do about it? Today, answering that question requires a care manager to log into six separate systems: enrollment for demographics, TriZetto for claims history, MedImpact for pharmacy adherence, CareEdge for active interventions, a provider directory for specialist contacts, and then a separate content management system to find clinical notes from the last hospital discharge. That investigation takes an average of 47 minutes — if the care manager can even find everything."

*Point to the KPI cards.*

> "These numbers on the executive dashboard are already telling a story. 3,847 high-risk members. 56,000 open HEDIS care gaps. An 8.2% 30-day readmission rate that the team has already brought down from 10.1%, but there's room to go further. The question is: how do you get there systematically?"

**Pause on the cost trend chart:**
> "And look at this cost trend — medical and pharmacy together are tracking upward. Not because the members are getting sicker; it's because we're finding out late. The insight lag is the problem."

---

## Step 1 — Fragmented Source Systems (3 min)

**Navigate to:** `/ingestion`

**Say:**
> "Here's the current state. Six disconnected systems — each one a silo. Care managers know the data is in here somewhere, but correlating across all six for a single member takes 47 minutes and produces a spreadsheet that goes stale within 24 hours."

*Point to the source system cards.*

> "The solution isn't to replace any of these systems. TriZetto, CareEdge, MedImpact — those are sticky, expensive to replace, and they're doing their jobs. The solution is to bring the data together without moving the systems."

**Click 'Run Document Ingestion' button:**
> "Watch the pipeline stages. IBM App Connect — part of watsonx.data Integration SaaS — pulls from each source using pre-built healthcare connectors: EDI 834, ANSI X12 837 for claims, NCPDP D.0 for pharmacy, FHIR R4 for provider data. The unstructured clinical documents — discharge summaries, referral letters, nurse notes — go through OCR and NLP enrichment before landing in a vector store."

*Watch the progress indicator advance.*

> "All of this lands in Apache Iceberg tables on IBM Cloud Object Storage. Open format — no vendor lock-in. If BCBS AL ever wanted to move to a different cloud, the data stays in Iceberg."

---

## Step 2 — Unified Member 360 (8 min — the "Wow Moment")

**Navigate to:** `/member360`

**Say:**
> "Now instead of 47 minutes across six systems, everything about Jane Smith is in a single screen. Demographics and coverage from Enrollware. Risk score of 87 — that's 94th percentile for her age-sex cohort — from the Intelligence risk model. Conditions pulled from ICD-10 codes in the claims. Providers from CAQH. Adherence bars from MedImpact. And clinical documents from the content repository, processed and vectorized so they're searchable."

*Scroll through the member profile, adherence bars, and care gaps.*

> "Notice these adherence bars. Empagliflozin at 52%. Carvedilol at 61%. The 80% threshold for HEDIS compliance is marked — both of these drugs are below it. And Empagliflozin isn't just a diabetes drug for this member; it provides cardio-renal protection for both her CHF and her CKD Stage 3. A 52% adherence rate on this drug is a readmission waiting to happen."

**Click the first preset question: "Show everything about Jane Smith"**

> "Let me ask the AI assistant the question we started with."

*Wait for response (1–2 seconds in mock mode).*

> "Notice what just happened. The system didn't go to six separate databases. It ran a Presto SQL query across the unified Iceberg lakehouse — structured claims, pharmacy PDC scores, care interventions — AND queried the vector store for relevant clinical documents. You're seeing the results from 8 clinical documents combined with 5 structured data sources, surfaced in under 2 seconds."

**Click: "What drives her risk score?"**

> "Now watch the reasoning. This isn't just a number — it's an explanation. The comorbidity triad. The specific adherence gaps. The cost trajectory. And look at this — it's quoting back the discharge summary from March: 'patient verbalized understanding but expressed concern about medication cost.' That language was buried in a PDF. The NLP model in watsonx.data Intelligence flagged that as an adherence risk predictor."

**Click: "What interventions should be prioritized?"**

> "And now the most valuable output — a ranked list of actions the care manager should take TODAY, with projected cost avoidance. The cost barrier for Empagliflozin — available through the medication assistance program — could move that PDC from 52% to over 80%, and that one intervention is projected to avoid $14,000 in downstream costs."

*Scroll to clinical documents.*

> "At the bottom, you can see the source documents. These are all indexed by watsonx.data Intelligence. The care manager can click any document to read the original. The AI assistant drew on 8 of these documents to generate that risk analysis — without the care manager having to search for them."

---

## Step 3 — Governance & Lineage (4 min)

**Navigate to:** `/governance`

**Say:**
> "Before leadership approves any AI-powered clinical tool, they need to answer a compliance question: can we prove where this data came from, who touched it, and who's allowed to see it? That's watsonx.data Intelligence."

*Point to the lineage flow.*

> "This is automatic end-to-end data lineage. Every transformation from the TriZetto source through Spark enrichment to the risk score BI view — automatically captured. No one had to document this manually. If a schema change happens in TriZetto, watsonx.data Intelligence shows you immediately which downstream tables and reports are affected."

*Point to the catalog table.*

> "Auto-generated data catalog. Every Iceberg table was profiled automatically on load: column-level statistics, PII detection, data quality scores. Look at the quality scores — the risk score table is at 99/100. That's the model that's driving care manager decisions, and it has evidence-based quality certification."

*Point to the policy rules table.*

> "HIPAA enforcement is built in. PHI masking. Row-level security so a care manager in Birmingham only sees their assigned members' full record. Audit logging on every PHI table access. This is governance that scales — it doesn't require a team of people manually tagging columns."

---

## Step 4 — Architecture & Investment Narrative (3 min)

**Navigate to:** `/architecture`

**Say:**
> "Let me show you the full picture."

*Walk through the 3-product stack cards.*

> "Three IBM SaaS products. One subscription, three capabilities. watsonx.data is the open Iceberg lakehouse — the common data foundation. watsonx.data Integration brings the data in from wherever it lives, including those legacy healthcare systems we're not replacing. watsonx.data Intelligence makes that data trustworthy, governed, and AI-ready."

> "The critical word in that last sentence is 'AI-ready.' Everything we just saw — the risk model, the document vectorization, the semantic search — that's the Intelligence layer today. When BCBS AL is ready to add a conversational care manager assistant built on watsonx.ai or watsonx Orchestrate, the lakehouse foundation is already there. You're not starting over. You're extending what we built in week 6."

---

## Close — The Business Case (1 min)

**Navigate back to:** `/` — Executive Dashboard

**Say:**
> "Let me leave you with the one sentence that captures why this matters:"

*Point to the value narrative block on the dashboard.*

> *"The Lakehouse enables BCBS AL to create a Member 360 experience that combines structured claims and enrollment data with unstructured clinical content, delivering faster member insights, improved care-management effectiveness, and an AI-ready foundation without waiting for a multi-year platform transformation."*

> "The IBM Client Engineering team can have the first business value — this Member 360 dashboard — live within 6 weeks. The same foundation that runs this dashboard is the foundation that will run every AI initiative BCBS AL pursues over the next five years. That's the investment case."

---

## FAQ Responses

| Question | Answer |
|----------|--------|
| "Is this HIPAA-compliant?" | Yes — PHI masking, row-level security, and full audit logging are native to watsonx.data Intelligence. See the Governance page. |
| "What happens to our existing systems?" | Nothing changes. TriZetto, CareEdge, MedImpact continue operating. App Connect reads from them; it doesn't replace them. |
| "How long to go live?" | 6 weeks to Member 360 dashboard (Sprint 1–3 in pilot plan); full AI assistant in 12 weeks. |
| "What if we want to add more data sources?" | App Connect has 100+ pre-built connectors. Adding a new source is days, not months. |
| "Can we run this on-premises?" | Yes — watsonx.data is available as a SaaS (this demo) or on Red Hat OpenShift (Cloud Pak for Data). Same product, different deployment model. |
| "What's the cost?" | IBM will provide a watsonx.data SaaS quote based on data volume and query volume. The pilot can be run on the Lite tier for evaluation. |
| "How does the AI know the answer is correct?" | The Intelligence lineage graph shows every data source the answer is grounded in. The response also shows confidence scores and source citations. |
| "Is our member data in IBM's cloud?" | Only if BCBS AL chooses to use IBM Cloud Object Storage. The architecture can be configured to use BCBS AL's own S3-compatible storage (including on-prem). |

---

*Demo Client Code: DEMO-BCBSAL-001 | Built with IBM watsonx | © IBM Corporation — Internal demonstration use only*
