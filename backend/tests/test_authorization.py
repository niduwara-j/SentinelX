"""
Automated Security Tests for Server-Side Data Ownership & User Isolation.
Verifies that User B cannot view, query, or download User A's scans, assets, reports, or results.
"""
from datetime import datetime, timezone
from app.models.scan import Scan, ScanResult
from app.models.asset import Asset, Service


def test_user_isolation_scans(client, db_session, user_a, user_b, auth_headers_a, auth_headers_b):
    # Create Scan A belonging to User A
    scan_a = Scan(
        user_id=user_a.id,
        target="10.0.0.1",
        scan_type="quick",
        status="completed",
        started_at=datetime.now(timezone.utc),
        finished_at=datetime.now(timezone.utc),
    )
    db_session.add(scan_a)
    db_session.commit()
    db_session.refresh(scan_a)

    # 1. User A can retrieve Scan A
    res_a = client.get(f"/api/v1/scans/{scan_a.id}", headers=auth_headers_a)
    assert res_a.status_code == 200
    assert res_a.json()["id"] == scan_a.id

    # 2. User B list scans -> empty
    res_b_list = client.get("/api/v1/scans", headers=auth_headers_b)
    assert res_b_list.status_code == 200
    assert len(res_b_list.json()) == 0

    # 3. User B direct lookup on Scan A by ID -> 404 RESOURCE_NOT_FOUND (not leaked)
    res_b_direct = client.get(f"/api/v1/scans/{scan_a.id}", headers=auth_headers_b)
    assert res_b_direct.status_code == 404
    data = res_b_direct.json()
    assert data["error"]["code"] == "RESOURCE_NOT_FOUND"


def test_user_isolation_assets(client, db_session, user_a, user_b, auth_headers_a, auth_headers_b):
    # Create Asset A belonging to User A
    asset_a = Asset(
        user_id=user_a.id,
        ip_address="192.168.50.1",
        hostname="router.internal",
        status="up",
    )
    db_session.add(asset_a)
    db_session.commit()
    db_session.refresh(asset_a)

    # Add service to Asset A
    svc = Service(
        asset_id=asset_a.id,
        port=80,
        protocol="tcp",
        service_name="HTTP",
        banner="Apache/2.4",
    )
    db_session.add(svc)
    db_session.commit()

    # 1. User A sees Asset A
    res_a = client.get("/api/v1/assets", headers=auth_headers_a)
    assert res_a.status_code == 200
    assert len(res_a.json()) == 1
    assert res_a.json()[0]["ip_address"] == "192.168.50.1"

    # 2. User B sees 0 assets
    res_b_list = client.get("/api/v1/assets", headers=auth_headers_b)
    assert res_b_list.status_code == 200
    assert len(res_b_list.json()) == 0

    # 3. User B accessing Asset A by ID -> 404
    res_b_direct = client.get(f"/api/v1/assets/{asset_a.id}", headers=auth_headers_b)
    assert res_b_direct.status_code == 404
    assert res_b_direct.json()["error"]["code"] == "RESOURCE_NOT_FOUND"


def test_user_isolation_reports_and_exports(client, db_session, user_a, user_b, auth_headers_a, auth_headers_b):
    # Completed scan for User A
    scan_a = Scan(
        user_id=user_a.id,
        target="192.168.1.1",
        scan_type="quick",
        status="completed",
        started_at=datetime.now(timezone.utc),
        finished_at=datetime.now(timezone.utc),
    )
    db_session.add(scan_a)
    db_session.commit()
    db_session.refresh(scan_a)

    # 1. User A lists reports -> sees 1
    res_a = client.get("/api/v1/reports", headers=auth_headers_a)
    assert res_a.status_code == 200
    assert len(res_a.json()) == 1

    # 2. User B lists reports -> sees 0
    res_b = client.get("/api/v1/reports", headers=auth_headers_b)
    assert res_b.status_code == 200
    assert len(res_b.json()) == 0

    # 3. User B downloading User A's CSV report -> 404
    res_b_csv = client.get(f"/api/v1/reports/{scan_a.id}/csv", headers=auth_headers_b)
    assert res_b_csv.status_code == 404
    assert res_b_csv.json()["error"]["code"] == "RESOURCE_NOT_FOUND"

    # 4. User B downloading User A's JSON report -> 404
    res_b_json = client.get(f"/api/v1/reports/{scan_a.id}/json", headers=auth_headers_b)
    assert res_b_json.status_code == 404
    assert res_b_json.json()["error"]["code"] == "RESOURCE_NOT_FOUND"
