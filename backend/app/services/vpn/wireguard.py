"""WireGuard support module.

Config generation is handled on the server by setup_wireguard.sh.
This module provides metadata used elsewhere in the application.
"""


def get_config_description() -> str:
    return "WireGuard - modern, fast VPN protocol"
