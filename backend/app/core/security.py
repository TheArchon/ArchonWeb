import secrets

def new_auth_id() -> str:
    return secrets.token_urlsafe(32)

def is_safe_public_id(value: str) -> bool:
    return 20 <= len(value) <= 100 and all(
        c.isalnum() or c in "-_" for c in value
    )
