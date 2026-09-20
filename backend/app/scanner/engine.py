"""
Scanner engine: orchestrates a full scan job - ping sweep, then per-host
port scan and service detection. This is the single entry point the
scanner router/service should call.
"""
import time
from dataclasses import dataclass, field

from app.core.config import settings
from app.scanner.ping_sweep import ping_sweep
from app.scanner.tcp_scan import scan_ports, ports_for_scan_type
from app.scanner.service_detection import identify_service, grab_banner


@dataclass
class PortFinding:
    port: int
    protocol: str
    service_name: str
    banner: str | None


@dataclass
class HostFinding:
    ip_address: str
    ports: list[PortFinding] = field(default_factory=list)


def run_scan(target: str, scan_type: str = "quick") -> list[HostFinding]:
    """
    Run a full scan against `target` (single IP, hostname, or CIDR).
    Returns one HostFinding per live host, each containing its open ports.
    Enforces maximum total execution time bounded by settings.SCAN_TIMEOUT_SECONDS.
    """
    start_time = time.time()
    live_hosts = ping_sweep(target)
    ports_to_check = ports_for_scan_type(scan_type)

    findings: list[HostFinding] = []
    for ip in live_hosts:
        # Check overall scan timeout deadline
        if (time.time() - start_time) > settings.SCAN_TIMEOUT_SECONDS:
            raise TimeoutError(f"Scan exceeded maximum execution timeout of {settings.SCAN_TIMEOUT_SECONDS}s")

        open_ports = scan_ports(ip, ports_to_check)
        port_findings = [
            PortFinding(
                port=port,
                protocol="tcp",
                service_name=identify_service(port),
                banner=grab_banner(ip, port),
            )
            for port in open_ports
        ]
        findings.append(HostFinding(ip_address=ip, ports=port_findings))

    return findings

