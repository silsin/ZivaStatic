import asyncio
import uuid
from datetime import datetime
from typing import Any, Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin
from app.config import settings
from app.database import get_db
from app.models.admin_settings import AdminSetting
from app.models.price_override import PriceOverride
from app.services.hetzner import server_type_for_location
from app.models.server import Server
from app.models.subscription import Subscription
from app.models.user import User
from app.services.hetzner import delete_server

router = APIRouter()


# ── Pydantic schemas ────────────────────────────────────────────────────────

class StatsOut(BaseModel):
    total_users: int
    total_servers: int
    total_revenue: float
    servers_by_status: dict[str, int]


class AdminUserOut(BaseModel):
    id: uuid.UUID
    email: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    server_count: int
    subscription_status: Optional[str]

    model_config = {"from_attributes": True}


class AdminUserPatch(BaseModel):
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None


class AdminServerOut(BaseModel):
    id: uuid.UUID
    user_email: str
    name: str
    ip_address: Optional[str]
    location: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminSubscriptionOut(BaseModel):
    id: uuid.UUID
    user_email: str
    plan_name: str
    price_usd: float
    status: str
    started_at: Optional[datetime]
    ends_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminSubscriptionPatch(BaseModel):
    status: str


class PriceOverrideIn(BaseModel):
    location_name: str
    price_usd: float
    is_active: bool = True


class PriceOverrideOut(BaseModel):
    id: uuid.UUID
    location_name: str
    price_usd: float
    is_active: bool
    updated_at: datetime

    model_config = {"from_attributes": True}


class SettingIn(BaseModel):
    key: str
    value: str


class SettingOut(BaseModel):
    key: str
    value: str
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserDetailOut(BaseModel):
    id: uuid.UUID
    email: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    servers: list[dict]
    subscriptions: list[dict]

    model_config = {"from_attributes": True}


# ── Stats ───────────────────────────────────────────────────────────────────

@router.get("/stats", response_model=StatsOut)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    total_users = (await db.execute(func.count(User.id).select())).scalar_one()
    total_servers = (await db.execute(func.count(Server.id).select())).scalar_one()

    revenue_result = await db.execute(
        select(func.coalesce(func.sum(Subscription.price_usd), 0.0)).where(
            Subscription.status == "active"
        )
    )
    total_revenue = float(revenue_result.scalar_one())

    statuses_result = await db.execute(
        select(Server.status, func.count(Server.id)).group_by(Server.status)
    )
    servers_by_status = {row[0]: row[1] for row in statuses_result.all()}

    return StatsOut(
        total_users=total_users,
        total_servers=total_servers,
        total_revenue=total_revenue,
        servers_by_status=servers_by_status,
    )


# ── Users ───────────────────────────────────────────────────────────────────

@router.get("/users", response_model=list[AdminUserOut])
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    q = select(User)
    if search:
        q = q.where(User.email.ilike(f"%{search}%"))
    q = q.offset((page - 1) * limit).limit(limit).order_by(User.created_at.desc())
    result = await db.execute(q)
    users = result.scalars().all()

    out = []
    for u in users:
        servers_result = await db.execute(
            select(func.count(Server.id)).where(Server.user_id == u.id)
        )
        server_count = servers_result.scalar_one()

        sub_result = await db.execute(
            select(Subscription.status)
            .where(Subscription.user_id == u.id)
            .order_by(Subscription.created_at.desc())
            .limit(1)
        )
        sub_status = sub_result.scalar_one_or_none()

        out.append(
            AdminUserOut(
                id=u.id,
                email=u.email,
                is_active=u.is_active,
                is_admin=u.is_admin,
                created_at=u.created_at,
                server_count=server_count,
                subscription_status=sub_status,
            )
        )
    return out


