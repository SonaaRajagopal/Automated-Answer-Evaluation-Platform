"""Query preprocessing, cosine similarity, and post-retrieval ranking."""

from typing import Any, Dict, List, Tuple

from app.core.config import Settings
from app.parsers.registry import chunk_to_text

RetrievedTriple = Tuple[dict, float, Dict[str, Any]]


def preprocess_query(query: str) -> str:
    """Expand abbreviations and normalize query text before embedding."""
    abbreviations = {
        "cet1": "common equity tier 1",
        "t1": "tier 1",
        "t2": "tier 2",
        "rwa": "risk weighted assets",
        "lcr": "liquidity coverage ratio",
        "nsfr": "net stable funding ratio",
        "crr": "capital requirements regulation",
        "crd": "capital requirements directive",
        "pra": "prudential regulation authority",
        "hkma": "hong kong monetary authority",
        "basel": "basel committee banking supervision",
    }
    processed_query = query.lower()
    for abbr, full_form in abbreviations.items():
        processed_query = processed_query.replace(abbr, full_form)
    return processed_query


def determine_top_k(query: str, settings: Settings) -> int:
    """Choose retrieval depth from query length and complexity heuristics."""
    query_length = len(query.split())
    question_words = ["what", "how", "why", "when", "where", "which", "who"]
    complex_indicators = [
        "compare",
        "difference",
        "versus",
        "relationship",
        "impact",
        "effect",
    ]
    base_k = settings.default_top_k
    if query_length > 15:
        base_k += 3
    elif query_length > 10:
        base_k += 1
    query_lower = query.lower()
    if any(indicator in query_lower for indicator in complex_indicators):
        base_k += 4
    question_count = sum(1 for word in question_words if word in query_lower)
    if question_count > 1:
        base_k += 2
    return min(max(base_k, settings.min_top_k), settings.max_top_k)


def calculate_cosine_similarity(distance: float, is_inner_product: bool = False) -> float:
    """
    Map FAISS distance to cosine similarity on [0, 1].
    IndexFlatIP with normalized vectors: distance is inner product (cosine).
    IndexFlatL2 with normalized vectors: similarity = 1 - (distance^2 / 2).
    """
    if is_inner_product:
        return max(0, min(1, distance))
    return max(0, 1 - (distance**2 / 2))


def filter_and_rank_chunks(
    retrieved_chunks: List[RetrievedTriple],
    query: str,
    db_name: str,
) -> List[RetrievedTriple]:
    """Re-score retrieved chunks with lexical overlap and identifier boosts."""
    query_terms = set(query.lower().split())
    scored_chunks: List[RetrievedTriple] = []
    for chunk, similarity, metadata in retrieved_chunks:
        content = chunk_to_text(chunk, db_name).lower()
        content_terms = set(content.split())
        term_overlap = (
            len(query_terms.intersection(content_terms)) / len(query_terms)
            if query_terms
            else 0
        )
        final_score = similarity * 0.8 + term_overlap * 0.2
        if any(term.isdigit() for term in query_terms):
            for key in ("article_number", "section_number", "chapter_number"):
                identifier = metadata.get(key, "N/A")
                if identifier != "N/A" and str(identifier) in query:
                    final_score *= 1.15
                    break
        scored_chunks.append((chunk, final_score, metadata))
    scored_chunks.sort(key=lambda x: x[1], reverse=True)
    return scored_chunks


class RankingService:
    """Facade for ranking helpers (used by API layer and tests)."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def determine_top_k(self, query: str) -> int:
        return determine_top_k(query, self._settings)

    def filter_and_rank_chunks(
        self,
        retrieved_chunks: List[RetrievedTriple],
        query: str,
        db_name: str,
    ) -> List[RetrievedTriple]:
        return filter_and_rank_chunks(retrieved_chunks, query, db_name)
