import csv
import io
import json

from sqlalchemy.orm import Session

from app.models.scan import Scan


def scan_to_json(scan: Scan) -> str:
    payload = {
        "scan_id": scan.id,
        "target": scan.target,
        "scan_type": scan.scan_type,
        "status": scan.status,
        "started_at": scan.started_at.isoformat() if scan.started_at else None,
        "finished_at": scan.finished_at.isoformat() if scan.finished_at else None,
        "results": [
            {
                "asset_id": r.asset_id,
                "ip_address": r.asset.ip_address if r.asset else None,
                "port": r.port,
                "protocol": r.protocol,
                "service_name": r.service_name,
                "banner": r.banner,
            }
            for r in scan.results
        ],
    }
    return json.dumps(payload, indent=2)


def scan_to_csv(scan: Scan) -> str:
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["ip_address", "port", "protocol", "service_name", "banner"])
    for r in scan.results:
        writer.writerow(
            [r.asset.ip_address if r.asset else "", r.port, r.protocol, r.service_name or "", r.banner or ""]
        )
    return buffer.getvalue()


def get_scan_or_none(db: Session, scan_id: int, user_id: int) -> Scan | None:
    return db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == user_id).first()
