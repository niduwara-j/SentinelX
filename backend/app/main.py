from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .routers import auth_router, assets_router, scan_router, reports_router, health_router

app = FastAPI(
    title="SentinelX API",
    description="Network Discovery & Vulnerability Assessment Platform",
    version="1.0.0"
)

# CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Dija's Vite/React ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(assets_router)
app.include_router(scan_router)
app.include_router(reports_router)
app.include_router(health_router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # Create tables (in production use Alembic, but for V1 init this is fine)
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "SentinelX API v1.0.0", "docs": "/docs"}