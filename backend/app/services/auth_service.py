import secrets
import hashlib
from datetime import datetime, timezone, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.errors import AppException, ErrorCode
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.models.user_preferences import UserPreferences
from app.schemas.auth import UserCreate
from app.services.email_service import send_password_reset_email
from app.utils.logger import logger



class UsernameOrEmailTakenError(Exception):
    pass


def create_user(db: Session, user_in: UserCreate) -> User:
    existing = (
        db.query(User)
        .filter((User.username == user_in.username) | (User.email == user_in.email))
        .first()
    )
    if existing:
        raise UsernameOrEmailTakenError()

    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def request_password_reset(db: Session, email: str) -> None:
    """
    Initiates the forgot-password flow.
    Generates a cryptographically secure token and stores only its SHA-256 hash.
    Dispatches instructions via the email service.
    Account-enumeration safe: always completes silently whether user exists or not.
    """
    user = (
        db.query(User)
        .filter(func.lower(User.email) == email.lower().strip())
        .first()
    )

    if not user:
        logger.info(f"Password reset requested for non-existent or inactive email '{email}' (enumeration suppressed)")
        return

    # Generate 32-byte urlsafe token
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)

    # Invalidate previous unused reset tokens for this user
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used_at.is_(None)
    ).update({"used_at": datetime.now(timezone.utc)})

    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        used_at=None,
    )
    db.add(reset_record)
    db.commit()

    logger.info(f"Generated password reset token for user_id={user.id}")
    send_password_reset_email(user.email, raw_token)


def reset_password_with_token(db: Session, raw_token: str, new_password: str) -> None:
    """
    Validates the supplied reset token against stored SHA-256 hash.
    Checks for single-use and expiration deadlines.
    Updates the user's password hash and invalidates the token.
    """
    token_hash = hashlib.sha256(raw_token.strip().encode("utf-8")).hexdigest()
    now = datetime.now(timezone.utc)

    reset_record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
        )
        .first()
    )

    if not reset_record:
        logger.warning("Password reset failed: token not found or already used")
        raise AppException(
            code="INVALID_RESET_TOKEN",
            message="The password reset link is invalid or has expired. Please request a new one.",
            status_code=400,
        )

    expires_at = reset_record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < now:
        logger.warning("Password reset failed: token expired")
        raise AppException(
            code="INVALID_RESET_TOKEN",
            message="The password reset link is invalid or has expired. Please request a new one.",
            status_code=400,
        )


    user = db.query(User).filter(User.id == reset_record.user_id).first()
    if not user:
        raise AppException(
            code=ErrorCode.RESOURCE_NOT_FOUND,
            message="Associated user account not found",
            status_code=404,
        )

    # Hash new password with existing native bcrypt mechanism
    user.hashed_password = hash_password(new_password)
    user.password_changed_at = now
    reset_record.used_at = now

    db.commit()
    logger.info(f"Password reset successfully executed for user_id={user.id}")


def change_user_password(db: Session, user: User, current_password: str, new_password: str) -> None:
    """
    Allows authenticated users to change their password from the Settings page.
    Verifies the current password, hashes the new password, and updates password_changed_at.
    """
    if not verify_password(current_password, user.hashed_password):
        raise AppException(
            code="INVALID_CREDENTIALS",
            message="The current password you entered is incorrect.",
            status_code=400,
        )

    now = datetime.now(timezone.utc)
    user.hashed_password = hash_password(new_password)
    user.password_changed_at = now
    db.commit()
    logger.info(f"User #{user.id} ({user.username}) successfully changed their password.")


def update_user_profile(
    db: Session,
    current_user: User,
    username: str | None = None,
    email: str | None = None,
) -> User:
    """
    Updates the authenticated user's username and/or email address.
    Enforces uniqueness checks and prevents mass-assignment of sensitive fields.
    """
    now = datetime.now(timezone.utc)

    if username and username.strip() != current_user.username:
        clean_username = username.strip()
        existing = (
            db.query(User)
            .filter(func.lower(User.username) == clean_username.lower(), User.id != current_user.id)
            .first()
        )
        if existing:
            raise AppException(
                code=ErrorCode.DUPLICATE_RESOURCE,
                message="This username is already taken by another account.",
                status_code=400,
            )
        current_user.username = clean_username
        current_user.updated_at = now

    if email and email.strip().lower() != current_user.email.lower():
        clean_email = email.strip().lower()
        existing = (
            db.query(User)
            .filter(func.lower(User.email) == clean_email, User.id != current_user.id)
            .first()
        )
        if existing:
            raise AppException(
                code=ErrorCode.DUPLICATE_RESOURCE,
                message="This email address is already registered to another account.",
                status_code=400,
            )
        current_user.email = clean_email
        current_user.updated_at = now

    db.commit()
    db.refresh(current_user)
    logger.info(f"User #{current_user.id} profile updated: username='{current_user.username}', email='{current_user.email}'")
    return current_user


def get_or_create_user_preferences(db: Session, user_id: int) -> UserPreferences:
    """
    Retrieves or initializes isolated platform preferences for a given user.
    """
    from app.models.user_preferences import UserPreferences

    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == user_id).first()
    if not prefs:
        prefs = UserPreferences(user_id=user_id, theme="dark", default_scan_type="quick")
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs


def update_user_preferences(
    db: Session,
    user_id: int,
    theme: str | None = None,
    default_scan_type: str | None = None,
) -> UserPreferences:
    """
    Updates platform preferences for the authenticated user.
    """
    prefs = get_or_create_user_preferences(db, user_id)
    if theme is not None:
        prefs.theme = theme
    if default_scan_type is not None:
        if default_scan_type not in ("quick", "full"):
            raise AppException(
                code=ErrorCode.VALIDATION_ERROR,
                message="Invalid default_scan_type. Must be 'quick' or 'full'.",
                status_code=400,
            )
        prefs.default_scan_type = default_scan_type
    
    prefs.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(prefs)
    logger.info(f"User #{user_id} preferences updated: theme='{prefs.theme}', default_scan_type='{prefs.default_scan_type}'")
    return prefs



