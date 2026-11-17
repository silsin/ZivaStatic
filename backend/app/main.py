import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1.router import router

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Static IP VPN SaaS",
    description="Automated static IP VPN provisioning via Hetzner Cloud",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:1475"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.on_event("startup")
async def on_startup() -> None:
    logger.info("Application started")


@app.get("/", tags=["health"])
async def health_check() -> dict:
    return {"status": "ok"}
