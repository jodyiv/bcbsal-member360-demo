# Pilot Plan — BCBS AL Member 360 Lakehouse

**Client Code:** DEMO-BCBSAL-001 | **Duration:** 4 Weeks | **IBM Products:** watsonx.data SaaS · Integration SaaS · Intelligence SaaS

---

## Executive Summary

This pilot delivers the Member 360 lakehouse foundation in 4 weeks using IBM Client Engineering sprint methodology. The first business value — a unified member view replacing the current 47-minute multi-system investigation — is delivered by **Week 3**. The same foundation supports HEDIS automation and AI assistance without additional platform investment.

---

## Objectives

| # | Objective | KPI | Target |
|---|-----------|-----|--------|
| 1 | Unify member data across 6 source systems in a single watsonx.data Iceberg lakehouse | Time to retrieve complete member record | < 4 minutes (from 47 min baseline) |
| 2 | Automate HEDIS care gap identification using Intelligence NLP + claims data | Open care gap detection accuracy | ≥ 95% (vs. manual review) |
| 3 | Demonstrate AI-readiness for future care management assistant | AI Readiness Score | ≥ 80/100 by end of pilot |

---

## Success Criteria

| Metric | Baseline | Target | Measurement Method |
|--------|----------|--------|--------------------|
| Time to complete member investigation | 47 min | < 4 min | Care manager timed workflow test |
| Data sources unified in lakehouse | 0 | 6 | watsonx.data catalog asset count |
| HEDIS gap detection rate | Manual, unreliable | ≥ 95% | Retrospective sample validation |
| Member risk model accuracy | N/A (no model) | AUC ≥ 0.78 | 90-day readmission holdout test |
| Data quality score (avg) | Unknown | ≥ 90/100 | watsonx.data Intelligence quality dashboard |
| Care manager adoption | 0% | ≥ 70% daily active | Application analytics |

---

## Sprint Plan

### Sprint 0 — Week 0 (2–3 Days): Environment & Assessment

**Goal:** Provision IBM SaaS services; assess source system connectivity.

| Task | Owner | Duration |
|------|-------|----------|
| Provision watsonx.data SaaS (Standard tier) | IBM CE + BCBS AL IT | Day 1 |
| Provision watsonx.data Integration SaaS | IBM CE + BCBS AL IT | Day 1 |
| Provision watsonx.data Intelligence SaaS | IBM CE + BCBS AL IT | Day 1 |
| Source system access assessment (QNXT, CareEdge, MedImpact, CAQH, Content Repo) | IBM CE + BCBS AL Data Team | Days 1–2 |
| Define canonical Member 360 Iceberg schema | IBM CE + BCBS AL Data Architect | Day 2 |
| Identify 5 representative high-risk members for UAT (de-identified) | BCBS AL Care Management | Day 3 |

**Exit Criteria:** All 3 IBM SaaS services provisioned; schema draft approved; 5 UAT members identified.

---

### Sprint 1 — Weeks 1–2: Data Pipeline + Iceberg Foundation

**Goal:** All 6 source systems ingesting into Iceberg tables; care manager can query unified member record.

| Task | Owner | Duration |
|------|-------|----------|
| Build App Connect flow: Enrollware → mbr_enrollment Iceberg | IBM CE Integration | Days 1–2 |
| Build App Connect flow: TriZetto QNXT → clm_header + clm_diagnosis Iceberg | IBM CE Integration | Days 2–4 |
| Build App Connect flow: CAQH ProView → provider_directory Iceberg | IBM CE Integration | Day 3 |
| Build App Connect flow: CareEdge → care_interventions Iceberg | IBM CE Integration | Day 4 |
| Build App Connect flow: MedImpact → rx_claims Iceberg | IBM CE Integration | Days 4–5 |
| Build Spark job: PDC calculation → rx_adherence_pdc Iceberg | IBM CE Data Eng | Days 4–5 |
| Build Presto Member 360 view (JOIN across 5 tables) | IBM CE Data Eng | Days 6–7 |
| Configure Intelligence auto-profiling on all tables | IBM CE Intelligence | Day 7 |
| Validate: care manager queries Jane Smith-equivalent member in < 4 min | BCBS AL Care Manager | Day 8 |

**Exit Criteria:** Presto query returns unified member record; all 5 structured Iceberg tables populated; Intelligence catalog shows all assets.

