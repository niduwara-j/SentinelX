from fastapi import APIRouter, Depends, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.user import User
from ..schemas.scan import ScanCreate, ScanResponse, ScanDetail
from ..services.scan_service import ScanService

router = APIRouter(prefix="/scan", tags=["Scanner"])

@router.post("/", response_model=ScanResponse, status_code=202)
async def start_scan(
    scan_data: ScanCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Create scan record
    scan = await ScanService.create_scan(
        db, current_user.id, scan_data.target, 
        scan_data.port_range or "1-1024", 
        scan_data.threads or 100
    )
    # Run scan in background
    background_tasks.add_task(ScanService.execute_scan, db, scan)
    return scan

@router.get("/", response_model=List[ScanResponse])
async def list_scans(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scans = await ScanService.get_scans(db, current_user.id, skip, limit)
    # Count results per scan
    for scan in scans:
        scan.results_count = len(scan.results) if scan.results else 0
    return scans

@router.get("/{scan_id}", response_model=ScanDetail)
async def get_scan(
    scan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scan = await ScanService.get_scan(db, scan_id, current_user.id)
    return scan