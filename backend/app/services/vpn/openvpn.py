"""OpenVPN support module.

Config generation is handled on the server by setup_openvpn.sh.
This module provides metadata used elsewhere in the application.
"""


def get_config_description() -> str:
    return "OpenVPN - .ovpn config file for all platforms"
