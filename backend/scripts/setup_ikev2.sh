#!/usr/bin/env bash
# setup_ikev2.sh — Install StrongSwan IKEv2 VPN on Ubuntu 22.04 (non-interactive)
# Runs as root on a fresh server via SSH.
set -euo pipefail

# ---------------------------------------------------------------------------
# Configurable credentials (override via environment if desired)
# ---------------------------------------------------------------------------
IKEV2_USER="${IKEV2_USER:-vpnuser}"
IKEV2_PASS="${IKEV2_PASS:-VpnPass2024!}"

PKI_DIR="/etc/ipsec.d"
CLIENT_CONF="/root/ikev2-client.conf"
VPN_POOL="10.10.10.0/24"
VPN_DNS="1.1.1.1"

# ---------------------------------------------------------------------------
# Detect server public IP
# ---------------------------------------------------------------------------
SERVER_IP=$(curl -4 -s --max-time 10 ifconfig.me || curl -4 -s --max-time 10 icanhazip.com || true)
if [[ -z "${SERVER_IP}" ]]; then
    echo "[setup_ikev2] ERROR: Could not detect server public IP." >&2
    exit 1
fi
echo "[setup_ikev2] Server IP: ${SERVER_IP}"

# ---------------------------------------------------------------------------
# Install StrongSwan
# ---------------------------------------------------------------------------
echo "[setup_ikev2] Installing StrongSwan ..."
apt-get update -qq
apt-get install -y -qq \
    strongswan \
    strongswan-pki \
    libcharon-extra-plugins \
    libcharon-extauth-plugins \
    libstrongswan-extra-plugins \
    iptables

# ---------------------------------------------------------------------------
# Generate CA key and self-signed certificate
# ---------------------------------------------------------------------------
echo "[setup_ikev2] Generating CA key and certificate ..."
ipsec pki --gen \
    --type rsa \
    --size 4096 \
    --outform pem \
    > "${PKI_DIR}/private/ca.key.pem"
chmod 600 "${PKI_DIR}/private/ca.key.pem"

ipsec pki --self \
    --ca \
    --lifetime 3650 \
    --in "${PKI_DIR}/private/ca.key.pem" \
    --type rsa \
    --dn "CN=VPN CA" \
    --outform pem \
    > "${PKI_DIR}/cacerts/ca.cert.pem"

# ---------------------------------------------------------------------------
# Generate server key and certificate signed by the CA
# ---------------------------------------------------------------------------
echo "[setup_ikev2] Generating server key and certificate ..."
ipsec pki --gen \
    --type rsa \
    --size 4096 \
    --outform pem \
    > "${PKI_DIR}/private/server.key.pem"
chmod 600 "${PKI_DIR}/private/server.key.pem"

ipsec pki --pub \
    --in "${PKI_DIR}/private/server.key.pem" \
    --type rsa \
    | ipsec pki --issue \
        --lifetime 1825 \
        --cacert "${PKI_DIR}/cacerts/ca.cert.pem" \
        --cakey  "${PKI_DIR}/private/ca.key.pem" \
        --dn "CN=${SERVER_IP}" \
        --san "${SERVER_IP}" \
        --flag serverAuth \
        --flag ikeIntermediate \
        --outform pem \
    > "${PKI_DIR}/certs/server.cert.pem"

# ---------------------------------------------------------------------------
# Generate client key and certificate signed by the CA
# ---------------------------------------------------------------------------
echo "[setup_ikev2] Generating client key and certificate ..."
ipsec pki --gen \
    --type rsa \
    --size 4096 \
    --outform pem \
    > "${PKI_DIR}/private/client.key.pem"
chmod 600 "${PKI_DIR}/private/client.key.pem"

ipsec pki --pub \
    --in "${PKI_DIR}/private/client.key.pem" \
    --type rsa \
    | ipsec pki --issue \
        --lifetime 1825 \
        --cacert "${PKI_DIR}/cacerts/ca.cert.pem" \
        --cakey  "${PKI_DIR}/private/ca.key.pem" \
        --dn "CN=${IKEV2_USER}" \
        --san "${IKEV2_USER}" \
        --flag clientAuth \
        --outform pem \
    > "${PKI_DIR}/certs/client.cert.pem"

