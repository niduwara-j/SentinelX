"""
Strict Syntactic Target Validation and Sanitization for SentinelX Scanner.
Separates syntactic validation from scope and authorization checks.
"""
import re
import ipaddress
import socket
from typing import List
from app.core.errors import InvalidScanTargetError

# Prohibit any characters that could ever be interpreted as shell control operators
SHELL_METACHRACTERS_PATTERN = re.compile(r"[\s;&|`$<>{}\[\]\(\)\\\'\"\*\?~]")
HOSTNAME_PATTERN = re.compile(r"^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$|^localhost$")


def validate_and_parse_target(raw_target: str, max_hosts: int = 256) -> List[str]:
    """
    Syntactically validates the user-supplied scan target.
    Accepts:
      - Single IPv4 / IPv6 (e.g. "192.168.1.1", "127.0.0.1")
      - IPv4 CIDR range bounded to /24 (e.g. "192.168.1.0/24")
      - Standard RFC hostname (e.g. "scanme.nmap.org", "localhost")
    Rejects:
      - Any string containing shell metacharacters
      - Subnets larger than max_hosts (e.g. /16, /8)
      - Invalid or malformed strings
    """
    if not raw_target or not isinstance(raw_target, str):
        raise InvalidScanTargetError("Scan target cannot be empty")

    target = raw_target.strip()
    if len(target) > 255:
        raise InvalidScanTargetError("Target string exceeds maximum length of 255 characters")

    # Reject shell injection characters immediately
    if SHELL_METACHRACTERS_PATTERN.search(target):
        raise InvalidScanTargetError("Target contains invalid characters or shell metacharacters")

    resolved_ips: List[str] = []

    # 1. Check if CIDR notation
    if "/" in target:
        try:
            network = ipaddress.ip_network(target, strict=False)
            if network.version == 4 and network.prefixlen < 24:
                raise InvalidScanTargetError(
                    f"CIDR subnet /{network.prefixlen} is too large. Maximum allowed range is /24 (256 hosts)."
                )
            hosts = list(network.hosts()) if network.num_addresses > 2 else list(network)
            if len(hosts) > max_hosts:
                raise InvalidScanTargetError(
                    f"Target expanded to {len(hosts)} hosts, exceeding maximum allowed limit of {max_hosts}."
                )
            for ip in hosts:
                resolved_ips.append(str(ip))
            return resolved_ips
        except ValueError as e:
            raise InvalidScanTargetError(f"Invalid CIDR network format: {str(e)}")

    # 2. Check if Single IP
    try:
        ip = ipaddress.ip_address(target)
        return [str(ip)]
    except ValueError:
        pass

    # 3. Check if valid Hostname
    if HOSTNAME_PATTERN.match(target):
        try:
            resolved_ip = socket.gethostbyname(target)
            return [resolved_ip]
        except (socket.gaierror, socket.herror, OSError) as e:
            raise InvalidScanTargetError(f"Unable to resolve hostname '{target}': {str(e)}")

    raise InvalidScanTargetError(f"Target '{target}' is not a valid IP address, hostname, or supported CIDR range")
