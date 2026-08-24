from fastapi import APIRouter
from app.storage.redis import ping

router = APIRouter(tags=["health"])

@router.get("/health")
async def health():
    return {"status": "healthy"}

@router.get("/ready")
async def ready():
    try:
        redis_ok = await ping()
    except Exception:
        redis_ok = False
    if not redis_ok:
        return {"status": "not_ready", "redis": False}
    return {"status": "ready", "redis": True}
