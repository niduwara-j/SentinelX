from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
import csv
import json
from io import StringIO
from ..models.asset import Asset
from ..models.service import Service
from ..core.exceptions import NotFoundError

class ReportService:
    @staticmethod
    async def generate_assets_report(db: AsyncSession, report_type: str = "json") -> Dict[str, Any]:
        stmt = select(Asset)
        result = await db.execute(stmt)
        assets = result.scalars().all()
        
        data = []
        for asset in assets:
            services = [{"port": s.port, "protocol": s.protocol, "service": s.service_name, "banner": s.banner} for s in asset.services]
            data.append({
                "ip": asset.ip_address,
                "hostname": asset.hostname,
                "last_seen": asset.last_seen.isoformat() if asset.last_seen else None,
                "services": services
            })
        
        if report_type.lower() == "csv":
            output = StringIO()
            writer = csv.writer(output)
            writer.writerow(["IP", "Hostname", "Port", "Protocol", "Service"])
            for item in data:
                if item["services"]:
                    for svc in item["services"]:
                        writer.writerow([item["ip"], item["hostname"], svc["port"], svc["protocol"], svc["service"]])
                else:
                    writer.writerow([item["ip"], item["hostname"], "", "", ""])
            return {"format": "csv", "data": output.getvalue()}
        else:
            return {"format": "json", "data": json.dumps(data, indent=2)}