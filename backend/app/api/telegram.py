from fastapi import APIRouter

router = APIRouter(tags=["telegram"])

@router.get("/status")
async def status():
    return {
        "enabled": False,
        "mode": "safe-demo",
        "message": "Credential-collecting Telegram authentication is disabled.",
    }
