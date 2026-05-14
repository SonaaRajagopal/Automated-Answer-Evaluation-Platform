from typing import Any, Dict, List, Tuple

from fastapi import Request

from app.core.config import Settings, get_settings
from app.models.schemas import QueryRequest
from app.services.cache_service import QueryCacheService
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.services.ranking_service import RankingService
from app.services.retrieval_service import RetrievalService


def get_app_settings(request: Request) -> Settings:
    s = getattr(request.app.state, "settings", None)
    if s is not None:
        return s
    return get_settings()


def get_db_data(request: Request) -> Dict[str, Dict[str, Any]]:
    return request.app.state.db_data


def get_query_cache(request: Request) -> QueryCacheService:
    return request.app.state.query_cache


def get_embedding_service(request: Request) -> EmbeddingService:
    return request.app.state.embedding_service


def get_retrieval_service(request: Request) -> RetrievalService:
    return request.app.state.retrieval_service


def get_ranking_service(request: Request) -> RankingService:
    return request.app.state.ranking_service


def get_llm_service(request: Request) -> LLMService:
    return request.app.state.llm_service


def resolve_databases_to_query(
    payload: QueryRequest,
    db_data: Dict[str, Dict[str, Any]],
) -> Tuple[List[str], bool]:
    if payload.databases == "all":
        ready = [name for name, data in db_data.items() if data.get("status") == "ready"]
        return ready, True
    names = payload.databases if isinstance(payload.databases, list) else [payload.databases]
    ready_only = [n for n in names if db_data.get(n, {}).get("status") == "ready"]
    return ready_only, len(ready_only) > 1
