from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ServiceResponse(BaseModel):
    id: int
    port: int
    protocol: str
    service_name: Optional[str] = None
    banner: Optional[str] = None
    version: Optional[str] = None

    class Config:
        from_attributes = True

class AssetCreate(BaseModel):
    ip_address: str
    hostname: Optional[str] = None
    os_type: Optional[str] = None

class AssetResponse(BaseModel):
    id: int
    ip_address: str
    hostname: Optional[str] = None
    os_type: Optional[str] = None
    last_seen: datetime
    services: List[ServiceResponse] = []

    class Config:
        from_attributes = True

class AssetList(BaseModel):
    id: int
    ip_address: str
    hostname: Optional[str] = None
    last_seen: datetime

    class Config:
        from_attributes = True