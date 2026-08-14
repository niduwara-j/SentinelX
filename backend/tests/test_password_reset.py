"""
Automated tests for SentinelX Password Reset and Token Security Flow.
Verifies:
- Account-enumeration resistance (forgot-password generic response)
- Token generation, hashing, and single-use enforcement
- Rejection of invalid, expired, or already-used tokens
- Password update and subsequent login with new credentials
- Invalidation of old password and past JWT session tokens
- Rate limiting on reset attempts
"""
import hashlib
from datetime import datetime, timezone, timedelta
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.services.email_service import get_latest_dev_email, clear_dev_mailbox
from app.core.rate_limiter import limiter


def test_forgot_password_existing_user_returns_generic_message(client, user_a):
    clear_dev_mailbox()
    payload = {"email": user_a.email}
    response = client.post("/api/v1/auth/forgot-password", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "If an account exists for this email" in data["message"]
    
    # Verify email was dispatched in dev mailbox
    email_data = get_latest_dev_email()
    assert email_data is not None
    assert email_data["to"] == user_a.email
    assert "token=" in email_data["reset_url"]


def test_forgot_password_nonexistent_email_returns_identical_generic_message(client):
    clear_dev_mailbox()
    payload = {"email": "ghost_user_nonexistent@sentinelx.com"}
    response = client.post("/api/v1/auth/forgot-password", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Identical message to prevent account enumeration
    assert "If an account exists for this email" in data["message"]
    
    # Dev mailbox should NOT dispatch an email for non-existent users
    email_data = get_latest_dev_email()
    assert email_data is None


def test_forgot_password_rate_limiting(client, user_a):
    limiter.clear()
    payload = {"email": user_a.email}
    
    responses = [client.post("/api/v1/auth/forgot-password", json=payload) for _ in range(8)]
    status_codes = [r.status_code for r in responses]
    assert 429 in status_codes


def test_reset_password_success_flow(client, user_a, db_session):
    clear_dev_mailbox()
    # 1. Request reset
    client.post("/api/v1/auth/forgot-password", json={"email": user_a.email})
    email_data = get_latest_dev_email()
    assert email_data is not None
    raw_token = email_data["token"]

    # 2. Reset password using valid raw token
    new_password = "NewSuperSecurePassword999!"
    reset_res = client.post("/api/v1/auth/reset-password", json={
        "token": raw_token,
        "new_password": new_password
    })
    assert reset_res.status_code == 200
    assert "successfully reset" in reset_res.json()["message"]

    # 3. Verify old password no longer works
    old_login = client.post(
        "/api/v1/auth/login",
        data={"username": user_a.username, "password": "PasswordA123!"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert old_login.status_code == 401

    # 4. Verify new password logs in successfully
    new_login = client.post(
        "/api/v1/auth/login",
        data={"username": user_a.username, "password": new_password},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert new_login.status_code == 200
    assert "access_token" in new_login.json()


def test_reset_password_rejects_used_token(client, user_a):
    clear_dev_mailbox()
    client.post("/api/v1/auth/forgot-password", json={"email": user_a.email})
    raw_token = get_latest_dev_email()["token"]

    # First reset succeeds
    res1 = client.post("/api/v1/auth/reset-password", json={
        "token": raw_token,
        "new_password": "NewValidPassword123!"
    })
    assert res1.status_code == 200

    # Second reset with SAME token fails (single-use token enforcement)
    res2 = client.post("/api/v1/auth/reset-password", json={
        "token": raw_token,
        "new_password": "AnotherNewPassword123!"
    })
    assert res2.status_code == 400
    assert res2.json()["error"]["code"] == "INVALID_RESET_TOKEN"


def test_reset_password_rejects_invalid_token(client):
    res = client.post("/api/v1/auth/reset-password", json={
        "token": "invalid_fake_token_that_does_not_exist_123456789",
        "new_password": "NewValidPassword123!"
    })
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "INVALID_RESET_TOKEN"


def test_reset_password_rejects_expired_token(client, user_a, db_session):
    # Insert manually expired token
    raw_token = "expired_test_token_1234567890123456"
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    
    expired_token_record = PasswordResetToken(
        user_id=user_a.id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) - timedelta(minutes=5),  # expired 5 min ago
        used_at=None
    )
    db_session.add(expired_token_record)
    db_session.commit()

    res = client.post("/api/v1/auth/reset-password", json={
        "token": raw_token,
        "new_password": "NewValidPassword123!"
    })
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "INVALID_RESET_TOKEN"


def test_password_reset_invalidates_past_jwt_sessions(client, user_a, auth_headers_a):
    # User A is logged in and can access /auth/me with auth_headers_a
    res1 = client.get("/api/v1/auth/me", headers=auth_headers_a)
    assert res1.status_code == 200

    # User A requests and performs a password reset
    clear_dev_mailbox()
    client.post("/api/v1/auth/forgot-password", json={"email": user_a.email})
    raw_token = get_latest_dev_email()["token"]

    client.post("/api/v1/auth/reset-password", json={
        "token": raw_token,
        "new_password": "BrandNewPassword123!"
    })

    # The OLD token issued before password change must now be rejected
    res2 = client.get("/api/v1/auth/me", headers=auth_headers_a)
    assert res2.status_code == 401


def test_authenticated_change_password_success(client, user_a, auth_headers_a):
    payload = {
        "current_password": "PasswordA123!",
        "new_password": "AnotherBrandNewPassword123!"
    }
    response = client.post("/api/v1/auth/change-password", json=payload, headers=auth_headers_a)
    assert response.status_code == 200
    assert "successfully" in response.json()["message"]

    # Verify old password fails login
    old_login = client.post(
        "/api/v1/auth/login",
        data={"username": user_a.username, "password": "PasswordA123!"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert old_login.status_code == 401

    # Verify new password succeeds login
    new_login = client.post(
        "/api/v1/auth/login",
        data={"username": user_a.username, "password": "AnotherBrandNewPassword123!"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert new_login.status_code == 200


def test_authenticated_change_password_wrong_current_password_fails(client, user_a, auth_headers_a):
    payload = {
        "current_password": "WrongCurrentPassword123!",
        "new_password": "AnotherBrandNewPassword123!"
    }
    response = client.post("/api/v1/auth/change-password", json=payload, headers=auth_headers_a)
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "INVALID_CREDENTIALS"

