"""
Automated tests for lightweight rate limiting on sensitive endpoints.
"""
from app.core.rate_limiter import limiter


def test_login_rate_limiting_triggers_429(client, user_a):
    limiter.clear()
    
    # Rapid login attempts
    responses = []
    for _ in range(12):
        res = client.post(
            "/api/v1/auth/login",
            data={"username": user_a.username, "password": "WrongPassword!"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        responses.append(res)

    status_codes = [r.status_code for r in responses]
    assert 429 in status_codes
    rate_limited_res = next(r for r in responses if r.status_code == 429)
    data = rate_limited_res.json()
    assert data["error"]["code"] == "RATE_LIMIT_EXCEEDED"
    assert "Retry-After" in rate_limited_res.headers
