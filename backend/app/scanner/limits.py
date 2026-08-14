"""
Scanner Resource Controls and Active Scan Concurrency Checks.
"""
from sqlalchemy.orm import Session
from app.models.scan import Scan
from app.core.config import settings
from app.core.errors import ScanLimitExceededError


class ScannerLimits:
    @staticmethod
    def enforce_user_scan_concurrency(db: Session, user_id: int) -> None:
        """
        Ensures a user cannot launch multiple simultaneous scans that exhaust server resources.
        """
        active_scans_count = (
            db.query(Scan)
            .filter(
                Scan.user_id == user_id,
                Scan.status.in_(["pending", "running"])
            )
            .count()
        )

        if active_scans_count >= settings.SCANNER_MAX_ACTIVE_SCANS_PER_USER:
            raise ScanLimitExceededError(
                f"You already have {active_scans_count} active scan in progress. "
                "Please wait for it to complete before starting a new scan."
            )
