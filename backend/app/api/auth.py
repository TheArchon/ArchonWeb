import logging
from typing import Literal

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.security import is_safe_public_id, new_auth_id
from app.storage.redis import delete_auth_context, get_auth_context, save_auth_context

logger = logging.getLogger("archon.auth")
router = APIRouter(tags=["authentication"])
limiter = Limiter(key_func=get_remote_address)

class StartAuthRequest(BaseModel):
    session_type: Literal["pyrogram", "telethon"]

class StartAuthResponse(BaseModel):
    auth_id: str
    next_step: Literal["phone"]

class PhoneRequest(BaseModel):
    auth_id: str = Field(min_length=20, max_length=100)
    phone: str = Field(min_length=5, max_length=32)

@router.post("/start", response_model=StartAuthResponse)
@limiter.limit("5/minute")
async def start_auth(request: Request, payload: StartAuthRequest):
    auth_id = new_auth_id()
    await save_auth_context(auth_id, {
        "session_type": payload.session_type,
        "state": "phone",
    })
    logger.info("authentication_flow_started")
    return {"auth_id": auth_id, "next_step": "phone"}

@router.post("/phone")
@limiter.limit("5/minute")
async def submit_phone(request: Request, payload: PhoneRequest):
    if not is_safe_public_id(payload.auth_id):
        raise HTTPException(status_code=400, detail="Invalid authentication id")
    context = await get_auth_context(payload.auth_id)
    if not context:
        raise HTTPException(status_code=410, detail="Authentication session expired")
    await save_auth_context(payload.auth_id, {**context, "state": "otp"})
    logger.info("phone_step_accepted")
    return {"ok": True, "next_step": "otp"}

@router.delete("/cancel/{auth_id}")
@limiter.limit("20/minute")
async def cancel_auth(request: Request, auth_id: str):
    if not is_safe_public_id(auth_id):
        raise HTTPException(status_code=400, detail="Invalid authentication id")
    await delete_auth_context(auth_id)
    logger.info("authentication_flow_cancelled")
    return {"ok": True}
