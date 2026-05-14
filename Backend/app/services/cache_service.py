import hashlib
import logging
import time
from threading import Lock
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


def get_query_hash(query: str, db_names: List[str]) -> str:
    cache_key = f"{query}_{sorted(db_names)}"
    return hashlib.md5(cache_key.encode()).hexdigest()


class QueryCacheService:
    """In-memory TTL cache (replaces Streamlit session_state query cache)."""

    def __init__(self, ttl_seconds: int = 3600, max_entries: int = 50) -> None:
        self._ttl = ttl_seconds
        self._max = max_entries
        self._data: Dict[str, Dict[str, Any]] = {}
        self._lock = Lock()

    def get(self, query_hash: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            entry = self._data.get(query_hash)
            if not entry:
                return None
            if time.time() - entry.get("timestamp", 0) >= self._ttl:
                del self._data[query_hash]
                return None
            return entry

    def set(self, query_hash: str, payload: Dict[str, Any]) -> None:
        with self._lock:
            payload = {**payload, "timestamp": time.time()}
            self._data[query_hash] = payload
            if len(self._data) <= self._max:
                return
            sorted_items = sorted(
                self._data.items(),
                key=lambda x: x[1].get("timestamp", 0),
            )
            for old_key, _ in sorted_items[: -self._max]:
                del self._data[old_key]
