from datetime import datetime

from pydantic import BaseModel


class ServiceOut(BaseModel):
    id: int
    port: int
    protocol: str
    service_name: str | None
    banner: str | None
    detected_at: datetime

    model_config = {"from_attributes": True}


class AssetOut(BaseModel):
    id: int
    ip_address: str
    hostname: str | None
    os_guess: str | None
    status: str
    first_seen: datetime
    last_seen: datetime

    model_config = {"from_attributes": True}


class AssetDetailOut(AssetOut):
    services: list[ServiceOut] = []
