import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SubscriptionCreate(BaseModel):
    location: str
    server_type: Optional[str] = None  # ignored; the server type is chosen per location


class SubscriptionOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    server_id: Optional[uuid.UUID]
    status: str
    plan_name: str
    price_usd: float
    started_at: Optional[datetime]
    ends_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class CheckoutResponse(BaseModel):
    checkout_url: str
