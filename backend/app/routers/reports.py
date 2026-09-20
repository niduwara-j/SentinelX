from typing import List
from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.authorization import OwnershipService
from app.models.scan import Scan, ScanResult
from app.models.user import User
from app.routers.deps import get_current_user
from app.schemas.scan import ScanOut, ScanDetailOut
from app.services.report_service import scan_to_json, scan_to_csv

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get(
    "",
    response_model=List[ScanOut],
    summary="List completed scan reports for authenticated user"
)
def list_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Scan)
        .filter(Scan.user_id == current_user.id, Scan.status == "completed")
        .order_by(Scan.finished_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def _get_user_completed_scan_report(db: Session, scan_id: int, user_id: int) -> Scan:
    scan = OwnershipService.get_user_resource_or_404(
        db=db,
        model_cls=Scan,
        resource_id=scan_id,
        user_id=user_id,
        resource_name="Report",
        options=[joinedload(Scan.results).joinedload(ScanResult.asset)]
    )
    return scan


@router.get(
    "/{scan_id}",
    response_model=ScanDetailOut,
    summary="Get single report details"
)
def get_report(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _get_user_completed_scan_report(db, scan_id, current_user.id)


@router.get(
    "/{scan_id}/csv",
    response_class=PlainTextResponse,
    summary="Export report findings as CSV"
)
def download_report_csv(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scan = _get_user_completed_scan_report(db, scan_id, current_user.id)
    csv_data = scan_to_csv(scan)
    return PlainTextResponse(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=scan_{scan_id}_report.csv"},
    )


@router.get(
    "/{scan_id}/json",
    response_class=PlainTextResponse,
    summary="Export report findings as JSON"
)
def download_report_json(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scan = _get_user_completed_scan_report(db, scan_id, current_user.id)
    json_data = scan_to_json(scan)
    return PlainTextResponse(
        content=json_data,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=scan_{scan_id}_report.json"},
    )

