import socket
import asyncio
from typing import Optional

COMMON_SERVICES = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    111: "RPC",
    135: "MSRPC",
    139: "NetBIOS",
    143: "IMAP",
    443: "HTTPS",
    445: "SMB",
    993: "IMAPS",
    995: "POP3S",
    3306: "MySQL",
    3389: "RDP",
    5432: "PostgreSQL",
    6379: "Redis",
    27017: "MongoDB",
}

async def detect_service(ip: str, port: int, timeout: float = 2.0) -> tuple[Optional[str], Optional[str]]:
    """
    Attempts to grab a banner and identify service.
    Returns (service_name, banner)
    """
    service_name = COMMON_SERVICES.get(port, "unknown")
    banner = None
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(ip, port),
            timeout=timeout
        )
        # Send a newline to trigger banner on many services
        writer.write(b"\n")
        await writer.drain()
        banner = await asyncio.wait_for(reader.read(1024), timeout=timeout)
        writer.close()
        await writer.wait_closed()
        if banner:
            banner = banner.decode("utf-8", errors="ignore").strip()
    except Exception:
        pass

    # Heuristic: if port is 80/443, we can set service to HTTP/HTTPS regardless.
    if port == 80:
        service_name = "HTTP"
    elif port == 443:
        service_name = "HTTPS"

    return service_name, banner