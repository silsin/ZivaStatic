import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api.deps import get_current_user
from app.config import settings
from app.database import get_db
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.subscription import CheckoutResponse, SubscriptionCreate, SubscriptionOut
from app.services.stripe_service import create_checkout_session

router = APIRouter()


@router.post("/", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    body: SubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Create a pending Subscription record
    subscription = Subscription(
        user_id=current_user.id,
        status="pending",
    )
    db.add(subscription)
    await db.flush()
    await db.refresh(subscription)

    # 2. Create Stripe checkout session
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

    # Cancel on Stripe if a stripe subscription id exists
    if subscription.stripe_subscription_id:
        import stripe as stripe_lib
        from app.config import settings as cfg

        stripe_lib.api_key = cfg.STRIPE_SECRET_KEY
        try:
            stripe_lib.Subscription.cancel(subscription.stripe_subscription_id)
        except Exception:
            pass  # Best-effort; still mark cancelled locally

    subscription.status = "cancelled"
    await db.commit()
