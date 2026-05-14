from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Request

from app.api.deps import get_app_settings, get_db_data
from app.models.schemas import DatabaseListResponse, DatabaseStatusItem, HealthResponse
from app.parsers.registry import DATABASES

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    settings = get_app_settings(request)
    db_data = get_db_data(request)
    summary: Dict[str, Dict[str, Any]] = {}
    for name, data in db_data.items():
        entry: Dict[str, Any] = {"status": data.get("status", "unknown")}
        if data.get("status") == "ready":
            entry["sections"] = len(data.get("chunks", []))
            meta = data.get("metadata") or []
            if meta:
                entry["document_type"] = meta[0].get("document_type", "Unknown")
        summary[name] = entry
    return HealthResponse(
        status="ok",
        azure_api_configured=bool(settings.azure_api_key),
        blob_storage_configured=bool(settings.azure_storage_connection_string),
        databases=summary,
    )


@router.get("/databases", response_model=DatabaseListResponse)
async def list_databases(request: Request) -> DatabaseListResponse:
    db_data = get_db_data(request)
    items: List[DatabaseStatusItem] = []
    for key in DATABASES.keys():
        data = db_data.get(key, {})
        status = data.get("status", "unknown")
        item = DatabaseStatusItem(key=key, status=status, source=data.get("source"))
        if status == "ready" and data.get("metadata"):
            item.section_count = len(data.get("chunks", []))
            item.document_type = data["metadata"][0].get("document_type")
        items.append(item)
    return DatabaseListResponse(databases=items)
