from fastapi import APIRouter
from config import settings

router = APIRouter(tags=["demo"])

@router.get("/config")
def demo_config():
    return {
        "mode": settings.demo_mode,
        "product_stack": {
            "lakehouse":    { "product": "watsonx.data SaaS",            "status": "connected" if settings.wxdata_host else "mock" },
            "integration":  { "product": "watsonx.data Integration SaaS","status": "connected" if settings.wxintegration_host else "mock" },
            "intelligence": { "product": "watsonx.data Intelligence SaaS","status": "connected" if settings.wxintelligence_host else "mock" },
        },
        "iceberg_tables": 10,
        "source_systems": 6,
        "total_members": 132000,
        "disclaimer": "Demonstration environment — synthetic data only."
    }

@router.post("/reset")
def demo_reset():
    return { "status": "reset", "message": "Demo state reset to initial synthetic data." }