@router.get("/users/{user_id}", response_model=UserDetailOut)
async def get_user_detail(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    servers_result = await db.execute(select(Server).where(Server.user_id == user_id))
    servers = [
        {
            "id": str(s.id),
            "name": s.name,
            "ip_address": s.ip_address,
            "location": s.location,
            "status": s.status,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in servers_result.scalars().all()
    ]

    subs_result = await db.execute(
        select(Subscription)
        .where(Subscription.user_id == user_id)
        .order_by(Subscription.created_at.desc())
    )
    subscriptions = [
        {
            "id": str(sub.id),
            "plan_name": sub.plan_name,
            "price_usd": sub.price_usd,
            "status": sub.status,
            "started_at": sub.started_at.isoformat() if sub.started_at else None,
            "ends_at": sub.ends_at.isoformat() if sub.ends_at else None,
            "created_at": sub.created_at.isoformat() if sub.created_at else None,
        }
        for sub in subs_result.scalars().all()
    ]

    return UserDetailOut(
        id=user.id,
        email=user.email,
        is_active=user.is_active,
        is_admin=user.is_admin,
        created_at=user.created_at,
        servers=servers,
        subscriptions=subscriptions,
    )


@router.patch("/users/{user_id}", response_model=AdminUserOut)
async def update_user(
    user_id: uuid.UUID,
    body: AdminUserPatch,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if body.is_active is not None:
        user.is_active = body.is_active
    if body.is_admin is not None:
        user.is_admin = body.is_admin

    await db.commit()
    await db.refresh(user)

    servers_result = await db.execute(
        select(func.count(Server.id)).where(Server.user_id == user.id)
    )
    server_count = servers_result.scalar_one()

    sub_result = await db.execute(
        select(Subscription.status)
        .where(Subscription.user_id == user.id)
        .order_by(Subscription.created_at.desc())
        .limit(1)
    )
    sub_status = sub_result.scalar_one_or_none()

    return AdminUserOut(
        id=user.id,
        email=user.email,
        is_active=user.is_active,
        is_admin=user.is_admin,
        created_at=user.created_at,
        server_count=server_count,
        subscription_status=sub_status,
    )


# ── Servers ─────────────────────────────────────────────────────────────────

@router.get("/servers", response_model=list[AdminServerOut])
async def list_all_servers(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Server, User.email).join(User, Server.user_id == User.id))
    rows = result.all()
    return [
        AdminServerOut(
            id=s.id,
            user_email=email,
            name=s.name,
            ip_address=s.ip_address,
            location=s.location,
            status=s.status,
            created_at=s.created_at,
        )
        for s, email in rows
    ]


@router.delete("/servers/{server_id}", status_code=status.HTTP_204_NO_CONTENT)
async def force_delete_server(
    server_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Server).where(Server.id == server_id))
    server = result.scalar_one_or_none()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")

    if server.hetzner_server_id:
        await delete_server(server.hetzner_server_id)

    # Disassociate from subscriptions
    subs_result = await db.execute(
        select(Subscription).where(Subscription.server_id == server_id)
    )
    for sub in subs_result.scalars().all():
        sub.server_id = None

    await db.delete(server)
    await db.commit()


# ── Subscriptions ────────────────────────────────────────────────────────────

@router.get("/subscriptions", response_model=list[AdminSubscriptionOut])
async def list_all_subscriptions(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(Subscription, User.email)
        .join(User, Subscription.user_id == User.id)
        .order_by(Subscription.created_at.desc())
    )
    rows = result.all()
    return [
        AdminSubscriptionOut(
            id=sub.id,
            user_email=email,
            plan_name=sub.plan_name,
            price_usd=sub.price_usd,
            status=sub.status,
            started_at=sub.started_at,
            ends_at=sub.ends_at,
            created_at=sub.created_at,
        )
        for sub, email in rows
    ]


@router.patch("/subscriptions/{sub_id}", response_model=AdminSubscriptionOut)
async def update_subscription(
    sub_id: uuid.UUID,
    body: AdminSubscriptionPatch,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Subscription).where(Subscription.id == sub_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    sub.status = body.status
    if body.status == "active" and not sub.started_at:
        sub.started_at = datetime.utcnow()
    await db.commit()
    await db.refresh(sub)

    user_result = await db.execute(select(User).where(User.id == sub.user_id))
    user = user_result.scalar_one()

    return AdminSubscriptionOut(
        id=sub.id,
        user_email=user.email,
        plan_name=sub.plan_name,
        price_usd=sub.price_usd,
        status=sub.status,
        started_at=sub.started_at,
        ends_at=sub.ends_at,
        created_at=sub.created_at,
    )


# ── Prices ───────────────────────────────────────────────────────────────────

@router.get("/prices", response_model=list[PriceOverrideOut])
async def list_prices(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(PriceOverride).order_by(PriceOverride.location_name))
    return result.scalars().all()


@router.post("/prices", response_model=PriceOverrideOut)
async def upsert_price(
    body: PriceOverrideIn,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(PriceOverride).where(PriceOverride.location_name == body.location_name)
    )
    override = result.scalar_one_or_none()
    if override:
        override.price_usd = body.price_usd
        override.is_active = body.is_active
        override.updated_at = datetime.utcnow()
    else:
        override = PriceOverride(
            location_name=body.location_name,
            price_usd=body.price_usd,
            is_active=body.is_active,
        )
        db.add(override)
    await db.commit()
    await db.refresh(override)
    return override


@router.delete("/prices/{location_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_price(
    location_name: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(PriceOverride).where(PriceOverride.location_name == location_name)
    )
    override = result.scalar_one_or_none()
    if not override:
        raise HTTPException(status_code=404, detail="Price override not found")
    await db.delete(override)
    await db.commit()


# ── Settings ─────────────────────────────────────────────────────────────────

@router.get("/settings", response_model=list[SettingOut])
async def list_settings(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(AdminSetting).order_by(AdminSetting.key))
    return result.scalars().all()


@router.post("/settings", response_model=SettingOut)
async def upsert_setting(
    body: SettingIn,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(AdminSetting).where(AdminSetting.key == body.key)
    )
    setting = result.scalar_one_or_none()
    if setting:
        setting.value = body.value
        setting.updated_at = datetime.utcnow()
    else:
        setting = AdminSetting(key=body.key, value=body.value)
        db.add(setting)
    await db.commit()
    await db.refresh(setting)
    return setting


# ── Hetzner prices ────────────────────────────────────────────────────────────

@router.get("/hetzner-prices")
async def get_hetzner_prices(
    _: User = Depends(get_current_admin),
):
    """Fetch real server type pricing from Hetzner API."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.hetzner.cloud/v1/server_types",
                headers={"Authorization": f"Bearer {settings.HETZNER_API_TOKEN}"},
            )
        if response.status_code != 200:
            return {"server_types": [], "error": "Failed to fetch Hetzner prices"}

        data = response.json()
        server_types = []
        for st in data.get("server_types", []):
            if st.get("deprecated"):
                continue
            prices = st.get("prices", [])
            by_location = {}
            for entry in prices:
                gross = entry.get("price_monthly", {}).get("gross")
                if gross:
                    by_location[entry.get("location")] = float(gross)
            # Headline price: Falkenstein if sold there, otherwise the first location listed
            monthly_gross = by_location.get("fsn1") or (next(iter(by_location.values()), None))
            server_types.append({
                "name": st["name"],
                "description": st.get("description", ""),
                "cores": st.get("cores"),
                "memory": st.get("memory"),
                "disk": st.get("disk"),
                "monthly_price_gross": monthly_gross,
                "prices_by_location": by_location,
            })
        return {
            "server_types": server_types,
            "location_server_types": {
                loc: server_type_for_location(loc)
                for loc in ("fsn1", "nbg1", "hel1", "ash", "hil", "sin")
            },
        }
    except Exception as e:
        return {"server_types": [], "error": str(e)}
