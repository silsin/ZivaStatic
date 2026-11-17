#!/usr/bin/env bash
# setup_wireguard.sh — Install and configure WireGuard on Ubuntu 22.04 (non-interactive)
# Runs as root on a fresh server via SSH.
set -euo pipefail

WG_DIR="/etc/wireguard"
SERVER_CONF="${WG_DIR}/wg0.conf"
SERVER_PRIV_KEY="${WG_DIR}/server_private.key"
SERVER_PUB_KEY="${WG_DIR}/server_public.key"
CLIENT_PRIV_KEY="${WG_DIR}/client_private.key"
CLIENT_PUB_KEY="${WG_DIR}/client_public.key"
CLIENT_CONF="/root/wg-client.conf"
WG_PORT=51820
SERVER_ADDR="10.0.0.1/24"
CLIENT_ADDR="10.0.0.2/32"
CLIENT_IFACE_ADDR="10.0.0.2/24"
CLIENT_DNS="1.1.1.1"

# ---------------------------------------------------------------------------
# Install packages
# ---------------------------------------------------------------------------
echo "[setup_wireguard] Installing WireGuard ..."
apt-get update -qq
apt-get install -y -qq wireguard wireguard-tools qrencode

# ---------------------------------------------------------------------------
# Generate server key pair
# ---------------------------------------------------------------------------
echo "[setup_wireguard] Generating server keys ..."
mkdir -p "${WG_DIR}"
chmod 700 "${WG_DIR}"
wg genkey | tee "${SERVER_PRIV_KEY}" | wg pubkey > "${SERVER_PUB_KEY}"
chmod 600 "${SERVER_PRIV_KEY}"

# ---------------------------------------------------------------------------
# Generate client key pair
# ---------------------------------------------------------------------------
echo "[setup_wireguard] Generating client keys ..."
wg genkey | tee "${CLIENT_PRIV_KEY}" | wg pubkey > "${CLIENT_PUB_KEY}"
chmod 600 "${CLIENT_PRIV_KEY}"

# ---------------------------------------------------------------------------
# Detect primary network interface for NAT rules
# ---------------------------------------------------------------------------
NET_IFACE=$(ip route | grep default | awk '{print $5}' | head -n1)
if [[ -z "${NET_IFACE}" ]]; then
    echo "[setup_wireguard] ERROR: Could not detect default network interface." >&2
    exit 1
fi
echo "[setup_wireguard] Detected network interface: ${NET_IFACE}"

# ---------------------------------------------------------------------------
# Detect server public IP
# ---------------------------------------------------------------------------
SERVER_IP=$(curl -4 -s --max-time 10 ifconfig.me || curl -4 -s --max-time 10 icanhazip.com || true)
if [[ -z "${SERVER_IP}" ]]; then
    echo "[setup_wireguard] ERROR: Could not detect server public IP." >&2
    exit 1
fi
echo "[setup_wireguard] Detected server public IP: ${SERVER_IP}"

# ---------------------------------------------------------------------------
# Read keys into variables
# ---------------------------------------------------------------------------
SERVER_PRIV=$(cat "${SERVER_PRIV_KEY}")
SERVER_PUB=$(cat "${SERVER_PUB_KEY}")
CLIENT_PRIV=$(cat "${CLIENT_PRIV_KEY}")
CLIENT_PUB=$(cat "${CLIENT_PUB_KEY}")

# ---------------------------------------------------------------------------
# Write server config
# ---------------------------------------------------------------------------
echo "[setup_wireguard] Writing server config to ${SERVER_CONF} ..."
cat > "${SERVER_CONF}" <<EOF
[Interface]
PrivateKey = ${SERVER_PRIV}
Address = ${SERVER_ADDR}
ListenPort = ${WG_PORT}
PostUp   = iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o ${NET_IFACE} -j MASQUERADE; iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -s 10.0.0.0/24 -o ${NET_IFACE} -j MASQUERADE; iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT

[Peer]
# client
PublicKey  = ${CLIENT_PUB}
AllowedIPs = ${CLIENT_ADDR}
EOF
chmod 600 "${SERVER_CONF}"

# ---------------------------------------------------------------------------
# Enable IP forwarding
# ---------------------------------------------------------------------------
echo "[setup_wireguard] Enabling IP forwarding ..."
sysctl -w net.ipv4.ip_forward=1
grep -qxF 'net.ipv4.ip_forward=1' /etc/sysctl.conf \
    || echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf

# ---------------------------------------------------------------------------
# Enable and start WireGuard
# ---------------------------------------------------------------------------
echo "[setup_wireguard] Starting wg-quick@wg0 ..."
systemctl enable wg-quick@wg0
systemctl start  wg-quick@wg0

# ---------------------------------------------------------------------------
# Write client config
# ---------------------------------------------------------------------------
echo "[setup_wireguard] Writing client config to ${CLIENT_CONF} ..."
cat > "${CLIENT_CONF}" <<EOF
[Interface]
PrivateKey = ${CLIENT_PRIV}
Address = ${CLIENT_IFACE_ADDR}
DNS = ${CLIENT_DNS}

[Peer]
PublicKey = ${SERVER_PUB}
Endpoint = ${SERVER_IP}:${WG_PORT}
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
EOF
chmod 600 "${CLIENT_CONF}"

echo "[setup_wireguard] Done. Client config: ${CLIENT_CONF}"
exit 0
