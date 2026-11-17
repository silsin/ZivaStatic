import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ServerOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    hetzner_server_id: Optional[int]
    name: str
    ip_address: Optional[str]
    location: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
