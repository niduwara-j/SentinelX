import asyncio
import socket
from concurrent.futures import ThreadPoolExecutor
from typing import List, Tuple, Optional

executor = ThreadPoolExecutor(max_workers=200)

async def scan_port(ip: str, port: int, timeout: float = 1.0) -> Optional[int]:
    """TCP connect scan on a single port."""
    loop = asyncio.get_event_loop()
    def _scan():
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.settimeout(timeout)
                result = sock.connect_ex((ip, port))
                return port if result == 0 else None
        except Exception:
            return None
    return await loop.run_in_executor(executor, _scan)

async def scan_ports(ip: str, port_range: str = "1-1024", timeout: float = 1.0) -> List[int]:
    """Scan a range of ports."""
    try:
        start, end = map(int, port_range.split("-"))
    except ValueError:
        return []

    tasks = [scan_port(ip, port, timeout) for port in range(start, end + 1)]
    results = await asyncio.gather(*tasks)
    return [port for port in results if port is not None]