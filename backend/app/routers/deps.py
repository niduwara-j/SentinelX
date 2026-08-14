from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from datetime import datetime, timezone, timedelta
from app.core.security import decode_access_token_payload
from app.core.config import settings
from app.core.errors import UnauthorizedError


oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    payload = decode_access_token_payload(token)
    if payload is None or "sub" not in payload:
        raise UnauthorizedError("Could not validate credentials token")

    subject = str(payload["sub"])
    token_iat = payload.get("iat")

    if subject.isdigit():
        user = db.query(User).filter(User.id == int(subject)).first()
    else:
        user = db.query(User).filter(User.username == subject).first()

    if user is None or not user.is_active:
        raise UnauthorizedError("User account inactive or not found")


    # Invalidate tokens issued prior to password reset
    if user.password_changed_at and token_iat is not None:
        pw_changed = user.password_changed_at
        if pw_changed.tzinfo is None:
            pw_changed = pw_changed.replace(tzinfo=timezone.utc)

        # Invalidate any token issued prior to or at the time of password reset
        if token_iat <= int(pw_changed.timestamp()):
            raise UnauthorizedError("Session has expired due to a recent password change. Please log in again.")

    return user



