from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from ..models.user import User
from ..schemas.auth import UserCreate
from ..core.security import get_password_hash, verify_password
from ..core.exceptions import ConflictError

class AuthService:
    @staticmethod
    async def register(db: AsyncSession, user_data: UserCreate) -> User:
        # Check if user exists
        stmt = select(User).where((User.email == user_data.email) | (User.username == user_data.username))
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise ConflictError("Email or username already registered")
        
        hashed = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    @staticmethod
    async def authenticate(db: AsyncSession, username: str, password: str) -> User:
        stmt = select(User).where(User.username == username)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user