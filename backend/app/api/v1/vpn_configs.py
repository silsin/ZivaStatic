import io
import uuid

import qrcode
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response, StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api.deps import get_current_user
from app.database import get_db
from app.models.server import Server
from app.models.vpn_config import VpnConfig
from app.models.user import User
from app.schemas.vpn_config import VpnConfigOut

router = APIRouter()

VALID_PROTOCOLS = {"openvpn", "wireguard", "ikev2", "v2ray"}

PROTOCOL_EXTENSIONS = {
    "openvpn": "ovpn",
    "wireguard": "conf",
    "ikev2": "conf",
    "v2ray": "json",
}


async def _get_server_for_user(
    server_id: uuid.UUID, current_user: User, db: AsyncSession
) -> Server:
    result = await db.execute(
        select(Server).where(
            Server.id == server_id,
            Server.user_id == current_user.id,
        )
    )
    server: Server | None = result.scalar_one_or_none()
    if not server:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Server not found")
    return server


@router.get("/{server_id}", response_model=list[VpnConfigOut])
async def list_vpn_configs(
    server_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _get_server_for_user(server_id, current_user, db)

    result = await db.execute(
        select(VpnConfig).where(VpnConfig.server_id == server_id)
    )
    return result.scalars().all()


@router.get("/{server_id}/{protocol}/qr")
async def get_vpn_config_qr(
    server_id: uuid.UUID,
    protocol: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if protocol not in VALID_PROTOCOLS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid protocol. Must be one of: {', '.join(sorted(VALID_PROTOCOLS))}",
        )

    await _get_server_for_user(server_id, current_user, db)

    result = await db.execute(
        select(VpnConfig).where(
            VpnConfig.server_id == server_id,
            VpnConfig.protocol == protocol,
        )
    )
    config: VpnConfig | None = result.scalar_one_or_none()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No {protocol} config found for this server",
        )

    img = qrcode.make(config.config_data)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")


@router.get("/{server_id}/{protocol}")
async def download_vpn_config(
    server_id: uuid.UUID,
    protocol: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if protocol not in VALID_PROTOCOLS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid protocol. Must be one of: {', '.join(sorted(VALID_PROTOCOLS))}",
        )

    await _get_server_for_user(server_id, current_user, db)

    result = await db.execute(
        select(VpnConfig).where(
            VpnConfig.server_id == server_id,
            VpnConfig.protocol == protocol,
        )
    )
    config: VpnConfig | None = result.scalar_one_or_none()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No {protocol} config found for this server",
        )

    ext = PROTOCOL_EXTENSIONS.get(protocol, "txt")
    filename = f"{protocol}-{server_id}.{ext}"

    return Response(
        content=config.config_data,
        media_type="text/plain",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
