"""
Automated tests for Scanner target validation, resource bounds, and safe execution.
"""
import pytest
from app.scanner.validator import validate_and_parse_target
from app.core.errors import InvalidScanTargetError


def test_target_validation_valid_ipv4():
    ips = validate_and_parse_target("192.168.1.1")
    assert ips == ["192.168.1.1"]


def test_target_validation_valid_cidr():
    ips = validate_and_parse_target("192.168.1.0/30")
    assert len(ips) == 2
    assert "192.168.1.1" in ips
    assert "192.168.1.2" in ips


def test_target_validation_valid_hostname():
    ips = validate_and_parse_target("localhost")
    assert "127.0.0.1" in ips or len(ips) == 1


def test_target_validation_rejects_command_injection():
    injection_payloads = [
        "127.0.0.1; rm -rf /",
        "127.0.0.1 && cat /etc/passwd",
        "127.0.0.1 | whoami",
        "`id`",
        "$(whoami)",
        "127.0.0.1 > /dev/null",
        "192.168.1.1/24; echo hacked",
    ]
    for payload in injection_payloads:
        with pytest.raises(InvalidScanTargetError):
            validate_and_parse_target(payload)


def test_target_validation_rejects_oversized_cidr():
    # /16 is 65,536 hosts - must be rejected
    with pytest.raises(InvalidScanTargetError) as exc_info:
        validate_and_parse_target("10.0.0.0/16")
    assert "too large" in str(exc_info.value)


def test_create_scan_endpoint_valid(client, auth_headers_a):
    payload = {"target": "127.0.0.1", "scan_type": "quick"}
    response = client.post("/api/v1/scans", json=payload, headers=auth_headers_a)
    assert response.status_code == 201
    data = response.json()
    assert data["target"] == "127.0.0.1"
    assert data["status"] in ("pending", "running", "completed")


def test_create_scan_endpoint_invalid_target_rejected(client, auth_headers_a):
    payload = {"target": "127.0.0.1; whoami", "scan_type": "quick"}
    response = client.post("/api/v1/scans", json=payload, headers=auth_headers_a)
    assert response.status_code == 400
    data = response.json()
    assert data["error"]["code"] == "SCAN_TARGET_INVALID"


def test_scanner_canonical_timeout_setting():

    from app.core.config import settings
    # Must use canonical name SCAN_TIMEOUT_SECONDS
    assert hasattr(settings, "SCAN_TIMEOUT_SECONDS")
    assert settings.SCAN_TIMEOUT_SECONDS >= 10
    # SCANNER_TIMEOUT_SECONDS must not exist
    assert not hasattr(settings, "SCANNER_TIMEOUT_SECONDS")


def test_scanner_engine_executes_without_attribute_error(monkeypatch):
    from app.scanner.engine import run_scan
    
    # Mock ping_sweep and scan_ports so test runs fast and offline
    monkeypatch.setattr("app.scanner.engine.ping_sweep", lambda target: ["127.0.0.1"])
    monkeypatch.setattr("app.scanner.engine.scan_ports", lambda ip, ports: [80, 443])
    monkeypatch.setattr("app.scanner.engine.identify_service", lambda port: "http" if port == 80 else "https")
    monkeypatch.setattr("app.scanner.engine.grab_banner", lambda ip, port: "TestServer/1.0")

    findings = run_scan("127.0.0.1", "quick")
    assert len(findings) == 1
    assert findings[0].ip_address == "127.0.0.1"
    assert len(findings[0].ports) == 2
    assert findings[0].ports[0].port == 80
    assert findings[0].ports[0].service_name == "http"


def test_scanner_engine_enforces_timeout(monkeypatch):
    from app.scanner.engine import run_scan
    from app.core.config import settings

    monkeypatch.setattr(settings, "SCAN_TIMEOUT_SECONDS", 0)  # 0 second timeout triggers immediately
    monkeypatch.setattr("app.scanner.engine.ping_sweep", lambda target: ["10.0.0.1", "10.0.0.2"])
    
    with pytest.raises(TimeoutError) as exc_info:
        run_scan("10.0.0.0/24")
    assert "Scan exceeded maximum execution timeout" in str(exc_info.value)

