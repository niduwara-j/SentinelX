"""
Centralized Application Error Hierarchy and Error Code Definitions for SentinelX.
"""
from typing import Any, Optional
from fastapi import status


class ErrorCode:
    VALIDATION_ERROR = "VALIDATION_ERROR"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND"
    DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE"
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
    SCAN_TARGET_INVALID = "SCAN_TARGET_INVALID"
    SCAN_LIMIT_EXCEEDED = "SCAN_LIMIT_EXCEEDED"
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"


class AppException(Exception):
    """Base application exception with standardized code and status."""
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[Any] = None,
        headers: Optional[dict] = None,
    ):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        self.headers = headers or {}


class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found", details: Optional[Any] = None):
        super().__init__(
            code=ErrorCode.RESOURCE_NOT_FOUND,
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            details=details,
        )


class UnauthorizedError(AppException):
    def __init__(self, message: str = "Authentication required or invalid credentials"):
        super().__init__(
            code=ErrorCode.UNAUTHORIZED,
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": "Bearer"},
        )


class ForbiddenError(AppException):
    def __init__(self, message: str = "You do not have permission to perform this action"):
        super().__init__(
            code=ErrorCode.FORBIDDEN,
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
        )


class ValidationError(AppException):
    def __init__(self, message: str = "Invalid request payload", details: Optional[Any] = None):
        super().__init__(
            code=ErrorCode.VALIDATION_ERROR,
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
        )


class DuplicateResourceError(AppException):
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(
            code=ErrorCode.DUPLICATE_RESOURCE,
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class RateLimitExceededError(AppException):
    def __init__(self, message: str = "Too many requests. Please retry later.", retry_after: int = 60):
        super().__init__(
            code=ErrorCode.RATE_LIMIT_EXCEEDED,
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            headers={"Retry-After": str(retry_after)},
        )


class InvalidScanTargetError(AppException):
    def __init__(self, message: str = "Scan target is invalid or malformed"):
        super().__init__(
            code=ErrorCode.SCAN_TARGET_INVALID,
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class ScanLimitExceededError(AppException):
    def __init__(self, message: str = "Active scan limit reached for user"):
        super().__init__(
            code=ErrorCode.SCAN_LIMIT_EXCEEDED,
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
        )
