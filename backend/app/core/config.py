"""
Application configuration.
Loaded from environment variables (see .env.example).
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "SentinelX"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql+psycopg2://sentinelx:sentinelx@db:5432/sentinelx"

    # JWT
    SECRET_KEY: str = "sentinelx_super_secret_jwt_key_change_in_production_32bytesmin"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS - comma separated list of allowed origins
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"

    # Scanner Resource Controls
    SCANNER_MAX_THREADS: int = 50
    SCAN_SOCKET_TIMEOUT_SECONDS: float = 0.8
    SCANNER_MAX_HOSTS_PER_SCAN: int = 256
    SCAN_TIMEOUT_SECONDS: int = 300  # Canonical 300s total scan execution timeout
    SCANNER_MAX_ACTIVE_SCANS_PER_USER: int = 1
    SCANNER_DEFAULT_PORTS: str = "21,22,23,25,53,80,110,135,139,143,443,445,1433,1521,3306,3389,5432,5900,6379,8000,8080,8443,9200,27017"

    # Password Reset & Email Settings
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 15
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "noreply@sentinelx.local"
    SMTP_USE_TLS: bool = True
    FRONTEND_URL: str = "http://localhost:5173"

    # Rate Limiting
    RATE_LIMIT_LOGIN_MAX: int = 10
    RATE_LIMIT_LOGIN_WINDOW: int = 60  # 10 attempts per minute
    RATE_LIMIT_REGISTER_MAX: int = 10
    RATE_LIMIT_REGISTER_WINDOW: int = 3600  # 10 per hour
    RATE_LIMIT_SCAN_MAX: int = 20
    RATE_LIMIT_SCAN_WINDOW: int = 3600  # 20 scans per hour
    RATE_LIMIT_FORGOT_PW_MAX: int = 5
    RATE_LIMIT_FORGOT_PW_WINDOW: int = 300  # 5 per 5 minutes
    RATE_LIMIT_RESET_PW_MAX: int = 10
    RATE_LIMIT_RESET_PW_WINDOW: int = 300


    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def default_ports_list(self) -> list[int]:
        return [int(p.strip()) for p in self.SCANNER_DEFAULT_PORTS.split(",") if p.strip()]



@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