# ---------------------------------------------------------------------------
# Write /etc/ipsec.conf
# ---------------------------------------------------------------------------
echo "[setup_ikev2] Writing /etc/ipsec.conf ..."
cat > /etc/ipsec.conf <<EOF
config setup
    charondebug="ike 1, knl 1, cfg 0"
    uniqueids=no

conn ikev2-vpn
    auto=add
    compress=no
    type=tunnel
    keyexchange=ikev2
    fragmentation=yes
    forceencaps=yes
    dpdaction=clear
    dpddelay=300s
    rekey=no

    # Server side
    left=%any
    leftid=@${SERVER_IP}
    leftcert=server.cert.pem
    leftsendcert=always
    leftsubnet=0.0.0.0/0

    # Client side
    right=%any
    rightid=%any
    rightauth=eap-mschapv2
    rightsourceip=${VPN_POOL}
    rightdns=${VPN_DNS}
    rightsendcert=never

    eap_identity=%identity
EOF

# ---------------------------------------------------------------------------
# Write /etc/ipsec.secrets
# ---------------------------------------------------------------------------
echo "[setup_ikev2] Writing /etc/ipsec.secrets ..."
cat > /etc/ipsec.secrets <<EOF
# Server certificate private key
: RSA server.key.pem

# EAP user credentials
${IKEV2_USER} : EAP "${IKEV2_PASS}"
EOF
chmod 600 /etc/ipsec.secrets

# ---------------------------------------------------------------------------
# Enable IP forwarding and NAT
# ---------------------------------------------------------------------------
echo "[setup_ikev2] Enabling IP forwarding and NAT ..."
sysctl -w net.ipv4.ip_forward=1
sysctl -w net.ipv4.conf.all.accept_redirects=0
sysctl -w net.ipv4.conf.all.send_redirects=0

grep -qxF 'net.ipv4.ip_forward=1' /etc/sysctl.conf \
    || echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf

NET_IFACE=$(ip route | grep default | awk '{print $5}' | head -n1)
iptables -t nat -A POSTROUTING -s "${VPN_POOL}" -o "${NET_IFACE}" -j MASQUERADE

# ---------------------------------------------------------------------------
# Restart StrongSwan / ipsec
# ---------------------------------------------------------------------------
echo "[setup_ikev2] Restarting ipsec ..."
# Try both service names (varies by Ubuntu version / install method)
if systemctl is-enabled ipsec &>/dev/null; then
    systemctl restart ipsec
elif systemctl is-enabled strongswan &>/dev/null; then
    systemctl restart strongswan
elif systemctl is-enabled strongswan-starter &>/dev/null; then
    systemctl restart strongswan-starter
else
    ipsec restart
fi

# ---------------------------------------------------------------------------
# Build client config file (labeled text with base64-encoded certs/keys)
# ---------------------------------------------------------------------------
echo "[setup_ikev2] Writing client config to ${CLIENT_CONF} ..."

CA_B64=$(base64 -w 0 "${PKI_DIR}/cacerts/ca.cert.pem")
CLIENT_CERT_B64=$(base64 -w 0 "${PKI_DIR}/certs/client.cert.pem")
CLIENT_KEY_B64=$(base64 -w 0 "${PKI_DIR}/private/client.key.pem")

cat > "${CLIENT_CONF}" <<EOF
# IKEv2 Client Configuration
# Generated by setup_ikev2.sh
# -----------------------------------------------

SERVER_IP=${SERVER_IP}
VPN_USERNAME=${IKEV2_USER}
VPN_PASSWORD=${IKEV2_PASS}

# --- CA Certificate (PEM, base64-encoded) ---
CA_CERT_B64=${CA_B64}

# --- Client Certificate (PEM, base64-encoded) ---
CLIENT_CERT_B64=${CLIENT_CERT_B64}

# --- Client Private Key (PEM, base64-encoded) ---
CLIENT_KEY_B64=${CLIENT_KEY_B64}

# -----------------------------------------------
# To decode on a Linux client:
#   echo "<value>" | base64 -d > ca.cert.pem
#   echo "<value>" | base64 -d > client.cert.pem
#   echo "<value>" | base64 -d > client.key.pem
# -----------------------------------------------
EOF
chmod 600 "${CLIENT_CONF}"

echo "[setup_ikev2] Done. Client config: ${CLIENT_CONF}"
exit 0
