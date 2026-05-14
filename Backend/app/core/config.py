from functools import lru_cache
from typing import Dict

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    azure_embed_endpoint: str | None = None
    azure_llm_endpoint: str | None = None
    azure_api_key: str | None = None
    azure_storage_connection_string: str | None = None
    blob_container_name: str | None = None

    embed_batch_size: int = 16
    max_retries: int = 5
    base_delay: float = 2.0
    backoff_factor: float = 2.0
    jitter_max: float = 1.0

    min_top_k: int = 3
    max_top_k: int = 15
    default_top_k: int = 7

    min_similarity_threshold: float = 0.5
    high_confidence_threshold: float = 0.85

    query_cache_ttl_seconds: int = 3600
    query_cache_max_entries: int = 50


DATABASE_BLOB_PATHS: Dict[str, str] = {
    "PRA_Rulebook": "PRA",
    "Basel3_1_Rulebook": "Basel",
    "HKMA_Rulebook": "HKMA",
}


@lru_cache
def get_settings() -> Settings:
    return Settings()
