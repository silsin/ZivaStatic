"""admin panel: add is_admin to users, create admin_settings and price_overrides tables

Revision ID: 002_admin_panel
Revises: 0001
Create Date: 2024-01-01 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_admin_panel'
down_revision: Union[str, None] = '0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add is_admin to users table
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=False, server_default='false'))

    # Create admin_settings table
    op.create_table(
        'admin_settings',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('key', sa.String(), nullable=False),
        sa.Column('value', sa.Text(), nullable=False, server_default=''),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_admin_settings_key'), 'admin_settings', ['key'], unique=True)

    # Create price_overrides table
    op.create_table(
        'price_overrides',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('location_name', sa.String(), nullable=False),
        sa.Column('price_usd', sa.Float(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_price_overrides_location_name'), 'price_overrides', ['location_name'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_price_overrides_location_name'), table_name='price_overrides')
    op.drop_table('price_overrides')
    op.drop_index(op.f('ix_admin_settings_key'), table_name='admin_settings')
    op.drop_table('admin_settings')
    op.drop_column('users', 'is_admin')
