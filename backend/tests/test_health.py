"""
Automated operational health check tests (/health and /health/db).
"""


def test_liveness_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "timestamp" in data
    # Verify no sensitive config is exposed
    assert "database_url" not in data
    assert "secret_key" not in data


def test_database_health_check(client):
    response = client.get("/health/db")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["connected"] is True
    assert data["database"] == "postgresql"
