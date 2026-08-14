"""
TCP connect scan: for a given host, find which ports are open.
"""
import socket
from concurrent.futures import ThreadPoolExecutor, as_completed

from app.core.config import settings

# A wider port list used for "full" scans. Kept modest for Version 1 so
# scans stay fast; can be expanded in later versions.
FULL_SCAN_PORTS = list(range(1, 1025)) + [
    1433, 1521, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 9200, 27017,
]


def _check_port(ip: str, port: int, timeout: float) -> bool:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(timeout)
            return sock.connect_ex((ip, port)) == 0
    except OSError:
        return False


def scan_ports(ip: str, ports: list[int]) -> list[int]:
    """Return the subset of `ports` that are open on `ip`."""
    open_ports: list[int] = []

    with ThreadPoolExecutor(max_workers=settings.SCANNER_MAX_THREADS) as pool:
        futures = {
            pool.submit(_check_port, ip, port, settings.SCAN_SOCKET_TIMEOUT_SECONDS): port
            for port in ports
        }

        for future in as_completed(futures):
            port = futures[future]
            try:
                if future.result():
                    open_ports.append(port)
            except Exception:
                continue

    return sorted(open_ports)


def ports_for_scan_type(scan_type: str) -> list[int]:
    if scan_type == "full":
        return FULL_SCAN_PORTS
    return settings.default_ports_list
