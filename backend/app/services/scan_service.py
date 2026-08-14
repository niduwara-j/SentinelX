from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.asset import Asset, Service
from app.models.scan import Scan, ScanResult
from app.scanner.engine import run_scan


def _get_or_create_asset(db: Session, ip_address: str, user_id: int) -> Asset:
    asset = (
        db.query(Asset)
        .filter(Asset.ip_address == ip_address, Asset.user_id == user_id)
        .first()
    )
    if asset:
        asset.status = "up"
        asset.last_seen = datetime.now(timezone.utc)
    else:
        asset = Asset(ip_address=ip_address, user_id=user_id, status="up")
        db.add(asset)
    db.flush()  # get asset.id without committing yet
    return asset


def execute_scan(db: Session, scan: Scan) -> Scan:
    """
    Runs the scanner engine for `scan`, persists discovered assets/services,
    and records per-scan results. Updates scan.status throughout.
    """
    scan.status = "running"
    db.commit()

    try:
        host_findings = run_scan(scan.target, scan.scan_type)

        for host in host_findings:
            asset = _get_or_create_asset(db, host.ip_address, scan.user_id)


            for port_finding in host.ports:
                # Keep the asset's "current" service list up to date.
                existing_service = (
                    db.query(Service)
                    .filter(Service.asset_id == asset.id, Service.port == port_finding.port)
                    .first()
                )
                if existing_service:
                    existing_service.service_name = port_finding.service_name
                    existing_service.banner = port_finding.banner
                else:
                    db.add(
                        Service(
                            asset_id=asset.id,
                            port=port_finding.port,
                            protocol=port_finding.protocol,
                            service_name=port_finding.service_name,
                            banner=port_finding.banner,
                        )
                    )

                # Record this specific scan's findings (historical record).
                db.add(
                    ScanResult(
                        scan_id=scan.id,
                        asset_id=asset.id,
                        port=port_finding.port,
                        protocol=port_finding.protocol,
                        service_name=port_finding.service_name,
                        banner=port_finding.banner,
                    )
                )

        scan.status = "completed"
        scan.finished_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(scan)

    except Exception as exc:  # noqa: BLE001 - want to persist any failure reason
        db.rollback()
        scan.status = "failed"
        scan.error_message = str(exc)[:1000]
        scan.finished_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(scan)

    return scan
