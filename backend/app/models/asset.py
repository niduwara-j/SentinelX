from sqlalchemy import String, DateTime, func, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from ..core.database import Base

class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False, index=True)
    hostname: Mapped[str] = mapped_column(String(255), nullable=True)
    os_type: Mapped[str] = mapped_column(String(100), nullable=True)  # placeholder for V2
    last_seen: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    # Relationship back to scan results
    services = relationship("Service", back_populates="asset", cascade="all, delete-orphan")
    scan_results = relationship("ScanResult", back_populates="asset", cascade="all, delete-orphan")