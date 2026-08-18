"""
BCBS AL Member 360 — FastAPI Backend
IBM watsonx.data SaaS · watsonx.data Integration SaaS · watsonx.data Intelligence SaaS
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import health, data, ai, demo

@asynccontextmanager
async def lifespan(app: FastAPI):
    mode = settings.demo_mode.upper()
    print(f"\n{'='*60}")
    print(f"  BCBS AL Member 360 Lakehouse Demo — {mode} mode")
    print(f"  watsonx.data SaaS: {settings.wxdata_host or 'NOT CONFIGURED (mock active)'}")
    print(f"  watsonx.data Intelligence: {settings.wxintelligence_host or 'NOT CONFIGURED (mock active)'}")
    print(f"{'='*60}\n")
    yield
    print("Backend shutting down.")

app = FastAPI(
    title="BCBS AL Member 360 — Lakehouse Demo API",
    description="Powered by watsonx.data SaaS · Integration · Intelligence",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(data.router,   prefix="/api/data")
app.include_router(ai.router,     prefix="/api/ai")
app.include_router(demo.router,   prefix="/api/demo")
