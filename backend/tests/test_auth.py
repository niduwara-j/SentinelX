"""
Automated tests for Authentication (registration, duplicates, login, JWT validation).
"""


def test_user_registration_success(client):
    payload = {
        "username": "analyst_alice",
        "email": "alice@sentinelx.com",
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "analyst_alice"
    assert data["email"] == "alice@sentinelx.com"
    assert "hashed_password" not in data


def test_user_registration_duplicate_username_fails(client, user_a):
    payload = {
        "username": user_a.username,
        "email": "different_email@sentinelx.com",
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert data["error"]["code"] == "DUPLICATE_RESOURCE"
    assert "already registered" in data["error"]["message"]


def test_user_registration_duplicate_email_fails(client, user_a):
    payload = {
        "username": "different_username",
        "email": user_a.email,
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert data["error"]["code"] == "DUPLICATE_RESOURCE"


def test_user_login_success(client, user_a):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": user_a.username, "password": "PasswordA123!"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_user_login_invalid_password(client, user_a):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": user_a.username, "password": "WrongPassword!"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "UNAUTHORIZED"


def test_get_current_user_profile(client, auth_headers_a, user_a):
    response = client.get("/api/v1/auth/me", headers=auth_headers_a)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == user_a.username
    assert data["email"] == user_a.email


def test_unauthenticated_request_rejected(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] in ("UNAUTHORIZED", "HTTP_ERROR")
