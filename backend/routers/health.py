from fastapi import APIRouter
from config import settings

router = APIRouter(tags=["health"])

@router.get("/health")
def health():
    return {
        "status": "ok",
        "mode": settings.demo_mode,
        "version": "1.0.0",
        "demo": "BCBS AL Member 360 Lakehouse",
        "ibm_products": {
            "watsonx_data_saas":         settings.wxdata_host or "mock (not configured)",
            "watsonx_data_integration":  settings.wxintegration_host or "mock (not configured)",
            "watsonx_data_intelligence": settings.wxintelligence_host or "mock (not configured)",
        },
        "disclaimer": "Demonstration environment — all data is synthetic."
    }
