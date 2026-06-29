from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

class ScanStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class ScanCreate(BaseModel):
    target: str
    port_range: Optional[str] = "1-1024"
    threads: Optional[int] = 100

class ScanResultResponse(BaseModel):
    id: int
    port: int
    protocol: str
    service_name: Optional[str] = None
    banner: Optional[str] = None
    version: Optional[str] = None
    asset_id: int

    class Config:
        from_attributes = True

class ScanResponse(BaseModel):
    id: int
    target: str
    status: ScanStatus
    started_at: datetime
    finished_at: Optional[datetime] = None
    results_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ScanDetail(BaseModel):
    id: int
    target: str
    status: ScanStatus
    started_at: datetime
    finished_at: Optional[datetime] = None
    scan_metadata: Optional[Dict[str, Any]] = None
    results: List[ScanResultResponse] = []

    class Config:
        from_attributes = True