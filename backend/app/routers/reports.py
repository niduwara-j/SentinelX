from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.user import User
from ..services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/")
async def list_reports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # V1 only has asset reports. We'll return a list of available reports.
    return [
        {"id": "assets_json", "name": "Assets Report (JSON)", "type": "json", "url": "/reports/assets?format=json"},
        {"id": "assets_csv", "name": "Assets Report (CSV)", "type": "csv", "url": "/reports/assets?format=csv"}
    ]

@router.get("/assets")
async def generate_assets_report(
    format: str = Query("json", regex="^(json|csv)$"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = await ReportService.generate_assets_report(db, format)
    if format == "csv":
        return Response(content=report["data"], media_type="text/csv", headers={"Content-Disposition": "attachment; filename=assets.csv"})
    else:
        return Response(content=report["data"], media_type="application/json", headers={"Content-Disposition": "attachment; filename=assets.json"})