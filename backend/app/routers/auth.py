from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token
from app.core.config import settings
from app.core.errors import UnauthorizedError, DuplicateResourceError
from app.core.rate_limiter import rate_limit_ip
from app.models.user import User
from app.routers.deps import get_current_user
from app.schemas.auth import (
    UserCreate,
    UserOut,
    UserProfileUpdate,
    UserPreferencesOut,
    UserPreferencesUpdate,
    Token,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    AuthMessageResponse,
)
from app.services.auth_service import (
    create_user,
    authenticate_user,
    request_password_reset,
    reset_password_with_token,
    change_user_password,
    update_user_profile,
    get_or_create_user_preferences,
    update_user_preferences,
    UsernameOrEmailTakenError,
)
from app.utils.logger import logger

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit_ip(settings.RATE_LIMIT_REGISTER_MAX, settings.RATE_LIMIT_REGISTER_WINDOW))],
    summary="Register a new user account"
)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    try:
        user = create_user(db, user_in)
        logger.info(f"User registered successfully: username='{user.username}', id={user.id}")
        return user
    except UsernameOrEmailTakenError:
        logger.warning(f"Registration failed: username or email already taken '{user_in.username}'")
        raise DuplicateResourceError("Username or email already registered")


@router.post(
    "/login",
    response_model=Token,
    dependencies=[Depends(rate_limit_ip(settings.RATE_LIMIT_LOGIN_MAX, settings.RATE_LIMIT_LOGIN_WINDOW))],
    summary="User login obtaining JWT token"
)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        logger.warning(f"Login failed: invalid credentials for username '{form_data.username}'")
        raise UnauthorizedError("Incorrect username or password")

    access_token = create_access_token(subject=str(user.id))
    logger.info(f"User login successful: username='{user.username}', id={user.id}")
    return Token(access_token=access_token)



@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current authenticated user profile"
)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch(
    "/me",
    response_model=UserOut,
    summary="Update current authenticated user username or email"
)
def update_current_user_profile(
    profile_in: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_user_profile(
        db,
        current_user,
        username=profile_in.username,
        email=profile_in.email,
    )


@router.get(
    "/preferences",
    response_model=UserPreferencesOut,
    summary="Get current user platform preferences"
)
def read_user_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_or_create_user_preferences(db, current_user.id)


@router.patch(
    "/preferences",
    response_model=UserPreferencesOut,
    summary="Update current user platform preferences"
)
def update_preferences(
    prefs_in: UserPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_user_preferences(
        db,
        current_user.id,
        theme=prefs_in.theme,
        default_scan_type=prefs_in.default_scan_type,
    )


@router.post(
    "/change-password",
    response_model=AuthMessageResponse,
    summary="Change password for authenticated user"
)
def change_password(
    req: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    change_user_password(db, current_user, req.current_password, req.new_password)
    return AuthMessageResponse(message="Password changed successfully.")


@router.post(
    "/forgot-password",
    response_model=AuthMessageResponse,
    dependencies=[Depends(rate_limit_ip(settings.RATE_LIMIT_FORGOT_PW_MAX, settings.RATE_LIMIT_FORGOT_PW_WINDOW))],
    summary="Request a password reset link (enumeration-safe)"
)
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    request_password_reset(db, req.email)
    return AuthMessageResponse(
        message="If an account exists for this email, a password reset link has been sent."
    )


@router.post(
    "/reset-password",
    response_model=AuthMessageResponse,
    dependencies=[Depends(rate_limit_ip(settings.RATE_LIMIT_RESET_PW_MAX, settings.RATE_LIMIT_RESET_PW_WINDOW))],
    summary="Reset account password using secure single-use token"
)
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    reset_password_with_token(db, req.token, req.new_password)
    return AuthMessageResponse(
        message="Password has been successfully reset. You may now log in with your new password."
    )




