"""
AI service — dual mode: mock (default) | live (watsonx.ai SDK)
Simulates watsonx.data Intelligence NLP + foundation model reasoning
"""
import time
import random
from config import settings

# ── Mock responses — watsonx.data Intelligence SaaS narrative ────────────────
MOCK_RESPONSES = {
    "risk": {
        "text": "Jane Smith's risk score of 87/100 is driven by three interacting factors: (1) CHF + Type 2 Diabetes + CKD Stage 3 comorbidity triad — a clinically validated high-risk combination; (2) critical medication adherence gaps — Empagliflozin PDC 52%, Carvedilol PDC 61%, both below the 80% HEDIS threshold; (3) two inpatient admissions in the past 12 months ($34,200 combined), with a rising cost trajectory. Source: watsonx.data Intelligence risk model + Iceberg claims + pharmacy PDC tables.",
        "model": "meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
        "confidence": 0.94,
        "tokens": 312,
        "sources": ["member_risk_scores (Iceberg)", "clm_header (Iceberg)", "rx_adherence_pdc (Iceberg)", "Discharge Summary (vectorized)"]
    },
    "hospital": {
        "text": "Jane Smith has had 2 inpatient admissions in the last 12 months: (1) March 14–18, 2025 at Grandview Medical Center for CHF exacerbation ($21,400 allowed); (2) August 7–9, 2025 at UAB Hospital for Acute Kidney Injury in the context of CKD Stage 3 ($12,800 allowed). A nephrology referral was placed at discharge but remains unscheduled (140+ days overdue). Source: watsonx.data Iceberg claims table + Intelligence vectorized discharge summaries.",
        "model": "meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
        "confidence": 0.93,
        "tokens": 289,
        "sources": ["clm_header (Iceberg)", "Discharge Summary Mar 2025 (vectorized)", "Discharge Summary Aug 2025 (vectorized)"]
    },
    "care gap": {
        "text": "Jane Smith has 3 open HEDIS care gaps: (1) HbA1c not tested in 202 days — CDC measure at risk; (2) LDL test not completed this measurement year — SPC measure; (3) Retinal exam overdue by 26 months. Closing these gaps for the 847-member cohort with the same profile would improve BCBS AL's CDC composite NCQA Star rate by approximately 2.1 percentage points. Source: watsonx.data Intelligence care_gap_registry Iceberg table.",
        "model": "meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
        "confidence": 0.92,
        "tokens": 341,
        "sources": ["care_gap_registry (Iceberg)", "clm_diagnosis (Iceberg)", "rx_adherence_pdc (Iceberg)"]
    },
    "intervention": {
        "text": "Top 4 interventions ranked by predicted ROI: (1) Empagliflozin adherence — call within 48 hrs, connect to medication cost assistance ($15/mo vs $75/mo), projected $14K cost avoidance; (2) Nephrology appointment — schedule with Dr. Nguyen, referral 140 days overdue; (3) HbA1c lab order — closes HEDIS gap before Dec 31 measurement year end; (4) DSME diabetes education — telehealth option addresses transportation barrier (surfaced in Oct 2025 nurse notes via Intelligence NLP). Combined projected cost avoidance: $28–42K over 12 months.",
        "model": "meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
        "confidence": 0.89,
        "tokens": 398,
        "sources": ["care_interventions (Iceberg)", "rx_adherence_pdc (Iceberg)", "Case Manager Notes Oct 2025 (vectorized)", "Nephrology Referral (vectorized)"]
    },
    "default": {
        "text": "Jane Smith (MBR-JS-0042) is a 58-year-old female member with a risk score of 87/100 (High). Her profile includes CHF, Type 2 Diabetes, and CKD Stage 3 with 2 inpatient admissions in the last 12 months and 3 open HEDIS care gaps. The watsonx.data Iceberg lakehouse unified her record from 5 structured systems and 8 clinical documents. Ask a specific question for deeper analysis.",
        "model": "meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
        "confidence": 0.87,
        "tokens": 218,
        "sources": ["Unified Member 360 (Iceberg)", "doc_vector_index (Intelligence)"]
    }
}

def _mock_response(question: str) -> dict:
    q_lower = question.lower()
    key = next(
        (k for k in MOCK_RESPONSES if k in q_lower),
        "default"
    )
    r = MOCK_RESPONSES[key].copy()
    # Simulate latency
    latency_ms = random.randint(900, 1600)
    time.sleep(latency_ms / 1000)
    r["latency"] = latency_ms
    r["mode"] = "mock"
    return r

def _live_response(question: str, member_id: str) -> dict:
    """
    Live mode: call watsonx.ai SDK with watsonx.data context.
    ⚠ Requires ibm-watsonx-ai package and valid credentials in .env
    See ibm-watsonx-ai skill for verified SDK patterns before enabling.
    """
    try:
        from ibm_watsonx_ai import Credentials, APIClient
        from ibm_watsonx_ai.foundation_models import ModelInference

        # NOTE: invoke ibm-watsonx-ai skill for verified params before enabling
        # The SDK call below is illustrative only
        raise NotImplementedError(
            "Live mode requires ibm-watsonx-ai SDK + credentials. "
            "Uncomment and configure with ibm-watsonx-ai skill guidance."
        )
    except ImportError:
        raise RuntimeError("ibm-watsonx-ai not installed. Run: pip install ibm-watsonx-ai")

def generate_insight(question: str, member_id: str = "MBR-JS-0042") -> dict:
    if settings.demo_mode == "live":
        try:
            return _live_response(question, member_id)
        except Exception as e:
            print(f"[AI Service] Live mode failed ({e}), falling back to mock")
            return _mock_response(question)
    return _mock_response(question)
