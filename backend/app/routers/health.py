from fastapi import APIRouter
from ..core.database import engine
from sqlalchemy import text

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("/")
async def health_check():
    return {"status": "ok"}

@router.get("/db")
async def db_health():
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}