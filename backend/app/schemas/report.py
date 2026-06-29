from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
from enum import Enum

class ReportType(str, Enum):
    CSV = "csv"
    JSON = "json"

class ReportResponse(BaseModel):
    id: int
    report_type: ReportType
    generated_at: datetime
    download_url: str