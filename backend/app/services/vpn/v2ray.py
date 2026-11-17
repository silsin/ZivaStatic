"""V2Ray support module.

Config generation is handled on the server by setup_v2ray.sh.
This module provides metadata used elsewhere in the application.
"""


def get_config_description() -> str:
    return "V2Ray - VMess protocol, advanced obfuscation"