---

### Sprint 2 — Week 3: Documents + Governance + Member 360 UI

**Goal:** Clinical documents indexed; governance policies enforced; Member 360 dashboard live.

| Task | Owner | Duration |
|------|-------|----------|
| Build Intelligence NLP pipeline: Content Repo → doc_vector_index | IBM CE AI/ML | Days 1–3 |
| Train/configure Intelligence risk scoring model | IBM CE AI/ML | Days 2–4 |
| Implement HIPAA policy rules in Intelligence Policy Engine | IBM CE Governance | Days 2–3 |
| Deploy Member 360 Carbon React frontend to IBM Cloud | IBM CE Dev | Days 3–4 |
| Connect AI assistant to Intelligence vector search + Iceberg | IBM CE Dev | Days 4–5 |
| Conduct UAT with 3 care managers (5 UAT member records) | BCBS AL Care Mgmt | Days 4–5 |
| Capture and address UAT feedback | IBM CE + BCBS AL | Day 5 |

**Exit Criteria:** Care managers complete 5 end-to-end member investigations using the dashboard; AI assistant answers all 5 preset questions correctly; HIPAA policy rules validated.

---

### Sprint 3 — Week 4: Hardening + KT + Roadmap

**Goal:** Production-ready configuration; BCBS AL team can operate independently; roadmap defined.

| Task | Owner | Duration |
|------|-------|----------|
| Performance optimization (Presto query tuning, Z-order, partitioning) | IBM CE | Days 1–2 |
| Security review (PHI masking, audit log validation) | BCBS AL Security + IBM CE | Days 1–2 |
| Load testing (132K member queries under peak load) | IBM CE | Day 2 |
| Runbook documentation: pipeline operations, incident response | IBM CE | Days 2–3 |
| Knowledge transfer: watsonx.data admin training (4 hours) | IBM CE → BCBS AL IT | Day 3 |
| Knowledge transfer: Intelligence catalog administration (2 hours) | IBM CE → BCBS AL Data Team | Day 3 |
| Executive readout: pilot results vs. success criteria | IBM CE + BCBS AL Leadership | Day 4 |
| Post-pilot roadmap: HEDIS automation, AI assistant expansion, watsonx.ai LLM | IBM CE | Day 4 |
| Pilot closeout and handover | IBM CE | Day 5 |

**Exit Criteria:** All success criteria met; runbooks delivered; executive readout completed; post-pilot roadmap approved.

---

## Team Composition

| Role | Person | Allocation |
|------|--------|------------|
| IBM Tech Sales Lead | TBD | 25% |
| IBM Client Engineer — Integration | TBD | 100% |
| IBM Client Engineer — Data Engineering | TBD | 100% |
| IBM Client Engineer — AI/ML (Intelligence) | TBD | 75% |
| BCBS AL Data Architect | TBD | 50% |
| BCBS AL Care Management SME | TBD | 25% |
| BCBS AL IT / Security | TBD | 25% |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| TriZetto QNXT API access delayed | Medium | High | Pre-provision access in Sprint 0; fallback to file-based EDI export |
| PHI de-identification for UAT takes longer than expected | Medium | Medium | Start process in Sprint 0; use fully synthetic data for initial testing |
| Content Repo document format variability | Medium | Medium | Sample 50 documents in Sprint 0; adjust NLP pipeline accordingly |
| Care manager adoption resistance | Low | High | Involve care managers in UAT design from Sprint 0 |
| IBM SaaS provisioning delays | Low | High | Submit request 1 week before pilot start |

---

## Post-Pilot Roadmap

| Phase | Timeframe | Capability | IBM Products |
|-------|-----------|------------|--------------|
| Phase 2 | Months 2–3 | HEDIS gap automation: alerts, workflows, NCQA reporting | watsonx.data Intelligence + CP4BA |
| Phase 3 | Months 3–5 | AI care management assistant (conversational) | watsonx.ai + watsonx Orchestrate |
| Phase 4 | Months 5–8 | Predictive model expansion: readmission, ER utilization, chronic disease progression | watsonx.ai AutoAI + watsonx.data |
| Phase 5 | Months 8–12 | Enterprise data product catalog: self-service analytics for all teams | watsonx.data Intelligence (full) |
