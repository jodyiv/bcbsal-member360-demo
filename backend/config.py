"""Configuration — watsonx.data SaaS + Integration SaaS + Intelligence SaaS"""
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    demo_mode: str = "mock"   # mock | live

    # ── watsonx.data SaaS (Iceberg Lakehouse + Presto/Spark) ──────────────
    wxdata_host:         Optional[str] = None  # e.g. https://<instance>.lakehouse.cloud.ibm.com
    wxdata_api_key:      Optional[str] = None
    wxdata_instance_id:  Optional[str] = None
    wxdata_catalog:      str = "member360"
    wxdata_schema:       str = "member360"

    # ── watsonx.data Integration SaaS (App Connect pipelines) ─────────────
    wxintegration_host:    Optional[str] = None
    wxintegration_api_key: Optional[str] = None

    # ── watsonx.data Intelligence SaaS (IBM Knowledge Catalog) ────────────
    wxintelligence_host:    Optional[str] = None
    wxintelligence_api_key: Optional[str] = None

    # ── CORS ──────────────────────────────────────────────────────────────
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
