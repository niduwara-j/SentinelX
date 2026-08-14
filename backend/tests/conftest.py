"""
Pytest configuration, database fixtures, and test users for SentinelX test suite.
"""
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.security import hash_password, create_access_token
from app.core.rate_limiter import limiter
from app.models.user import User
from app.main import app

# Isolated in-memory SQLite database for test runs
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db_session() -> Generator:
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db_session) -> Generator:
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    limiter.clear()  # Reset rate limit counters before each test
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def user_a(db_session) -> User:
    """Primary test user (User A)."""
    user = User(
        username="user_a",
        email="usera@sentinelx.com",
        hashed_password=hash_password("PasswordA123!"),
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def user_b(db_session) -> User:
    """Secondary test user (User B) for cross-tenant isolation testing."""
    user = User(
        username="user_b",
        email="userb@sentinelx.com",
        hashed_password=hash_password("PasswordB123!"),
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def auth_headers_a(user_a) -> dict:
    token = create_access_token(subject=str(user_a.id))
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def auth_headers_b(user_b) -> dict:
    token = create_access_token(subject=str(user_b.id))
    return {"Authorization": f"Bearer {token}"}

