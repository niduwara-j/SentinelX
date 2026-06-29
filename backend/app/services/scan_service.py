from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime
from ..models.scan import Scan, ScanResult, ScanStatus
from ..models.asset import Asset
from ..core.exceptions import NotFoundError
from ..scanner import ping_host, scan_ports, detect_service

class ScanService:
    @staticmethod
    async def create_scan(db: AsyncSession, user_id: int, target: str, port_range: str = "1-1024", threads: int = 100) -> Scan:
        scan = Scan(
            user_id=user_id,
            target=target,
            status=ScanStatus.PENDING,
            scan_metadata={"port_range": port_range, "threads": threads}
        )
        db.add(scan)
        await db.commit()
        await db.refresh(scan)
        return scan

    @staticmethod
    async def get_scans(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100) -> List[Scan]:
        stmt = select(Scan).where(Scan.user_id == user_id).offset(skip).limit(limit).order_by(Scan.started_at.desc())
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_scan(db: AsyncSession, scan_id: int, user_id: int) -> Scan:
        stmt = select(Scan).where(Scan.id == scan_id, Scan.user_id == user_id)
        result = await db.execute(stmt)
        scan = result.scalar_one_or_none()
        if not scan:
            raise NotFoundError(f"Scan {scan_id} not found")
        return scan

    @staticmethod
    async def execute_scan(db: AsyncSession, scan: Scan) -> None:
        """Background task: run the actual scan and update DB."""
        try:
            scan.status = ScanStatus.RUNNING
            await db.commit()

            target = scan.target
            port_range = scan.scan_metadata.get("port_range", "1-1024")
            
            # 1. Ping
            is_alive = await ping_host(target)
            if not is_alive:
                scan.status = ScanStatus.COMPLETED
                scan.finished_at = datetime.now()
                await db.commit()
                return

            # 2. Port scan
            open_ports = await scan_ports(target, port_range)

            # 3. Get or create asset
            asset_stmt = select(Asset).where(Asset.ip_address == target)
            result = await db.execute(asset_stmt)
            asset = result.scalar_one_or_none()
            if not asset:
                asset = Asset(ip_address=target)
                db.add(asset)
                await db.flush()

            # 4. For each port, detect service and save scan result & service
            for port in open_ports:
                service_name, banner = await detect_service(target, port)
                # Save scan result
                scan_result = ScanResult(
                    scan_id=scan.id,
                    asset_id=asset.id,
                    port=port,
                    protocol="tcp",
                    service_name=service_name,
                    banner=banner,
                    version=None
                )
                db.add(scan_result)
                # Also save to services table for V2 readiness
                from .asset_service import AssetService
                await AssetService.save_service(
                    db, asset.id, port, "tcp", service_name, banner, None
                )

            # 5. Update asset last_seen
            asset.last_seen = datetime.now()
            scan.status = ScanStatus.COMPLETED
            scan.finished_at = datetime.now()
            await db.commit()

        except Exception as e:
            scan.status = ScanStatus.FAILED
            scan.finished_at = datetime.now()
            await db.commit()
            raise e