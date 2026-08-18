/**
 * watsonx.ai mock responses — Member 360 AI Assistant
 * watsonx.data SaaS · watsonx.data Integration SaaS · watsonx.data Intelligence SaaS
 *
 * Keyed on partial question text (case-insensitive match in watsonxService.js)
 * Sources: structured = watsonx.data Iceberg tables; unstructured = watsonx.data Intelligence vectorized docs
 */

const BASE_META = {
  model: 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8',
  latency: 1142,
  tokens: 387,
  confidence: 0.91,
  mode: 'mock'
}

export const WATSONX_MOCK_RESPONSES = {

  // ── "show everything" ──────────────────────────────────────────────────────
  'show everything': {
    ...BASE_META,
    text: `Member 360 Summary — Jane Smith (MBR-JS-0042)

DEMOGRAPHICS & COVERAGE
• Age: 58 | Female | Individual + Spouse plan (BlueCross Blue Shield AL PPO Plus)
• Coverage effective: 01/01/2019 | PCP: Dr. Raymond Castillo, MD (Cardiology / Internal Medicine)
• Risk Score: 87 / 100 (HIGH) — driven by multi-chronic condition profile

CHRONIC CONDITIONS (ICD-10 from Claims + Clinical Notes)
• Type 2 Diabetes Mellitus (E11.9) — diagnosed 2017, poorly controlled (HbA1c 8.4%)
• Congestive Heart Failure (I50.9) — diagnosed 2022, EF 38% per discharge summary
• Stage 3 Chronic Kidney Disease (N18.3) — eGFR trending downward (52 → 44 over 12 months)
• Hypertension (I10) — medication-controlled but BP consistently elevated in nursing notes

RECENT UTILIZATION (Last 12 Months — watsonx.data Claims Iceberg Table)
• 2 inpatient admissions ($34,200 total cost): CHF exacerbation (Mar 2025), AKI complication (Aug 2025)
• 1 ED visit (Nov 2025) — chest pain, ruled out MI
• 14 specialist visits | 6 PCP visits | 3 imaging encounters
• Total 12-month allowed cost: $78,450 (94th percentile for age-sex cohort)

PHARMACY (watsonx.data Pharmacy Source)
• 6 active medications; 2 critical adherence gaps:
  – Empagliflozin (SGLT-2 inhibitor) — 52% PDC (gap opens diabetes AND CKD protection)
  – Carvedilol (beta-blocker for CHF) — 61% PDC (below 80% HEDIS threshold)
• Metformin, Lisinopril, Furosemide, Atorvastatin — adherent (≥80%)

OPEN CARE MANAGEMENT INTERVENTIONS
• CHF Transitions of Care Program (enrolled Oct 2025) — 2 of 6 touchpoints completed
• Diabetes Education Referral — pending scheduling since Jul 2025
• Nephrology Referral — approved, no appointment booked

CARE GAPS (HEDIS-Related)
• HbA1c not tested in 180+ days (Comprehensive Diabetes Care — CDC measure)
• LDL not tested in 12 months (Statin Use in Persons with CVD — SPC measure)
• Annual retinal exam overdue by 14 months

All data retrieved from watsonx.data Iceberg lakehouse (SaaS) — structured tables (claims, enrollment, pharmacy, care management) + unstructured clinical documents vectorized via watsonx.data Intelligence.`,
    sources: [
      { name: 'Claims Iceberg Table', type: 'structured' },
      { name: 'Enrollment System', type: 'structured' },
      { name: 'Pharmacy PDC Table', type: 'structured' },
      { name: 'Care Management DB', type: 'structured' },
      { name: 'Discharge Summary (Mar 2025)', type: 'unstructured' },
      { name: 'Discharge Summary (Aug 2025)', type: 'unstructured' },
      { name: 'Nephrology Referral (Oct 2025)', type: 'unstructured' },
      { name: 'Nurse Notes (Nov 2025)', type: 'unstructured' }
    ]
  },

  // ── "risk score" / "why is" / "high risk" ────────────────────────────────
  'risk': {
    ...BASE_META,
    latency: 1089,
    tokens: 312,
    confidence: 0.94,
    text: `Risk Score Analysis — Jane Smith | Score: 87/100 (HIGH)

The risk score is computed by the watsonx.data Intelligence predictive model against the member's unified Iceberg lakehouse record. Three primary drivers account for 84% of the score:

1. MULTI-CHRONIC CONDITION INTERACTION (38 pts)
   Congestive Heart Failure + Type 2 Diabetes + CKD Stage 3 is a clinically validated high-risk triad. Each condition amplifies the others' progression risk. The August 2025 discharge summary documents declining eGFR (44 mL/min/1.73m²) concurrent with CHF decompensation — a recognized predictor of 90-day readmission.

2. MEDICATION NON-ADHERENCE (27 pts)
   Empagliflozin PDC of 52% is clinically significant: this drug provides both glycemic control AND cardio-renal protection (DAPA-HF/EMPEROR-Reduced evidence). Carvedilol PDC of 61% creates CHF decompensation risk. Together these gaps predict a 2.3× higher readmission probability vs. adherent peers (internal cohort analysis).

3. RISING UTILIZATION TRAJECTORY (19 pts)
   Two inpatient admissions in 12 months with a combined cost of $34,200. The claims trend shows accelerating spend: $28K → $48K → $78K over 3 years. The watsonx.data time-series model flags this trajectory as predictive of $95–110K spend in the next 12 months without intervention.

CLINICAL DOCUMENT EVIDENCE (watsonx.data Intelligence)
The March 2025 discharge summary includes this unstructured note:
  "Patient discharged with instructions to follow up with cardiology within 7 days. Medication reconciliation completed. Patient verbalized understanding but expressed concern about medication cost."
This language pattern correlates with adherence failure in the Intelligence NLP model.

RECOMMENDED IMMEDIATE ACTIONS:
→ Outbound care manager call: address Empagliflozin cost barrier (co-pay assist programs available)
→ Schedule pending nephrology appointment before next PCP visit
→ Close HbA1c lab gap (CDC HEDIS measure at risk)`,
    sources: [
      { name: 'Risk Score Model (watsonx.data Intelligence)', type: 'structured' },
      { name: 'Claims Trend Table (Iceberg)', type: 'structured' },
      { name: 'Pharmacy PDC (watsonx.data)', type: 'structured' },
      { name: 'Discharge Summary Mar 2025', type: 'unstructured' },
      { name: 'Discharge Summary Aug 2025', type: 'unstructured' }
    ]
  },

  // ── "hospital" / "inpatient" / "admission" ────────────────────────────────
  'hospital': {
    ...BASE_META,
    latency: 1201,
    tokens: 289,
    confidence: 0.93,
    text: `Recent Hospital Activity — Jane Smith (Last 18 Months)

ADMISSION 1 — March 14–18, 2025 (4 days)
Facility: Grandview Medical Center, Birmingham AL
Primary DRG: 291 — Heart Failure & Shock w/ MCC
Allowed Amount: $21,400 | Member Responsibility: $2,800
Discharge Disposition: Home with home health services (3 visits)

Key findings from watsonx.data Intelligence (discharge summary vectorization):
  • "BNP on admission 1,840 pg/mL, trending down to 620 at discharge"
  • "EF measured at 38% by echocardiogram — reduced from 45% (2022 baseline)"
  • "Transition of care referral placed to care management for CHF monitoring program"
  • "Medication reconciliation completed — Empagliflozin held during admission, patient instructed to restart"

ADMISSION 2 — August 7–9, 2025 (2 days)
Facility: UAB Hospital, Birmingham AL
Primary DRG: 682 — Renal Failure w/ CC
Allowed Amount: $12,800 | Member Responsibility: $1,600
Discharge Disposition: Home, no home health

Key findings from Intelligence vectorized notes:
  • "AKI likely volume-depleted in setting of recent Furosemide dose increase"
  • "Creatinine peaked at 2.8, trending down to 1.9 at discharge. Nephrology consultation recommended."
  • "Outpatient nephrology referral placed — patient to schedule within 30 days"
  • Note: Nephrology appointment has NOT been scheduled (140+ days post-referral — confirmed via care management table in watsonx.data)

ED VISIT — November 3, 2025 (6 hours)
Facility: Grandview Medical Center, Birmingham AL
Chief Complaint: Chest pain, dyspnea
Outcome: Chest pain ruled non-cardiac, discharged with PCP follow-up instruction
Cost: $3,240

READMISSION RISK: ELEVATED
30-day readmission probability: 34% (watsonx.data Intelligence risk model)
Primary driver: Pending nephrology appointment + Carvedilol PDC gap`,
    sources: [
      { name: 'Inpatient Claims (Iceberg)', type: 'structured' },
      { name: 'ED Claims (Iceberg)', type: 'structured' },
      { name: 'Discharge Summary Mar 2025', type: 'unstructured' },
      { name: 'Discharge Summary Aug 2025', type: 'unstructured' },
      { name: 'Nurse Notes Nov 2025', type: 'unstructured' }
    ]
  },

  // ── "care gap" / "hedis" ──────────────────────────────────────────────────
  'care gap': {
    ...BASE_META,
    latency: 978,
    tokens: 341,
    confidence: 0.92,
    text: `Care Gap Analysis — Jane Smith | HEDIS Performance Impact

OPEN CARE GAPS (3 identified across watsonx.data claims + lab data):

1. COMPREHENSIVE DIABETES CARE — HbA1c TESTING (CDC Measure)
   Status: OPEN — Last HbA1c: June 4, 2025 (202 days ago)
   HEDIS threshold: test within 12 months
   Clinical context: Previous result 8.4% (above 9.0% threshold = "poor control")
   Recommended action: Order lab now; result informs Empagliflozin dosing decision
   Value at risk: This gap affects BCBS AL's NCQA Star rating for the CDC composite measure

2. STATIN USE IN PERSONS WITH CVD — LDL TESTING (SPC Measure)
   Status: OPEN — No LDL result in watsonx.data claims or lab tables in past 12 months
   HEDIS threshold: at least one LDL-C test per measurement year
   Member is on Atorvastatin 40mg (adherent per pharmacy PDC = 88%)
   Recommended action: Order lipid panel at next PCP visit (Dr. Castillo — scheduled Dec 12)

3. RETINAL EXAM — DIABETIC EYE DISEASE (CDC Sub-Measure)
   Status: OPEN — Last dilated retinal exam: September 2023 (26 months ago)
   HEDIS threshold: annual exam for members with diabetes
   Risk: Diabetic retinopathy is a leading cause of preventable blindness; CKD increases ocular risk
   Recommended action: Ophthalmology referral via care manager; can coordinate with nephrology visit

GAPS CLOSED IN LAST 12 MONTHS:
✓ Nephropathy Monitoring (uACR tested Aug 2025 during hospitalization)
✓ Blood Pressure Control (most recent reading 138/86 — borderline)
✓ Flu Vaccination (administered Oct 15, 2025)

HEDIS STAR IMPACT SUMMARY:
Closing the 3 open gaps for Jane and similar members in her cohort (est. 847 members with same gap profile) would improve BCBS AL's CDC composite measure rate by approximately 2.1 percentage points — potentially moving from 3.0 to 3.5 NCQA stars on this measure.

Data sourced from: watsonx.data Iceberg (claims, lab, immunization tables) + watsonx.data Integration pipeline from pharmacy system.`,
    sources: [
      { name: 'Claims Lab Data (Iceberg)', type: 'structured' },
      { name: 'Pharmacy PDC Table', type: 'structured' },
      { name: 'HEDIS Measure Engine', type: 'structured' },
      { name: 'Nurse Notes (HEDIS gap documented)', type: 'unstructured' }
    ]
  },

  // ── "intervention" / "prioritize" / "recommend" ───────────────────────────
  'intervention': {
    ...BASE_META,
    latency: 1318,
    tokens: 398,
    confidence: 0.89,
    text: `Intervention Prioritization — Jane Smith | Care Manager Recommendations

watsonx.data Intelligence has ranked interventions by predicted ROI and clinical urgency. All recommendations are grounded in claims history, clinical documents, and current care management records from the watsonx.data Iceberg lakehouse.

PRIORITY 1 — EMPAGLIFLOZIN ADHERENCE BARRIER REMOVAL (Impact: HIGH / Urgency: IMMEDIATE)
Root cause: March 2025 discharge summary documents patient concern about medication cost. The patient's current plan covers Empagliflozin at a $75/month copay.
Action: Care manager to call within 48 hours; connect to BCBS AL's Medication Cost Assistance Program (reduces copay to $15/month). Also evaluate manufacturer patient assistance via Boehringer Ingelheim.
Expected outcome: If PDC improves from 52% → ≥80%, readmission risk drops by an estimated 18% (CHF model, watsonx.data Intelligence cohort analysis). Annual cost avoidance: ~$14,000.

PRIORITY 2 — NEPHROLOGY APPOINTMENT CLOSURE (Impact: HIGH / Urgency: THIS WEEK)
The August 2025 discharge summary placed a nephrology referral — now 140+ days overdue. CKD Stage 3 with declining eGFR (52 → 44) and a recent AKI event creates compounding risk. Without nephrology management, Stage 4 CKD transition probability is elevated.
Action: Care manager to call member, identify scheduling barriers, and directly schedule with Dr. Patricia Nguyen (UAB Nephrology — already in-network, referral active).

PRIORITY 3 — HbA1c LAB ORDER (Impact: MEDIUM-HIGH / Urgency: THIS MONTH)
Lab not completed in 202 days; HEDIS measurement year ends Dec 31. Closing this gap:
  (a) Restores clinical visibility into diabetes control
  (b) Closes a Star-rating gap affecting ~847 similar members
Action: Message to PCP Dr. Castillo to add lab order to December 12 visit. Alternatively, order standing lab now.

PRIORITY 4 — DIABETES EDUCATION PROGRAM (Impact: MEDIUM / Urgency: 30 DAYS)
Referral has been open since July 2025 (161 days). Diabetes Self-Management Education (DSME) is associated with improved medication adherence and reduced hospitalizations in the CKD-DM comorbid population.
Action: Reschedule; consider telehealth option to reduce transportation barrier (patient noted transportation difficulty in October case manager notes — surfaced by watsonx.data Intelligence NLP).

COST AVOIDANCE SUMMARY:
Implementing all 4 interventions within 30 days is projected to avoid $28,000–$42,000 in downstream costs over 12 months (30-day readmission + ED avoidance + CKD progression delay).`,
    sources: [
      { name: 'Care Management Table (Iceberg)', type: 'structured' },
      { name: 'Claims Utilization Table', type: 'structured' },
      { name: 'Pharmacy PDC Table', type: 'structured' },
      { name: 'Discharge Summary Mar 2025', type: 'unstructured' },
      { name: 'Discharge Summary Aug 2025', type: 'unstructured' },
      { name: 'Case Manager Notes Oct 2025', type: 'unstructured' },
      { name: 'Referral Documents (Nephrology)', type: 'unstructured' }
    ]
  },

  // ── default fallback ───────────────────────────────────────────────────────
  default: {
    ...BASE_META,
    latency: 1050,
    tokens: 218,
    confidence: 0.87,
    text: `Member Insight — Jane Smith (MBR-JS-0042)

Based on the unified watsonx.data Iceberg lakehouse record, Jane Smith presents as a high-complexity member with multiple interacting chronic conditions. Her profile combines structured data from 5 source systems (enrollment, claims, pharmacy, provider network, care management) with 8 clinical documents vectorized and indexed by watsonx.data Intelligence.

Key facts:
• Risk Score: 87/100 (HIGH) — 94th percentile for age-sex cohort
• 2 inpatient admissions + 1 ED visit in last 12 months ($78,450 total cost)
• 3 open HEDIS care gaps affecting NCQA Star ratings
• 2 critical medication adherence gaps (Empagliflozin 52% PDC, Carvedilol 61% PDC)
• 1 overdue specialist referral (Nephrology — 140+ days)

Try these specific questions for deeper analysis:
  • "What drives her risk score?"
  • "Summarize recent hospital activity"
  • "Are there care gaps?"
  • "What interventions should be prioritized?"

Data surfaces from: watsonx.data SaaS (Iceberg lakehouse) · watsonx.data Integration SaaS (pipeline) · watsonx.data Intelligence SaaS (AI/NLP enrichment)`,
    sources: [
      { name: 'Unified Member 360 (watsonx.data)', type: 'structured' },
      { name: 'Clinical Documents (Intelligence NLP)', type: 'unstructured' }
    ]
  }
}
