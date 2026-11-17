from fastapi import APIRouter

from app.api.v1 import auth, locations, subscriptions, servers, vpn_configs, webhooks

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(locations.router, prefix="/locations", tags=["locations"])
router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
router.include_router(servers.router, prefix="/servers", tags=["servers"])
router.include_router(vpn_configs.router, prefix="/vpn-configs", tags=["vpn-configs"])
router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
