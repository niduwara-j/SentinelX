import re
from datetime import datetime

def format_timestamp(dt: datetime) -> str:
    return dt.isoformat() if dt else None

def is_valid_ip(ip: str) -> bool:
    pattern = re.compile(r"^(\d{1,3}\.){3}\d{1,3}$")
    if not pattern.match(ip):
        return False
    parts = ip.split(".")
    return all(0 <= int(p) <= 255 for p in parts)