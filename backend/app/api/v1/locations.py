from fastapi import APIRouter

from app.services.hetzner import list_locations

router = APIRouter()


@router.get("/", response_model=list[dict])
async def get_locations():
    """Return all available Hetzner datacenter locations (no auth required)."""
    return await list_locations()
