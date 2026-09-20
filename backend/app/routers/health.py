"""
Operational Health Check Endpoints for SentinelX.
"""
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from app.core.config import settings
from app.core.database import check_db_connectivity
from app.schemas.common import HealthResponse, DBHealthResponse

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="System liveness health check"
)
def health_check():
    """Returns basic process liveness status."""
    return HealthResponse(
        status="healthy",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        timestamp=datetime.now(timezone.utc)
    )


@router.get(
    "/health/db",
    response_model=DBHealthResponse,
    summary="Database connectivity check"
)
def db_health_check():
    """Safely verifies PostgreSQL database connection."""
    connected = check_db_connectivity()
    if not connected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failure"
        )

    return DBHealthResponse(
        status="healthy",
        database="postgresql",
        connected=True,
        timestamp=datetime.now(timezone.utc)
    )
