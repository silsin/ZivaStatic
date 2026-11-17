import stripe
from app.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


async def create_checkout_session(
    user_email: str,
    subscription_id: str,
    location: str,
    success_url: str,
    cancel_url: str,
) -> str:
    """Create a Stripe Checkout Session in subscription mode and return the URL."""
    session = stripe.checkout.Session.create(
        mode="subscription",
        customer_email=user_email,
        line_items=[
            {
                "price": settings.STRIPE_PRICE_ID,
                "quantity": 1,
            }
        ],
        metadata={
            "subscription_id": subscription_id,
            "location": location,
        },
        success_url=success_url,
        cancel_url=cancel_url,
    )
    return session.url


def verify_webhook(payload: bytes, sig_header: str) -> stripe.Event:
    """Verify Stripe webhook signature and return the event.

    Raises ValueError if signature verification fails.
    """
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        return event
    except stripe.error.SignatureVerificationError as exc:
        raise ValueError(f"Invalid Stripe webhook signature: {exc}") from exc
