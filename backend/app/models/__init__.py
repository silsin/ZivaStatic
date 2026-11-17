from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all model modules here so Alembic autogenerate can detect them.
# Example: from app.models.user import User  # noqa: F401
