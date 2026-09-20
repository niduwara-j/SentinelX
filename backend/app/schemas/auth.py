from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserProfileUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50, description="New desired username")
    email: Optional[EmailStr] = Field(None, description="New desired email address")


class UserPreferencesOut(BaseModel):
    theme: str = "dark"
    default_scan_type: str = "quick"
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserPreferencesUpdate(BaseModel):
    theme: Optional[Literal["dark", "light", "system"]] = None
    default_scan_type: Optional[Literal["quick", "full"]] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(description="Account email address")


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=16, description="Password reset verification token")
    new_password: str = Field(min_length=8, max_length=128, description="New secure password")


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, description="Current account password")
    new_password: str = Field(min_length=8, max_length=128, description="New secure password")


class AuthMessageResponse(BaseModel):
    message: str



