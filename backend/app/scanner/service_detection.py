"""
Service detection: map well-known ports to service names, and attempt a
lightweight banner grab for extra detail.
"""
import socket

COMMON_SERVICES: dict[int, str] = {
    21: "ftp",
    22: "ssh",
    23: "telnet",
    25: "smtp",
    53: "dns",
    80: "http",
    110: "pop3",
    143: "imap",
    443: "https",
    445: "smb",
    1433: "mssql",
    1521: "oracle",
    3306: "mysql",
    3389: "rdp",
    5432: "postgresql",
    5900: "vnc",
    6379: "redis",
    8080: "http-proxy",
    8443: "https-alt",
    9200: "elasticsearch",
    27017: "mongodb",
}


def identify_service(port: int) -> str:
    return COMMON_SERVICES.get(port, "unknown")


def grab_banner(ip: str, port: int, timeout: float = 0.75) -> str | None:
    """
    Best-effort banner grab. Many services send a greeting on connect
    (SSH, FTP, SMTP); for others (HTTP) we send a minimal probe request.
    Returns None if nothing useful comes back.
    """
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(timeout)
            sock.connect((ip, port))

            if port in (80, 8080):
                sock.sendall(b"HEAD / HTTP/1.0\r\n\r\n")

            data = sock.recv(256)
            if not data:
                return None
            return data.decode(errors="replace").strip().splitlines()[0][:200]
    except (OSError, socket.timeout):
        return None
