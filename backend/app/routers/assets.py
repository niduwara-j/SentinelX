from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.user import User
from ..schemas.asset import AssetResponse, AssetList
from ..services.asset_service import AssetService

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("/", response_model=List[AssetList])
async def list_assets(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assets = await AssetService.get_assets(db, skip, limit)
    return assets

@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(
    asset_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    asset = await AssetService.get_asset(db, asset_id)
    return asset