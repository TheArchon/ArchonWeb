from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "ARCHON Session Labs API"
    api_prefix: str = "/api"
    redis_url: str = "redis://127.0.0.1:6379/0"
    auth_ttl_seconds: int = Field(default=300, ge=60, le=1800)
    cors_origins: list[str] = ["http://127.0.0.1:3000"]
    rate_limit_storage: str = "memory://"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

settings = Settings()
