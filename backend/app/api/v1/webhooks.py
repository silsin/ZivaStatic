import asyncio
import uuid
import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.server import Server
from app.models.subscription import Subscription
from app.services.stripe_service import verify_webhook
from app.services.hetzner import create_server_sync

logger = logging.getLogger(__name__)

router = APIRouter()


def _generate_rsa_keypair() -> tuple[str, str]:
    """Return (private_key_pem, public_key_openssh) as strings."""
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.backends import default_backend

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


@router.post("/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    body = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = verify_webhook(body, sig_header)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    if event["type"] == "checkout.session.completed":
        session_obj = event["data"]["object"]
        metadata = session_obj.get("metadata", {})
        subscription_id_str = metadata.get("subscription_id")
        location = metadata.get("location", "fsn1")

        if not subscription_id_str:
            logger.warning("Webhook checkout.session.completed missing subscription_id in metadata")
            return {"received": True}

        try:
            subscription_id = uuid.UUID(subscription_id_str)
        except ValueError:
            logger.error("Invalid subscription_id in Stripe metadata: %s", subscription_id_str)
            return {"received": True}

        result = await db.execute(
            select(Subscription).where(Subscription.id == subscription_id)
        )
        subscription: Subscription | None = result.scalar_one_or_none()
        if not subscription:
            logger.error("Subscription %s not found after Stripe checkout", subscription_id)
            return {"received": True}

        # Generate SSH keypair
        private_key_pem, public_key_openssh = _generate_rsa_keypair()

        # Create the Hetzner server (sync call wrapped in a thread)
        server_name = f"ip-{subscription_id_str[:8]}"
        hetzner_data = await asyncio.to_thread(
            create_server_sync,
            server_name,
            location,
            "cx22",
            public_key_openssh,
        )

        # Persist the Server record
        server = Server(
            user_id=subscription.user_id,
            hetzner_server_id=hetzner_data["hetzner_server_id"],
            name=server_name,
            ip_address=hetzner_data["ip_address"],
            location=location,
            status="provisioning",
            ssh_private_key=private_key_pem,
            root_password=hetzner_data.get("root_password"),
        )
        db.add(server)
        await db.flush()
        await db.refresh(server)

        # Update subscription record
        subscription.status = "active"
        subscription.server_id = server.id
        subscription.stripe_session_id = session_obj.get("id")
        subscription.stripe_subscription_id = session_obj.get("subscription")
        subscription.stripe_customer_id = session_obj.get("customer")

        await db.commit()

        # Fire the Celery provisioning task
        from app.tasks.provision_server import provision_server_task
        provision_server_task.delay(str(server.id))

        logger.info(
            "Checkout completed: subscription=%s server=%s ip=%s",
            subscription_id,
            server.id,
            hetzner_data["ip_address"],
        )

    return {"received": True}
