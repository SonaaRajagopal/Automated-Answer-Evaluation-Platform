import asyncio
from typing import Any, Dict, List

import faiss
import numpy as np

from app.core.config import Settings
from app.services.embedding_service import EmbeddingService
from app.services.ranking_service import (
    RetrievedTriple,
    calculate_cosine_similarity,
    preprocess_query,
)


def _search_index_sync(
    index: faiss.Index,
    query_emb_np: np.ndarray,
    chunks: List[dict],
    metadata: List[Dict[str, Any]],
    top_k: int,
    min_similarity: float,
) -> List[RetrievedTriple]:

    distances, indices = index.search(
        query_emb_np,
        min(top_k * 2, len(chunks)),
    )

    is_inner_product = isinstance(index, faiss.IndexFlatIP)

    results: List[RetrievedTriple] = []

    for distance, idx in zip(distances[0], indices[0]):

        if 0 <= idx < len(chunks):

            similarity = calculate_cosine_similarity(
                float(distance),
                is_inner_product,
            )

            if similarity >= min_similarity:
                results.append(
                    (
                        chunks[int(idx)],
                        similarity,
                        metadata[int(idx)],
                    )
                )

    results.sort(key=lambda x: x[1], reverse=True)

    return results[:top_k]


class RetrievalService:
    """
    FAISS vector retrieval service.
    """

    def __init__(
        self,
        settings: Settings,
        embedding_service: EmbeddingService,
    ) -> None:

        self.settings = settings
        self.embedding_service = embedding_service

    async def retrieve_chunks_with_scores(
        self,
        query: str,
        index: faiss.Index,
        chunks: List[dict],
        metadata: List[Dict[str, Any]],
        top_k: int,
        db_name: str,
    ) -> List[RetrievedTriple]:

        # db_name reserved for future filtering/logging
        _ = db_name

        processed_query = preprocess_query(query)

        query_embedding = await self.embedding_service.embed_batch(
            [processed_query]
        )

        if not query_embedding:
            return []

        query_emb_np = np.array(
            query_embedding,
            dtype=np.float32,
        )

        faiss.normalize_L2(query_emb_np)

        return await asyncio.to_thread(
            _search_index_sync,
            index,
            query_emb_np,
            chunks,
            metadata,
            top_k,
            self.settings.min_similarity_threshold,
        )