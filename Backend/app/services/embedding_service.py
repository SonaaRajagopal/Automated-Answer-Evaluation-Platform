import logging
from typing import List, Optional

import httpx

from app.core.config import Settings
from app.services.http_client import safe_request

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self, settings: Settings, client: httpx.AsyncClient) -> None:
        self._settings = settings
        self._client = client

    async def embed_batch(self, texts: List[str]) -> Optional[List[List[float]]]:
        if not texts:
            return []
        api_key = self._settings.azure_api_key
        endpoint = self._settings.azure_embed_endpoint
        if not api_key or not endpoint:
            logger.error("Azure embedding credentials are not configured")
            return None

        headers = {"api-key": api_key, "Content-Type": "application/json"}
        try:
            response = await safe_request(
                self._client,
                self._settings,
                "POST",
                endpoint,
                headers=headers,
                json={"input": texts},
                timeout=60.0,
            )
            data = response.json().get("data") or []
            return [item["embedding"] for item in data]
        except Exception as e:
            logger.error("Error getting embeddings: %s", e)
            return None
