"""
Automated tests for SentinelX V1 User Profile and Preferences Management.
Verifies:
- Authenticated user can retrieve full profile details
- Unauthenticated user is rejected
- Authenticated user can change username and email
- Duplicate username and email collisions are rejected
- Sensitive fields cannot be mass-assigned or modified
- User preferences (theme, default scan type) are isolated per user
- Cross-user authorization isolation (User A cannot access or alter User B's settings)
"""
import pytest
from app.models.user import User


def test_get_profile_authenticated(client, user_a, auth_headers_a):
    response = client.get("/api/v1/auth/me", headers=auth_headers_a)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_a.id
    assert data["username"] == user_a.username
    assert data["email"] == user_a.email
    assert data["is_active"] is True
    assert "created_at" in data
    # Sensitive fields must NEVER be leaked
    assert "hashed_password" not in data
    assert "password" not in data


def test_get_profile_unauthenticated_rejected(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_update_profile_username_success(client, user_a, auth_headers_a):
    new_username = "analyst_alpha_v1"
    response = client.patch(
        "/api/v1/auth/me",
        json={"username": new_username},
        headers=auth_headers_a,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == new_username
    assert data["id"] == user_a.id

    # Verify /auth/me reflects the change
    me_res = client.get("/api/v1/auth/me", headers=auth_headers_a)
    assert me_res.json()["username"] == new_username


def test_update_profile_email_success(client, user_a, auth_headers_a):
    new_email = "lead_analyst@sentinelx.io"
    response = client.patch(
        "/api/v1/auth/me",
        json={"email": new_email},
        headers=auth_headers_a,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == new_email
    assert data["id"] == user_a.id


def test_update_profile_duplicate_username_rejected(client, user_a, user_b, auth_headers_a):
    # Attempting to change user_a's username to user_b's username
    response = client.patch(
        "/api/v1/auth/me",
        json={"username": user_b.username},
        headers=auth_headers_a,
    )
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "DUPLICATE_RESOURCE"


def test_update_profile_duplicate_email_rejected(client, user_a, user_b, auth_headers_a):
    # Attempting to change user_a's email to user_b's email
    response = client.patch(
        "/api/v1/auth/me",
        json={"email": user_b.email},
        headers=auth_headers_a,
    )
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "DUPLICATE_RESOURCE"


def test_update_profile_ignores_sensitive_mass_assignment(client, user_a, auth_headers_a):
    # Attempt to elevate or tamper with id, is_active, or hashed_password
    payload = {
        "id": 9999,
        "is_active": False,
        "hashed_password": "tampered_hash_string",
        "roles": ["admin"],
        "username": "legit_analyst_name"
    }
    response = client.patch("/api/v1/auth/me", json=payload, headers=auth_headers_a)
    assert response.status_code == 200
    data = response.json()
    # Immutable user ID remains unchanged
    assert data["id"] == user_a.id
    assert data["is_active"] is True
    assert data["username"] == "legit_analyst_name"


def test_get_and_update_user_preferences(client, user_a, auth_headers_a):
    # 1. Default preferences
    res1 = client.get("/api/v1/auth/preferences", headers=auth_headers_a)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["theme"] == "dark"
    assert data1["default_scan_type"] == "quick"

    # 2. Update preferences
    res2 = client.patch(
        "/api/v1/auth/preferences",
        json={"theme": "light", "default_scan_type": "full"},
        headers=auth_headers_a,
    )
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["theme"] == "light"
    assert data2["default_scan_type"] == "full"


def test_user_preferences_isolation(client, user_a, user_b, auth_headers_a, auth_headers_b):
    # User A sets full scan
    client.patch(
        "/api/v1/auth/preferences",
        json={"default_scan_type": "full", "theme": "light"},
        headers=auth_headers_a,
    )

    # User B checks their preferences - must remain default quick/dark
    res_b = client.get("/api/v1/auth/preferences", headers=auth_headers_b)
    assert res_b.status_code == 200
    data_b = res_b.json()
    assert data_b["default_scan_type"] == "quick"
    assert data_b["theme"] == "dark"
