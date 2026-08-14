from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class ScanType(str, Enum):
    quick = "quick"
    full = "full"


class ScanCreate(BaseModel):
    target: str = Field(
        description="IP address, hostname, or CIDR range, e.g. 127.0.0.1 or 192.168.1.0/24",
        min_length=1,
        max_length=255,
    )
    scan_type: ScanType = ScanType.quick


class ScanResultOut(BaseModel):
    id: int
    asset_id: int
    port: int
    protocol: str
    service_name: str | None
    banner: str | None

    model_config = {"from_attributes": True}


class ScanOut(BaseModel):
    id: int
    target: str
    scan_type: str
    status: str
    error_message: str | None
    started_at: datetime
    finished_at: datetime | None

    model_config = {"from_attributes": True}


class ScanDetailOut(ScanOut):
    results: list[ScanResultOut] = []
