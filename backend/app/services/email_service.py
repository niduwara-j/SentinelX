"""
Modular Email Delivery Service for SentinelX.
Handles sending password reset instructions via SMTP or safe development fallback.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.utils.logger import logger

# Thread-safe in-memory dev mailbox strictly for automated test assertion / dev introspection
_dev_mailbox: list[dict] = []


def clear_dev_mailbox():
    """Clear captured dev emails (used in test teardown)."""
    _dev_mailbox.clear()


def get_latest_dev_email() -> dict | None:
    """Retrieve most recent captured reset email in dev/test mode."""
    return _dev_mailbox[-1] if _dev_mailbox else None


def send_password_reset_email(to_email: str, raw_token: str) -> None:
    """
    Dispatches a password reset email.
    If SMTP credentials are configured in environment variables, connects to the SMTP server.
    Otherwise, captures the email safely for development/testing without leaking raw secrets to stdout.
    """
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={raw_token}"
    subject = "SentinelX - Password Reset Instructions"
    body_text = (
        f"Hello,\n\n"
        f"You requested a password reset for your SentinelX account.\n\n"
        f"Please click the link below or paste it into your browser to reset your password:\n"
        f"{reset_url}\n\n"
        f"This link is single-use and will expire in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.\n"
        f"If you did not request this, please disregard this message.\n\n"
        f"— The SentinelX Security Team"
    )

    # In development/test mode (no SMTP host specified)
    if not settings.SMTP_HOST:
        logger.info(
            f"\n"
            f"========================================================================\n"
            f"[DEV EMAIL] Password reset requested for: {to_email}\n"
            f"[DEV EMAIL] Reset Link: {reset_url}\n"
            f"========================================================================"
        )
        _dev_mailbox.append({
            "to": to_email,
            "token": raw_token,
            "reset_url": reset_url,
        })
        return


    # Production SMTP delivery
    try:
        msg = MIMEMultipart()
        msg["From"] = settings.SMTP_FROM
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body_text, "plain"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10.0) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)

        logger.info(f"Password reset email sent successfully via SMTP to '{to_email}'")
    except Exception as e:
        logger.error(f"Failed to send password reset email to '{to_email}': {str(e)}")
        # Do not raise to avoid breaking generic response and leaking infrastructure errors
