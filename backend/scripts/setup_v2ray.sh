#!/usr/bin/env bash
# setup_v2ray.sh — Install V2Ray (VMess) on Ubuntu 22.04 (non-interactive)
# Runs as root on a fresh server via SSH.
set -euo pipefail

V2RAY_CONF_DIR="/usr/local/etc/v2ray"
V2RAY_CONF="${V2RAY_CONF_DIR}/config.json"
CLIENT_CONF="/root/v2ray-client.json"
VMESS_PORT=10086

# ---------------------------------------------------------------------------
# Dependency check
# ---------------------------------------------------------------------------
if ! command -v curl &>/dev/null; then
    apt-get update -qq
    apt-get install -y -qq curl
fi

# ---------------------------------------------------------------------------
# Detect server public IP
# ---------------------------------------------------------------------------
SERVER_IP=$(curl -4 -s --max-time 10 ifconfig.me || curl -4 -s --max-time 10 icanhazip.com || true)
if [[ -z "${SERVER_IP}" ]]; then
    echo "[setup_v2ray] ERROR: Could not detect server public IP." >&2
    exit 1
fi
echo "[setup_v2ray] Server IP: ${SERVER_IP}"

# ---------------------------------------------------------------------------
# Generate VMess UUID
# ---------------------------------------------------------------------------
UUID=$(cat /proc/sys/kernel/random/uuid)
echo "[setup_v2ray] VMess UUID: ${UUID}"

# ---------------------------------------------------------------------------
# Install V2Ray via official v2fly installer
# ---------------------------------------------------------------------------
echo "[setup_v2ray] Installing V2Ray ..."
bash <(curl -fsSL https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)

# ---------------------------------------------------------------------------
# Write server config
# ---------------------------------------------------------------------------
echo "[setup_v2ray] Writing server config to ${V2RAY_CONF} ..."
mkdir -p "${V2RAY_CONF_DIR}"
cat > "${V2RAY_CONF}" <<EOF
{
  "log": {
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "port": ${VMESS_PORT},
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "${UUID}",
            "alterId": 0,
            "security": "auto"
          }
        ]
      },
      "streamSettings": {
        "network": "tcp"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {},
      "tag": "direct"
    }
  ],
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "type": "field",
        "outboundTag": "direct",
        "network": "tcp,udp"
      }
    ]
  }
}
EOF

# ---------------------------------------------------------------------------
# Enable and start V2Ray
# ---------------------------------------------------------------------------
echo "[setup_v2ray] Enabling and starting v2ray service ..."
systemctl enable v2ray
systemctl restart v2ray

# Wait briefly and confirm it is running
sleep 2
if ! systemctl is-active --quiet v2ray; then
    echo "[setup_v2ray] ERROR: v2ray service did not start." >&2
    journalctl -u v2ray --no-pager -n 20 >&2 || true
    exit 1
fi

# ---------------------------------------------------------------------------
# Write client config
# ---------------------------------------------------------------------------
echo "[setup_v2ray] Writing client config to ${CLIENT_CONF} ..."
cat > "${CLIENT_CONF}" <<EOF
{
  "inbounds": [
    {
      "port": 1080,
      "protocol": "socks",
      "settings": {
        "auth": "noauth"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "${SERVER_IP}",
            "port": ${VMESS_PORT},
            "users": [
              {
                "id": "${UUID}",
                "alterId": 0,
                "security": "auto"
              }
            ]
          }
        ]
      }
    }
  ]
}
EOF
chmod 600 "${CLIENT_CONF}"

echo "[setup_v2ray] Done. Client config: ${CLIENT_CONF}"
exit 0
