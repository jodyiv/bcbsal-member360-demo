"""
Synthetic data service — seed=42 for reproducibility
All data is fictional; no real member PII
Simulates what watsonx.data Presto would return from Iceberg tables
"""
import random
from datetime import date, timedelta
from faker import Faker

fake = Faker()
Faker.seed(42)
random.seed(42)

FICTIONAL_COMPANIES = [
    "Apex Manufacturing AL", "NovaTech Solutions Inc", "BlueLine Logistics",
    "Meridian Financial Group", "Greenfield Healthcare Partners",
    "Pinnacle Energy LLC", "Atlas Retail Group", "Quantum Telecom AL",
    "Brightpath Insurance Services", "Ironbridge Construction"
]

CONDITIONS_POOL = [
    ("I50.9", "CHF"), ("E11.9", "Type 2 DM"), ("N18.3", "CKD Stage 3"),
    ("I10",   "HTN"), ("J44.9", "COPD"),       ("I25.10", "CAD"),
    ("E11.9", "DM"),  ("F32.9", "Depression"), ("I48.91", "A-Fib"),
    ("E78.5", "Hyperlipidemia")
]

def _risk_score():
    return random.choices(
        population=[random.randint(80, 99), random.randint(60, 79),
                    random.randint(40, 59), random.randint(10, 39)],
        weights=[4, 12, 30, 54]
    )[0]

def _random_date_past(days=365):
    delta = random.randint(1, days)
    return (date.today() - timedelta(days=delta)).isoformat()

def _generate_members(n=200):
    members = []
    for i in range(n):
        risk = _risk_score()
        cond_count = 1 if risk < 40 else 2 if risk < 60 else random.randint(2, 4)
        conditions = random.sample(CONDITIONS_POOL, min(cond_count, len(CONDITIONS_POOL)))
        members.append({
            "member_id": f"MBR-{fake.hexify('########').upper()}",
            "name": fake.name(),
            "age": random.randint(30, 78),
            "gender": random.choice(["Male", "Female"]),
            "plan_type": random.choice(["PPO Plus", "BlueSaver HMO", "BlueChoice PPO", "BlueAdvantage"]),
            "group": random.choice(FICTIONAL_COMPANIES),
            "risk_score": risk,
            "risk_tier": "High" if risk >= 80 else "Rising" if risk >= 60 else "Moderate" if risk >= 40 else "Low",
            "conditions": ", ".join([c[1] for c in conditions]),
            "pcp": f"Dr. {fake.last_name()}, MD",
            "care_manager": f"{fake.first_name()} {fake.last_name()}, RN" if risk >= 60 else None,
            "last_contact": _random_date_past(90),
            "status": "active",
            "email": f"member.{fake.user_name()}@example.com",
            "phone": f"(205) 555-{random.randint(1000,9999)}"
        })
    # Ensure Jane Smith is always present as index 0
    members[0] = {
        "member_id": "MBR-JS-0042",
        "name": "Jane Smith",
        "age": 58,
        "gender": "Female",
        "plan_type": "PPO Plus",
        "group": "Smith Consulting LLC",
        "risk_score": 87,
        "risk_tier": "High",
        "conditions": "CHF, Type 2 DM, CKD Stage 3",
        "pcp": "Dr. Castillo, MD",
        "care_manager": "Sarah Okonkwo, RN",
        "last_contact": (date.today() - timedelta(days=12)).isoformat(),
        "status": "active",
        "email": "jsmith.member@example.com",
        "phone": "(205) 555-0182"
    }
    return members

_MEMBERS = _generate_members(200)

def get_dashboard_data():
    high  = sum(1 for m in _MEMBERS if m["risk_score"] >= 80)
    rising= sum(1 for m in _MEMBERS if 60 <= m["risk_score"] < 80)
    mod   = sum(1 for m in _MEMBERS if 40 <= m["risk_score"] < 60)
    low   = sum(1 for m in _MEMBERS if m["risk_score"] < 40)
    return {
        "total_members": 132000,
        "high_risk_count": 3847,
        "rising_risk_count": 12104,
        "open_care_gaps": 56254,
        "readmission_rate": 8.2,
        "cost_pmpm": 892,
        "ai_readiness_score": 74,
        "sample_high_risk": [
            m for m in _MEMBERS if m["risk_score"] >= 75
        ][:8],
        "ingestion_status": {
            "enrollment": "completed", "claims": "completed",
            "provider": "completed",   "care": "completed",
            "pharmacy": "completed",   "documents": "processing"
        },
        "disclaimer": "All data is synthetic. watsonx.data SaaS demo environment."
    }

def get_members(page=1, page_size=20, search=None, risk_tier=None):
    members = _MEMBERS
    if search:
        q = search.lower()
        members = [m for m in members if q in m["name"].lower() or q in m["member_id"].lower()]
    if risk_tier:
        members = [m for m in members if m["risk_tier"].lower() == risk_tier.lower()]
    total = len(members)
    start = (page - 1) * page_size
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "members": members[start: start + page_size]
    }

def get_member_360(member_id: str):
    """Returns the Jane Smith record for demo; others return a generated record."""
    m = next((x for x in _MEMBERS if x["member_id"] == member_id), _MEMBERS[0])
    return {
        "member": m,
        "disclaimer": "All data is synthetic. watsonx.data Iceberg Lakehouse SaaS — DEMO environment.",
        "data_sources": [
            "watsonx.data SaaS — member360.enrollment (Iceberg)",
            "watsonx.data SaaS — member360.claims (Iceberg)",
            "watsonx.data SaaS — member360.pharmacy (Iceberg)",
            "watsonx.data SaaS — member360.care_interventions (Iceberg)",
            "watsonx.data Intelligence — doc_vector_index (vectorized clinical docs)"
        ]
    }
