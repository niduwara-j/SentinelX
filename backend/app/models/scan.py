from sqlalchemy import String, DateTime, func, ForeignKey, Enum, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum
from ..core.database import Base

class ScanStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class Scan(Base):
    __tablename__ = "scans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    target: Mapped[str] = mapped_column(String(255), nullable=False)  # IP or CIDR
    status: Mapped[ScanStatus] = mapped_column(Enum(ScanStatus), default=ScanStatus.PENDING)
    started_at: Mapped[datetime] = mapped_column(server_default=func.now())
    finished_at: Mapped[datetime] = mapped_column(nullable=True)
    scan_metadata: Mapped[dict] = mapped_column(JSON, nullable=True)  # store port range, threads etc.

    user = relationship("User", back_populates="scans")
    results = relationship("ScanResult", back_populates="scan", cascade="all, delete-orphan")

class ScanResult(Base):
    __tablename__ = "scan_results"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"), nullable=False)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"), nullable=False)
    port: Mapped[int] = mapped_column(Integer, nullable=False)
    protocol: Mapped[str] = mapped_column(String(10), nullable=False, default="tcp")
    service_name: Mapped[str] = mapped_column(String(100), nullable=True)
    banner: Mapped[str] = mapped_column(String(1000), nullable=True)  # V2
    version: Mapped[str] = mapped_column(String(100), nullable=True)  # V2

    scan = relationship("Scan", back_populates="results")
    asset = relationship("Asset", back_populates="scan_results")