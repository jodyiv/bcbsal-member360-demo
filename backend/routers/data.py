from fastapi import APIRouter, Query
from services.synthetic_data_service import get_dashboard_data, get_members, get_member_360

router = APIRouter(tags=["data"])

@router.get("/dashboard")
def dashboard():
    return get_dashboard_data()

@router.get("/members")
def members(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    risk_tier: str = Query(None)
):
    return get_members(page, page_size, search, risk_tier)

@router.get("/member/{member_id}")
def member_360(member_id: str):
    return get_member_360(member_id)

@router.get("/ingestion-status")
def ingestion_status():
    return {
        "enrollment": "completed", "claims": "completed",
        "provider":   "completed", "care":    "completed",
        "pharmacy":   "completed", "documents": "processing"
    }
