"""
Reusable Server-Side Data Ownership & User Isolation Layer.
Ensures authenticated users can only query, view, or modify resources they own.
"""
from typing import Type, TypeVar, Optional, Any
from sqlalchemy.orm import Session
from app.core.errors import NotFoundError
from app.models.user import User

T = TypeVar("T")


class OwnershipService:
    """
    Reusable authorization service verifying that an entity belongs to current_user.id.
    Prevents cross-user ID tampering and resource enumeration.
    """

    @staticmethod
    def get_user_resource_or_404(
        db: Session,
        model_cls: Type[T],
        resource_id: int,
        user_id: int,
        resource_name: str = "Resource",
        options: Optional[list] = None
    ) -> T:
        """
        Retrieves a database entity filtered by both `id` and `user_id`.
        Returns 404 (Resource Not Found) if missing OR owned by another user.
        """
        query = db.query(model_cls)
        if options:
            for opt in options:
                query = query.options(opt)

        resource = query.filter(
            getattr(model_cls, "id") == resource_id,
            getattr(model_cls, "user_id") == user_id,
        ).first()

        if not resource:
            raise NotFoundError(f"{resource_name} not found")

        return resource
