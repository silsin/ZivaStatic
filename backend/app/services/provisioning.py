import io
import os
import time
import logging

import paramiko
from sqlalchemy.orm import Session

from app.models.server import Server
from app.models.vpn_config import VpnConfig
from app.services.hetzner import get_server_status_sync

logger = logging.getLogger(__name__)

SCRIPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "scripts")

# Remote paths where each setup script deposits its client config
CONFIG_PATHS: dict[str, str] = {
    "openvpn": "/root/client.ovpn",
    "wireguard": "/root/wg-client.conf",
    "ikev2": "/root/ikev2-client.conf",
    "v2ray": "/root/v2ray-client.json",
}


def wait_for_server(hetzner_server_id: int, max_wait: int = 300) -> bool:
    elapsed = 0
    interval = 10
    while elapsed < max_wait:
        status = get_server_status_sync(hetzner_server_id)
        logger.info("Server %s status: %s", hetzner_server_id, status)
        if status == "running":
            return True
        time.sleep(interval)
        elapsed += interval
    return False


def ssh_connect(
    ip: str,
    private_key_str: str = None,
    root_password: str = None,
    retries: int = 10,
) -> paramiko.SSHClient:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    pkey = None
    if private_key_str:
        pkey = paramiko.RSAKey.from_private_key(io.StringIO(private_key_str))

    last_exc: Exception = RuntimeError("SSH connection failed")
    for attempt in range(1, retries + 1):
        try:
            if pkey:
                client.connect(
                    hostname=ip,
                    username="root",
                    pkey=pkey,
                    timeout=15,
                    banner_timeout=30,
                )
            elif root_password:
                client.connect(
                    hostname=ip,
                    username="root",
                    password=root_password,
                    timeout=15,
                    banner_timeout=30,
                )
            else:
                raise RuntimeError("No SSH key or root password provided")

            logger.info("SSH connected to %s on attempt %d", ip, attempt)
            return client
        except Exception as exc:
            last_exc = exc
            logger.warning("SSH attempt %d/%d to %s failed: %s", attempt, retries, ip, exc)
            time.sleep(15)

    raise RuntimeError(f"Could not SSH into {ip} after {retries} attempts: {last_exc}")


def run_script_on_server(
    ssh: paramiko.SSHClient, script_path: str, env_vars: dict = None
) -> str:
    sftp = ssh.open_sftp()
    remote_script = "/tmp/" + os.path.basename(script_path)
    try:
        sftp.put(script_path, remote_script)
    finally:
        sftp.close()

    # Make executable
    _exec(ssh, f"chmod +x {remote_script}")

    # Build env prefix
    env_prefix = ""
    if env_vars:
        env_prefix = " ".join(f'{k}={v}' for k, v in env_vars.items()) + " "

    command = f"sudo {env_prefix}bash {remote_script}"
    stdout_data = _exec(ssh, command)
    return stdout_data


def _exec(ssh: paramiko.SSHClient, command: str) -> str:
    stdin, stdout, stderr = ssh.exec_command(command, timeout=600)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    if exit_code != 0:
        raise RuntimeError(
            f"Command failed (exit {exit_code}):\n  cmd: {command}\n  stderr: {err}"
        )
    return out


def fetch_file_from_server(ssh: paramiko.SSHClient, remote_path: str) -> str:
    sftp = ssh.open_sftp()
    try:
        with sftp.open(remote_path, "r") as f:
            return f.read().decode("utf-8", errors="replace")
    finally:
        sftp.close()


def provision_server(server_id: str, db: Session) -> None:
    server: Server | None = db.query(Server).filter(Server.id == server_id).first()
    if not server:
        raise ValueError(f"Server {server_id} not found")

    ssh = None
    try:
        # 1. Wait for Hetzner server to reach running state
        logger.info("Waiting for Hetzner server %s to be running…", server.hetzner_server_id)
        ready = wait_for_server(server.hetzner_server_id, max_wait=300)
        if not ready:
            raise TimeoutError(
                f"Hetzner server {server.hetzner_server_id} did not become running in time"
            )

        # 2. SSH connect
        logger.info("Connecting via SSH to %s…", server.ip_address)
        ssh = ssh_connect(
            server.ip_address,
            private_key_str=server.ssh_private_key,
            root_password=server.root_password,
        )

        # 3. Provision each protocol
        for protocol, config_remote_path in CONFIG_PATHS.items():
            script_file = os.path.join(SCRIPTS_DIR, f"setup_{protocol}.sh")
            if not os.path.exists(script_file):
                logger.warning("Script not found for %s, skipping: %s", protocol, script_file)
                continue

            logger.info("Running %s setup script…", protocol)
            try:
                run_script_on_server(ssh, script_file, env_vars={"SERVER_IP": server.ip_address})
                config_data = fetch_file_from_server(ssh, config_remote_path)
            except Exception as exc:
                logger.error("Failed to provision %s on server %s: %s", protocol, server_id, exc)
                # Save a placeholder so the user knows this protocol errored
                config_data = f"# Error provisioning {protocol}: {exc}"

            # Upsert VpnConfig
            existing = (
                db.query(VpnConfig)
                .filter(VpnConfig.server_id == server.id, VpnConfig.protocol == protocol)
                .first()
            )
            if existing:
                existing.config_data = config_data
            else:
                db.add(
                    VpnConfig(
                        server_id=server.id,
                        protocol=protocol,
                        config_data=config_data,
                    )
                )

        # 4. Mark server active, clear credentials
        server.status = "active"
        server.ssh_private_key = None
        server.root_password = None
        db.commit()
        logger.info("Server %s provisioned and marked active.", server_id)

    except Exception as exc:
        logger.exception("Provisioning error for server %s: %s", server_id, exc)
        server.status = "error"
        db.commit()
        raise
    finally:
        if ssh:
            ssh.close()
