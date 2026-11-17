from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    HETZNER_API_TOKEN: str
    STRIPE_ENABLED: bool = True
    STRIPE_SECRET_KEY: str = "sk_test_placeholder"
    STRIPE_WEBHOOK_SECRET: str = "whsec_placeholder"
    STRIPE_PRICE_ID: str = "price_placeholder"
    FRONTEND_URL: str = "http://localhost:1475"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
