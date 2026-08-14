"""
Lightweight In-Memory Sliding-Window Rate Limiter for SentinelX V1.
Protects sensitive endpoints against brute-force and resource abuse.
"""
import time
from collections import defaultdict
from typing import Tuple, Dict, List
from fastapi import Request
from app.core.errors import RateLimitExceededError


class RateLimiter:
    def __init__(self):
        # Maps key -> list of timestamps
        self._records: Dict[str, List[float]] = defaultdict(list)

    def check(self, key: str, max_requests: int, window_seconds: int) -> None:
        """
        Enforces a rate limit for a given key within a sliding time window.
        Raises RateLimitExceededError if limit is reached.
        """
        now = time.time()
        window_start = now - window_seconds

        # Prune expired timestamps
        valid_timestamps = [ts for ts in self._records[key] if ts > window_start]
        self._records[key] = valid_timestamps

        if len(valid_timestamps) >= max_requests:
            oldest_timestamp = valid_timestamps[0]
            retry_after = max(1, int(window_seconds - (now - oldest_timestamp)))
            raise RateLimitExceededError(
                message=f"Rate limit exceeded. Maximum {max_requests} requests per {window_seconds}s.",
                retry_after=retry_after
            )

        self._records[key].append(now)

    def clear(self):
        """Used in test fixtures."""
        self._records.clear()


limiter = RateLimiter()


def rate_limit_ip(max_requests: int, window_seconds: int):
    """Dependency that rate limits based on client IP address."""
    async def dependency(request: Request):
        client_ip = request.client.host if request.client else "unknown"
        endpoint = request.url.path
        key = f"ip:{client_ip}:{endpoint}"
        limiter.check(key=key, max_requests=max_requests, window_seconds=window_seconds)
    return dependency


def rate_limit_user(max_requests: int, window_seconds: int):
    """Dependency that rate limits based on authenticated user ID."""
    async def dependency(request: Request):
        user = getattr(request.state, "user", None)
        user_key = f"user:{user.id if user else 'anonymous'}:{request.url.path}"
        limiter.check(key=user_key, max_requests=max_requests, window_seconds=window_seconds)
    return dependency
