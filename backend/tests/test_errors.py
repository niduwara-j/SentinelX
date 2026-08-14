"""
Automated tests for Centralized Error Handling, Error Codes, and Request Correlation IDs.
"""


def test_404_centralized_error_format(client, auth_headers_a):
    response = client.get("/api/v1/scans/999999", headers=auth_headers_a)
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "RESOURCE_NOT_FOUND"
    assert "request_id" in data
    assert "X-Request-ID" in response.headers


def test_validation_error_format(client):
    # Invalid registration payload (missing password, bad email)
    response = client.post("/api/v1/auth/register", json={"username": "ab", "email": "not-an-email"})
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "request_id" in data
    assert isinstance(data["error"]["details"], list)
