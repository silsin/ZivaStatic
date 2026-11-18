import asyncio
import uuid
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend

from app.api.deps import get_current_user
from app.config import settings
from app.database import get_db
from app.models.server import Server
from app.models.subscription import Subscription
from app.models.user import User
from app.models.price_override import PriceOverride
from app.schemas.subscription import CheckoutResponse, SubscriptionCreate, SubscriptionOut
from app.services.stripe_service import create_checkout_session
from app.services.hetzner import create_server_sync

logger = logging.getLogger(__name__)

router = APIRouter()


def _generate_rsa_keypair() -> tuple[str, str]:
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend(),
    )
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.OpenSSH,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("utf-8")
    public_openssh = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.OpenSSH,
        format=serialization.PublicFormat.OpenSSH,
    ).decode("utf-8")
    return private_pem, public_openssh


@router.post("/", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    body: SubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Look up price override for this location
    price_result = await db.execute(
        select(PriceOverride).where(
            PriceOverride.location_name == body.location,
            PriceOverride.is_active == True,
        )
    )
    price_override = price_result.scalar_one_or_none()
    price_usd = price_override.price_usd if price_override else 9.99

    # 2. Create a pending Subscription record
    subscription = Subscription(
        user_id=current_user.id,
        status="pending",
        plan_name="Static IP VPN",
        price_usd=price_usd,
    )
    db.add(subscription)
    await db.flush()
    await db.refresh(subscription)

    # 3. Stripe disabled — bypass payment and provision directly
    if not settings.STRIPE_ENABLED:
        logger.info("Stripe disabled — provisioning server directly for subscription %s", subscription.id)

        private_key_pem, public_key_openssh = _generate_rsa_keypair()
        server_name = f"vpn-{str(subscription.id)[:8]}"

        hetzner_data = await asyncio.to_thread(
            create_server_sync,
            server_name,
            body.location,
            "cx22",
            public_key_openssh,
        )

        server = Server(
            user_id=current_user.id,
            hetzner_server_id=hetzner_data["hetzner_server_id"],
            name=server_name,
            ip_address=hetzner_data["ip_address"],
            location=body.location,
            status="provisioning",
            ssh_private_key=private_key_pem,
            root_password=hetzner_data.get("root_password"),
        )
        db.add(server)
        await db.flush()
        await db.refresh(server)

        subscription.status = "active"
        subscription.server_id = server.id
        await db.commit()

        from app.tasks.provision_server import provision_server_task
        provision_server_task.delay(str(server.id))

        return CheckoutResponse(checkout_url=f"{settings.FRONTEND_URL}/dashboard?payment=success")

    # 4. Stripe enabled — create checkout session
    success_url = f"{settings.FRONTEND_URL}/dashboard?payment=success"
    cancel_url = f"{settings.FRONTEND_URL}/dashboard?payment=cancelled"

    checkout_url = await create_checkout_session(
        user_email=current_user.email,
        subscription_id=str(subscription.id),
        location=body.location,
        success_url=success_url,
        cancel_url=cancel_url,
    )

    return CheckoutResponse(checkout_url=checkout_url)


@router.get("/", response_model=list[SubscriptionOut])
async def list_subscriptions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Subscription).where(Subscription.user_id == current_user.id)
    )
    return result.scalars().all()


@router.delete("/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_subscription(
    subscription_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Subscription).where(
            Subscription.id == subscription_id,
            Subscription.user_id == current_user.id,
        )
    )
    subscription: Subscription | None = result.scalar_one_or_none()
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")

    if subscription.stripe_subscription_id:
        import stripe as stripe_lib
        stripe_lib.api_key = settings.STRIPE_SECRET_KEY
        try:
            stripe_lib.Subscription.cancel(subscription.stripe_subscription_id)
        except Exception:
            pass

    subscription.status = "cancelled"
    await db.commit()
