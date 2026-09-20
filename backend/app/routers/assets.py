from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.authorization import OwnershipService
from app.models.asset import Asset
from app.models.user import User
from app.routers.deps import get_current_user
from app.schemas.asset import AssetOut, AssetDetailOut

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get(
    "",
    response_model=List[AssetOut],
    summary="List all discovered assets for authenticated user"
)
def list_assets(
    search: Optional[str] = Query(None, description="Filter by IP, hostname, or OS"),
    status: Optional[str] = Query(None, description="Filter by status (up/down)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns only assets discovered by the authenticated user's scans."""
    query = db.query(Asset).filter(Asset.user_id == current_user.id)

    if status:
        query = query.filter(Asset.status == status)

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Asset.ip_address.ilike(term),
                Asset.hostname.ilike(term),
                Asset.os_guess.ilike(term)
            )
        )

    return query.order_by(Asset.last_seen.desc()).offset(skip).limit(limit).all()


@router.get(
    "/{asset_id}",
    response_model=AssetDetailOut,
    summary="Get single asset details and running services"
)
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns a specific asset only if it belongs to the authenticated user."""
    return OwnershipService.get_user_resource_or_404(
        db=db,
        model_cls=Asset,
        resource_id=asset_id,
        user_id=current_user.id,
        resource_name="Asset",
        options=[joinedload(Asset.services)]
    )


