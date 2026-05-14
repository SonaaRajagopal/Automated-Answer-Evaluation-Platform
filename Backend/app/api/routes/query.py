from typing import Any, Dict, List

import numpy as np
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import (
    get_app_settings,
    get_db_data,
    get_embedding_service,
    get_llm_service,
    get_query_cache,
    get_ranking_service,
    get_retrieval_service,
    resolve_databases_to_query,
)
from app.core.config import Settings
from app.models.schemas import (
    ComparisonRowModel,
    DatabaseQueryResult,
    QueryRequest,
    QueryResponse,
    RetrievedSourceModel,
)
from app.parsers.registry import DATABASES
from app.services.cache_service import get_query_hash
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.services.ranking_service import RankingService, RetrievedTriple
from app.services.retrieval_service import RetrievalService

router = APIRouter(prefix="/query", tags=["query"])


def _confidence_label(score: float, high_thr: float) -> str:
    if score >= high_thr:
        return "High"
    if score >= 0.65:
        return "Medium"
    return "Low"


def _build_sources(
    db_name: str,
    retrieved: List[RetrievedTriple],
    high_thr: float,
) -> List[RetrievedSourceModel]:
    cfg = DATABASES[db_name]
    out: List[RetrievedSourceModel] = []
    for i, (chunk, score, metadata) in enumerate(retrieved):
        out.append(
            RetrievedSourceModel(
                rank=i + 1,
                content=cfg.parser(chunk),
                score=float(score),
                metadata=metadata,
                citation=cfg.citation_format(metadata),
                confidence=_confidence_label(score, high_thr),
            )
        )
    return out


@router.post("", response_model=QueryResponse)
async def post_query(
    payload: QueryRequest,
    settings: Settings = Depends(get_app_settings),
    db_data: Dict[str, Dict[str, Any]] = Depends(get_db_data),
    cache=Depends(get_query_cache),
    embedding: EmbeddingService = Depends(get_embedding_service),
    retrieval: RetrievalService = Depends(get_retrieval_service),
    ranking: RankingService = Depends(get_ranking_service),
    llm: LLMService = Depends(get_llm_service),
) -> QueryResponse:
    _ = embedding  # wired via retrieval
    db_to_query, is_multi_db = resolve_databases_to_query(payload, db_data)
    if not db_to_query:
        raise HTTPException(
            status_code=503,
            detail="No ready databases available for the requested selection.",
        )

    high_thr = settings.high_confidence_threshold

    query_hash = (
        get_query_hash(payload.query, db_to_query) if payload.use_cache else None
    )
    from_cache = False
    raw_results: Dict[str, List[RetrievedTriple]] | None = None
    cached_entry: Dict[str, Any] | None = None

    if query_hash:
        cached_entry = cache.get(query_hash)
        if cached_entry and isinstance(cached_entry.get("results"), dict):
            from_cache = True
            raw_results = cached_entry["results"]

    top_k_used = (
        payload.top_k if payload.top_k is not None else ranking.determine_top_k(payload.query)
    )

    if raw_results is None:
        top_k = top_k_used
        raw_results = {}
        for db_name in db_to_query:
            info = db_data[db_name]
            retrieved = await retrieval.retrieve_chunks_with_scores(
                payload.query,
                info["index"],
                info["chunks"],
                info["metadata"],
                top_k,
                db_name,
            )
            filtered = ranking.filter_and_rank_chunks(retrieved, payload.query, db_name)
            raw_results[db_name] = filtered

        if query_hash and payload.use_cache:
            cache.set(
                query_hash,
                {"results": raw_results, "query": payload.query, "top_k_used": top_k},
            )
    elif from_cache and cached_entry is not None:
        top_k_used = int(cached_entry.get("top_k_used", top_k_used))

    assert raw_results is not None

    db_results: List[DatabaseQueryResult] = []
    for db_name, chunks in raw_results.items():
        doc_type = chunks[0][2].get("document_type", db_name) if chunks else db_name
        if not chunks:
            db_results.append(
                DatabaseQueryResult(
                    database_key=db_name,
                    document_type=str(doc_type),
                    sources=[],
                    answer=f"No relevant sections found in {db_name} for this query.",
                    high_confidence_count=0,
                    total_sources=0,
                    quick_source_reference=[],
                )
            )
            continue

        sources = _build_sources(db_name, chunks, high_thr)
        answer = await llm.generate_enhanced_answer(
            payload.query, chunks, db_name, is_multi_db=is_multi_db
        )
        high_conf = sum(1 for _, s, _ in chunks if s >= high_thr)
        cfg = DATABASES[db_name]
        quick_ref: List[str] = []
        for i, (_, score, metadata) in enumerate(chunks[:3]):
            citation = cfg.citation_format(metadata)
            conf = _confidence_label(score, high_thr)
            quick_ref.append(f"Source {i + 1}: {citation} ({conf} confidence)")

        db_results.append(
            DatabaseQueryResult(
                database_key=db_name,
                document_type=str(doc_type),
                sources=sources,
                answer=answer,
                high_confidence_count=high_conf,
                total_sources=len(chunks),
                quick_source_reference=quick_ref,
            )
        )

    comparative_analysis = None
    comparison_rows: List[ComparisonRowModel] | None = None
    primary_recommendation = None

    if is_multi_db and any(raw_results.values()):
        comparison_data: List[ComparisonRowModel] = []
        for db_name, chs in raw_results.items():
            if not chs:
                continue
            avg_conf = float(np.mean([score for _, score, _ in chs]))
            high_c = sum(1 for _, score, _ in chs if score >= high_thr)
            doc_type = chs[0][2].get("document_type", db_name)
            best = DATABASES[db_name].citation_format(chs[0][2])
            comparison_data.append(
                ComparisonRowModel(
                    regulatory_framework=str(doc_type),
                    sources_found=len(chs),
                    high_confidence=high_c,
                    avg_confidence=f"{avg_conf:.3f}",
                    best_source=best,
                )
            )
        comparison_rows = comparison_data or None

        if payload.include_comparative_analysis and any(raw_results.values()):
            comparative_analysis = await llm.generate_comparative_analysis(
                payload.query, raw_results
            )

        if comparison_data:
            best_row = max(comparison_data, key=lambda x: (x.high_confidence, x.sources_found))
            primary_recommendation = (
                f"{best_row.regulatory_framework} provides the most comprehensive coverage "
                "for this query (by high-confidence sources and source count)."
            )

    return QueryResponse(
        query=payload.query,
        databases_queried=db_to_query,
        is_multi_db=is_multi_db,
        top_k_used=top_k_used,
        from_cache=from_cache,
        results=db_results,
        comparative_analysis=comparative_analysis,
        comparison_rows=comparison_rows,
        primary_recommendation=primary_recommendation,
    )
