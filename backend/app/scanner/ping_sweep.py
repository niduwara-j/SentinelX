"""
Ping sweep: determine which hosts in a target range are alive.

Uses a lightweight TCP-connect probe against a small set of common ports
instead of ICMP, because raw ICMP sockets require elevated privileges that
won't be available inside a normal Docker container. This is the same
approach many userland scanners fall back to.
"""
import ipaddress
import socket
from concurrent.futures import ThreadPoolExecutor, as_completed

from app.core.config import settings

# Ports checked purely to decide "is this host alive", not part of the
# service scan results themselves.
LIVENESS_PROBE_PORTS = [80, 443, 22, 445, 3389]


def _host_is_alive(ip: str, timeout: float) -> bool:
    for port in LIVENESS_PROBE_PORTS:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.settimeout(timeout)
                result = sock.connect_ex((ip, port))
                if result == 0:
                    return True
        except (socket.gaierror, OSError):
            continue
    return False


from app.scanner.validator import validate_and_parse_target


def expand_target(target: str) -> list[str]:
    """Turn a validated single IP, hostname, or CIDR range into a list of IP strings."""
    return validate_and_parse_target(target, max_hosts=settings.SCANNER_MAX_HOSTS_PER_SCAN)


def ping_sweep(target: str, max_hosts: int = 256) -> list[str]:
    """
    Return the list of IPs from `target` that respond to a liveness probe.
    """
    candidates = expand_target(target)[:max_hosts]
    alive: list[str] = []


    with ThreadPoolExecutor(max_workers=min(settings.SCANNER_MAX_THREADS, len(candidates) or 1)) as pool:
        futures = {
            pool.submit(_host_is_alive, ip, settings.SCAN_SOCKET_TIMEOUT_SECONDS): ip
            for ip in candidates
        }

        for future in as_completed(futures):
            ip = futures[future]
            try:
                if future.result():
                    alive.append(ip)
            except Exception:
                continue

    return alive
