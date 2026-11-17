#!/usr/bin/env bash
# setup_openvpn.sh — Install and configure OpenVPN on Ubuntu 22.04 (non-interactive)
# Runs as root on a fresh server via SSH.
set -euo pipefail

# ---------------------------------------------------------------------------
# Environment variables for angristan/openvpn-install (all set before curl)
# ---------------------------------------------------------------------------
export AUTO_INSTALL=y
export APPROVE_INSTALL=y
export APPROVE_IP=y
export IPV6_SUPPORT=n
export PORT_CHOICE=1        # 1 = default port 1194
export PROTOCOL_CHOICE=1    # 1 = UDP
export DNS=1                # 1 = current system resolver
export COMPRESSION_ENABLED=n
export CUSTOMIZE_ENC=n
export CLIENT=client
export PASS=1               # 1 = no password on client key

# ---------------------------------------------------------------------------
# Dependency check
# ---------------------------------------------------------------------------
if ! command -v curl &>/dev/null; then
    apt-get update -qq
    apt-get install -y -qq curl
fi

# ---------------------------------------------------------------------------
# Download and run the angristan openvpn-install script
# ---------------------------------------------------------------------------
INSTALLER_URL="https://raw.githubusercontent.com/angristan/openvpn-install/master/openvpn-install.sh"
INSTALLER_PATH="/tmp/openvpn-install.sh"

echo "[setup_openvpn] Downloading installer from ${INSTALLER_URL} ..."
curl -fsSL "${INSTALLER_URL}" -o "${INSTALLER_PATH}"
chmod +x "${INSTALLER_PATH}"

echo "[setup_openvpn] Running installer (fully non-interactive) ..."
bash "${INSTALLER_PATH}"

# ---------------------------------------------------------------------------
# Verify client config was created
# ---------------------------------------------------------------------------
CLIENT_CONF="/root/${CLIENT}.ovpn"

if [[ ! -f "${CLIENT_CONF}" ]]; then
    echo "[setup_openvpn] ERROR: Expected client config not found at ${CLIENT_CONF}" >&2
    exit 1
fi

echo "[setup_openvpn] Done. Client config: ${CLIENT_CONF}"
exit 0
