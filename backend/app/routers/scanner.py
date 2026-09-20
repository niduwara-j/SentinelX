from typing import List, Optional
from fastapi import APIRouter, BackgroundTasks, Depends, Query, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.config import settings
from app.core.authorization import OwnershipService
from app.core.rate_limiter import rate_limit_user
from app.models.scan import Scan
from app.models.user import User
from app.routers.deps import get_current_user
from app.schemas.scan import ScanCreate, ScanOut, ScanDetailOut
from app.scanner.validator import validate_and_parse_target
from app.scanner.limits import ScannerLimits
from app.services.scan_service import execute_scan
from app.utils.logger import logger

router = APIRouter(prefix="/scans", tags=["scanner"])


@router.post(
    "",
    response_model=ScanOut,
    status_code=status.HTTP_201_CREATED,
    summary="Start a new network discovery scan"
)
def start_scan(
    scan_in: ScanCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Syntactically validate target before touching business logic
    validate_and_parse_target(scan_in.target, max_hosts=settings.SCANNER_MAX_HOSTS_PER_SCAN)

    # 2. Enforce active scan concurrency limits per user
    ScannerLimits.enforce_user_scan_concurrency(db, current_user.id)

    # 3. Create user-scoped scan
    scan = Scan(
        user_id=current_user.id,
        target=scan_in.target.strip(),
        scan_type=scan_in.scan_type.value,
        status="pending",
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    logger.info(
        f"Scan job #{scan.id} created by user='{current_user.username}' (target='{scan.target}', type='{scan.scan_type}')"
    )

    # Dispatch to background task
    background_tasks.add_task(_run_scan_in_background, scan.id)

    return scan


def _run_scan_in_background(scan_id: int) -> None:
    from app.core.database import SessionLocal

    db = SessionLocal()
    try:
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if scan:
            execute_scan(db, scan)
    finally:
        db.close()


@router.get(
    "",
    response_model=List[ScanOut],
    summary="List historical scans for authenticated user"
)
def list_scans(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Scan)
        .filter(Scan.user_id == current_user.id)
        .order_by(Scan.started_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get(
    "/{scan_id}",
    response_model=ScanDetailOut,
    summary="Get scan detail and findings"
)
def get_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return OwnershipService.get_user_resource_or_404(
        db=db,
        model_cls=Scan,
        resource_id=scan_id,
        user_id=current_user.id,
        resource_name="Scan",
        options=[joinedload(Scan.results)]
    )

