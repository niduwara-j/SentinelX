# app/models/service.py
from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.database import Base

class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"), nullable=False)
    port: Mapped[int] = mapped_column(Integer, nullable=False)
    protocol: Mapped[str] = mapped_column(String(10), nullable=False)
    service_name: Mapped[str] = mapped_column(String(100), nullable=True)
    banner: Mapped[str] = mapped_column(String(1000), nullable=True)
    version: Mapped[str] = mapped_column(String(100), nullable=True)

    asset = relationship("Asset", back_populates="services")