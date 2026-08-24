import json
from redis.asyncio import Redis
from app.core.config import settings

redis = Redis.from_url(
    settings.redis_url,
    decode_responses=True,
    socket_connect_timeout=2,
    socket_timeout=2,
)

def key(auth_id: str) -> str:
    return f"archon:auth:{auth_id}"

async def save_auth_context(auth_id: str, context: dict) -> None:
    await redis.setex(
        key(auth_id),
        settings.auth_ttl_seconds,
        json.dumps(context, separators=(",", ":")),
    )

async def get_auth_context(auth_id: str) -> dict | None:
    raw = await redis.get(key(auth_id))
    return json.loads(raw) if raw else None

async def delete_auth_context(auth_id: str) -> None:
    await redis.delete(key(auth_id))

async def ping() -> bool:
    return bool(await redis.ping())
