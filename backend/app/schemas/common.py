"""
Common and reusable Pydantic schemas for pagination, errors, and health checks.
"""
from typing import Generic, TypeVar, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error description")
    details: Optional[Any] = Field(None, description="Optional granular validation errors")


class ErrorResponse(BaseModel):
    error: ErrorDetail
    request_id: str = Field(..., description="Unique request tracing correlation ID")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T] = Field(..., description="List of items for current page")
    total: int = Field(..., description="Total count of items matching query")
    page: int = Field(1, description="Current page number (1-indexed)")
    page_size: int = Field(20, description="Number of items per page")
    total_pages: int = Field(1, description="Total number of pages")


class HealthResponse(BaseModel):
    status: str = "healthy"
    service: str
    version: str
    timestamp: datetime


class DBHealthResponse(BaseModel):
    status: str
    database: str
    connected: bool
    timestamp: datetime
