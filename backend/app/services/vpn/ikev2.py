"""IKEv2/StrongSwan support module.

Config generation is handled on the server by setup_ikev2.sh.
This module provides metadata used elsewhere in the application.
"""


def get_config_description() -> str:
    return "IKEv2/StrongSwan - built-in support on iOS, macOS, Windows"
