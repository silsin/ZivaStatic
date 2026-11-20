import asyncio
from hcloud import Client
from hcloud.images import Image
from hcloud.server_types import ServerType
from hcloud.locations import Location
from hcloud.ssh_keys import SSHKey
from hcloud.servers import ServerCreatePublicNetwork

from app.config import settings

EU_LOCATIONS = {"fsn1", "nbg1", "hel1"}


def server_type_for_location(location_name: str) -> str:
    """Server type to order for a location (cx* is only sold in EU datacenters)."""
    if location_name in EU_LOCATIONS:
        return settings.HETZNER_SERVER_TYPE
    return settings.HETZNER_SERVER_TYPE_OTHER


COUNTRY_FLAG: dict[str, str] = {
    "DE": "🇩🇪",
    "US": "🇺🇸",
    "FI": "🇫🇮",
    "SG": "🇸🇬",
    "PL": "🇵🇱",
    "GB": "🇬🇧",
    "FR": "🇫🇷",
    "NL": "🇳🇱",
    "AT": "🇦🇹",
    "SE": "🇸🇪",
    "NO": "🇳🇴",
    "CH": "🇨🇭",
    "CZ": "🇨🇿",
    "IT": "🇮🇹",
    "ES": "🇪🇸",
    "PT": "🇵🇹",
    "CA": "🇨🇦",
    "AU": "🇦🇺",
    "JP": "🇯🇵",
}


def _get_client() -> Client:
    return Client(token=settings.HETZNER_API_TOKEN)


def list_locations_sync() -> list[dict]:
    client = _get_client()
    locations = client.locations.get_all()
    result = []
    for loc in locations:
        country = loc.country.upper() if loc.country else ""
        flag = COUNTRY_FLAG.get(country, "🌍")
        result.append(
            {
                "id": loc.id,
                "name": loc.name,
                "city": loc.city,
                "country": country,
                "flag_emoji": flag,
                "description": f"{flag} {loc.city}, {country}",
            }
        )
    return result


def create_server_sync(
    name: str,
    location_name: str,
    server_type: str | None = None,
    ssh_public_key: str = None,
) -> dict:
    server_type = server_type or server_type_for_location(location_name)
    client = _get_client()

    ssh_key_objects = []
    if ssh_public_key:
        key_name = f"key-{name}"
        # Try to find existing key with the same name and delete it first
        existing = client.ssh_keys.get_by_name(key_name)
        if existing:
            existing.delete()
        created_key = client.ssh_keys.create(name=key_name, public_key=ssh_public_key)
        ssh_key_objects.append(created_key)

    response = client.servers.create(
        name=name,
        server_type=ServerType(name=server_type),
        image=Image(name="ubuntu-22.04"),
        location=Location(name=location_name),
        ssh_keys=ssh_key_objects,
    )

    server = response.server
    root_password = response.root_password

    # Wait for the action to complete (non-blocking poll)
    action = response.action
    if action:
        try:
            action.wait_until_finished(max_retries=60)
        except Exception:
            pass  # Server may already be running; status check handles the rest

    return {
        "hetzner_server_id": server.id,
        "ip_address": server.public_net.ipv4.ip if server.public_net.ipv4 else None,
        "name": server.name,
        "location": location_name,
        "root_password": root_password,
    }


def delete_server_sync(hetzner_server_id: int) -> bool:
    client = _get_client()
    try:
        server = client.servers.get_by_id(hetzner_server_id)
        if server is None:
            return False
        server.delete()
        return True
    except Exception:
        return False


def get_server_status_sync(hetzner_server_id: int) -> str:
    client = _get_client()
    server = client.servers.get_by_id(hetzner_server_id)
    if server is None:
        return "not_found"
    return server.status


# ── Async wrappers ──────────────────────────────────────────────────────────

async def list_locations() -> list[dict]:
    return await asyncio.to_thread(list_locations_sync)


async def create_server(
    name: str,
    location_name: str,
    server_type: str | None = None,
    ssh_public_key: str = None,
) -> dict:
    return await asyncio.to_thread(
        create_server_sync, name, location_name, server_type, ssh_public_key
    )


async def delete_server(hetzner_server_id: int) -> bool:
    return await asyncio.to_thread(delete_server_sync, hetzner_server_id)
