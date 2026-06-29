import asyncio
import platform
import subprocess
import sys

async def ping_host(ip: str) -> bool:
    """Async ping check using system ping command."""
    param = "-n" if platform.system().lower() == "windows" else "-c"
    command = ["ping", param, "1", "-W", "1", ip]
    try:
        process = await asyncio.create_subprocess_exec(
            *command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        await process.wait()
        return process.returncode == 0
    except Exception:
        return False