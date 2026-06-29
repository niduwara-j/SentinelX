from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from ..models.asset import Asset
from ..models.service import Service
from ..core.exceptions import NotFoundError

class AssetService:
    @staticmethod
    async def get_assets(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Asset]:
        stmt = select(Asset).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_asset(db: AsyncSession, asset_id: int) -> Asset:
        stmt = select(Asset).where(Asset.id == asset_id)
        result = await db.execute(stmt)
        asset = result.scalar_one_or_none()
        if not asset:
            raise NotFoundError(f"Asset with id {asset_id} not found")
        return asset

    @staticmethod
    async def get_or_create_asset(db: AsyncSession, ip: str, hostname: Optional[str] = None) -> Asset:
        stmt = select(Asset).where(Asset.ip_address == ip)
        result = await db.execute(stmt)
        asset = result.scalar_one_or_none()
        if not asset:
            asset = Asset(ip_address=ip, hostname=hostname)
            db.add(asset)
            await db.flush()
        elif hostname and not asset.hostname:
            asset.hostname = hostname
        return asset

    @staticmethod
    async def save_service(db: AsyncSession, asset_id: int, port: int, protocol: str, service_name: str, banner: str = None, version: str = None) -> Service:
        service = Service(
            asset_id=asset_id,
            port=port,
            protocol=protocol,
            service_name=service_name,
            banner=banner,
            version=version
        )
        db.add(service)
        return service