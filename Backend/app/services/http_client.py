import asyncio
import logging
import random
import time
from typing import Any, Callable, Optional

import httpx

from app.core.config import Settings

logger = logging.getLogger(__name__)


async def exponential_backoff_delay(settings: Settings, attempt: int) -> float:
    delay = settings.base_delay * (settings.backoff_factor**attempt)
    jitter = random.uniform(0, settings.jitter_max)
    return min(delay + jitter, 60.0)


async def safe_request(
    client: httpx.AsyncClient,
    settings: Settings,
    method: str,
    url: str,
    **kwargs: Any,
) -> httpx.Response:
    last_exc: Optional[BaseException] = None
    for attempt in range(settings.max_retries):
        try:
            response = await client.request(method, url, **kwargs)
            if response.status_code == 429:
                delay = await exponential_backoff_delay(settings, attempt)
                logger.warning(
                    "Rate limited; waiting %.1fs before retry %s/%s",
                    delay,
                    attempt + 1,
                    settings.max_retries,
                )
                await asyncio.sleep(delay)
                continue
            if response.status_code >= 400:
                logger.error(
                    "API error %s: %s",
                    response.status_code,
                    response.text[:2000],
                )
                response.raise_for_status()
            return response
        except httpx.RequestError as e:
            last_exc = e
            if attempt == settings.max_retries - 1:
                logger.error("Final request attempt failed: %s", e)
                raise
            delay = await exponential_backoff_delay(settings, attempt)
            logger.warning(
                "Request failed: %s. Retrying in %.1fs (%s/%s)",
                e,
                delay,
                attempt + 1,
                settings.max_retries,
            )
            await asyncio.sleep(delay)
    assert last_exc is not None
    raise last_exc
