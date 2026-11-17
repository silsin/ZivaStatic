import uuid
from datetime import datetime

from pydantic import BaseModel


class VpnConfigOut(BaseModel):
    id: uuid.UUID
    server_id: uuid.UUID
    protocol: str
    created_at: datetime

    model_config = {"from_attributes": True}


class VpnConfigDetail(BaseModel):
    id: uuid.UUID
    server_id: uuid.UUID
    protocol: str
    config_data: str
    created_at: datetime

    model_config = {"from_attributes": True}
