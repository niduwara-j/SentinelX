"""
FastAPI application entrypoint for SentinelX Version 1.
Configures CORS, Request Correlation ID middleware, Centralized Error Handling,
Health checks, and API v1 routing.
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import JSONResponse

from app.core.config import settings
from app.core.database import Base, engine
from app.core.errors import AppException, ErrorCode
from app.core.middleware import RequestIDMiddleware
from app.utils.logger import setup_logging, logger

# Register models with Base metadata before startup
from app import models  # noqa: F401

from app.routers import auth, scanner, assets, reports, health

setup_logging()

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("SentinelX Version 1 Backend initialized successfully.")
    yield
    logger.info("SentinelX Backend shutting down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SentinelX Enterprise SOC & SIEM Platform Backend Foundation",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# 1. Register Request ID & Auditing Middleware
app.add_middleware(RequestIDMiddleware)

# 2. Register CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 3. Centralized Exception Handlers (Standardized Error Schema)
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.warning(f"[{request_id}] App error {exc.code} ({exc.status_code}): {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        headers=exc.headers,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            },
            "request_id": request_id,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.warning(f"[{request_id}] Validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": ErrorCode.VALIDATION_ERROR,
                "message": "Invalid request payload or parameters",
                "details": exc.errors(),
            },
            "request_id": request_id,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    request_id = getattr(request.state, "request_id", "unknown")
    code = ErrorCode.RESOURCE_NOT_FOUND if exc.status_code == 404 else "HTTP_ERROR"
    return JSONResponse(
        status_code=exc.status_code,
        headers=exc.headers,
        content={
            "error": {
                "code": code,
                "message": str(exc.detail),
            },
            "request_id": request_id,
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.exception(f"[{request_id}] Unhandled server exception on {request.method} {request.url.path}: {str(exc)}")
    # Never leak internal stack traces or database info to client
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": ErrorCode.INTERNAL_SERVER_ERROR,
                "message": "An unexpected internal server error occurred.",
            },
            "request_id": request_id,
        },
    )


# 4. Include Operational & Health Endpoints
app.include_router(health.router)

# 5. Include Versioned API Endpoints (/api/v1)
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(scanner.router, prefix=settings.API_V1_PREFIX)
app.include_router(assets.router, prefix=settings.API_V1_PREFIX)
app.include_router(reports.router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["root"])

def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "api_v1": settings.API_V1_PREFIX,
        "docs": "/docs",
    }
