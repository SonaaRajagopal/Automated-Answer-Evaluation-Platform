import logging
from typing import Dict, List, Tuple

import httpx

from app.core.config import Settings
from app.parsers.registry import DATABASES, chunk_to_text
from app.services.http_client import safe_request

logger = logging.getLogger(__name__)

RetrievedTriple = Tuple[dict, float, dict]


class LLMService:
    def __init__(self, settings: Settings, client: httpx.AsyncClient) -> None:
        self._settings = settings
        self._client = client

    async def generate_enhanced_answer(
        self,
        query: str,
        retrieved_chunks: List[RetrievedTriple],
        db_name: str,
        is_multi_db: bool = False,
    ) -> str:
        if not retrieved_chunks:
            return f"No relevant information was found in {db_name} to answer your question."
        api_key = self._settings.azure_api_key
        endpoint = self._settings.azure_llm_endpoint
        if not api_key or not endpoint:
            return "API_KEY is not configured. Cannot generate an answer."

        headers = {"api-key": api_key, "Content-Type": "application/json"}
        db_config = DATABASES[db_name]
        citation_format = db_config.citation_format

        context = ""
        high_confidence_sources: List[str] = []
        high_thr = self._settings.high_confidence_threshold

        for i, (chunk, score, metadata) in enumerate(retrieved_chunks):
            citation = citation_format(metadata)
            confidence = (
                "High"
                if score >= high_thr
                else "Medium" if score >= 0.65 else "Low"
            )
            if score >= high_thr:
                high_confidence_sources.append(citation)
            text = chunk_to_text(chunk, db_name)
            context += f"Source {i + 1} ({citation}, Confidence: {confidence}):\n{text}\n\n"

        doc_type = (
            retrieved_chunks[0][2].get("document_type", db_name)
            if retrieved_chunks
            else db_name
        )

        system_message = f"""You are an expert legal analyst specializing in financial regulations from {doc_type}. Your task is to provide detailed, accurate answers based ONLY on the provided regulatory context.

Guidelines:
1. **Mandatory Citations**: For every piece of information you use, you MUST cite the source using the format provided in the context.

2. **Confidence Indicators**: When using information from high-confidence sources {high_confidence_sources}, emphasize their reliability. For lower-confidence sources, acknowledge uncertainty.

3. **Context Boundaries**: If the answer is not in the provided context, state: 'The provided regulatory context from {doc_type} does not contain sufficient information on this topic.'

4. **Legal Precision**: Use precise legal language appropriate for {doc_type}. Distinguish between requirements, recommendations, and definitions.

5. **Comprehensive Structure**: For complex topics, organize your response with:
   - Direct answer first
   - Supporting regulatory provisions
   - Relevant exceptions or conditions
   - Cross-references to related sections

6. **Document-Specific Language**: 
   - For PRA: Use "Article" references and EU regulation terminology
   - For Basel: Use "Chapter" references and Basel framework terminology  
   - For HKMA: Use "Section" references and Hong Kong banking terminology

7. **Multi-Database Context**: {"This analysis is specific to " + doc_type + "." if is_multi_db else ""}
"""

        user_message = f"""Based ONLY on the following regulatory excerpts from {doc_type}, please answer the question with maximum precision and granularity.

Question: {query}

Regulatory Context from {doc_type}:
{context}

Please ensure your answer is comprehensive, well-structured, and includes all relevant regulatory details from the provided context.
"""

        payload = {
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            "max_tokens": 1500,
            "temperature": 0.05,
            "top_p": 0.9,
        }

        try:
            response = await safe_request(
                self._client,
                self._settings,
                "POST",
                endpoint,
                headers=headers,
                json=payload,
                timeout=120.0,
            )
            answer = response.json()["choices"][0]["message"]["content"].strip()
            confidence_summary = (
                f"\n\n**Confidence Assessment**: This answer is based on {len(high_confidence_sources)} "
                f"high-confidence sources and {len(retrieved_chunks) - len(high_confidence_sources)} "
                f"additional sources from {doc_type}."
            )
            return answer + confidence_summary
        except Exception as e:
            logger.error("Error generating answer: %s", e)
            return "An unexpected error occurred while generating the answer."

    async def generate_comparative_analysis(
        self,
        query: str,
        all_results: Dict[str, List[RetrievedTriple]],
    ) -> str:
        api_key = self._settings.azure_api_key
        endpoint = self._settings.azure_llm_endpoint
        if not api_key or not endpoint:
            return "API_KEY is not configured. Cannot generate comparative analysis."

        headers = {"api-key": api_key, "Content-Type": "application/json"}
        comparative_context = ""

        for db_name, retrieved_chunks in all_results.items():
            if retrieved_chunks:
                db_config = DATABASES[db_name]
                citation_format = db_config.citation_format
                doc_type = (
                    retrieved_chunks[0][2].get("document_type", db_name)
                    if retrieved_chunks
                    else db_name
                )
                comparative_context += f"\n=== {doc_type} ===\n"
                for i, (chunk, score, metadata) in enumerate(retrieved_chunks[:3]):
                    _ = score
                    citation = citation_format(metadata)
                    text = chunk_to_text(chunk, db_name)
                    comparative_context += f"Source {i + 1} ({citation}):\n{text}\n\n"

        system_message = """You are an expert legal analyst specializing in comparative regulatory analysis across multiple jurisdictions. Your task is to provide a comprehensive comparative analysis of how different regulatory frameworks address the same topic.

Guidelines:
1. **Structured Comparison**: Organize your response by:
   - Common principles across all frameworks
   - Key differences and variations
   - Jurisdictional specificities
   - Practical implications

2. **Clear Attribution**: Always specify which regulatory framework each point comes from.

3. **Analytical Depth**: Don't just list differences - explain WHY they might exist and their practical implications.

4. **Balanced Coverage**: Give appropriate attention to each framework based on the available information.

5. **Regulatory Context**: Consider the different regulatory philosophies and approaches:
   - PRA: EU/UK regulatory approach
   - Basel: International standards framework
   - HKMA: Hong Kong specific implementation

6. **Practical Insights**: Highlight which framework might be most relevant for different scenarios.
"""

        user_message = f"""Based on the regulatory excerpts from multiple frameworks below, please provide a comprehensive comparative analysis addressing the following question:

Question: {query}

Regulatory Context from Multiple Frameworks:
{comparative_context}

Please structure your analysis to show:
1. How each framework approaches this topic
2. Key similarities and differences
3. Practical implications of these differences
4. Which framework provides the most comprehensive coverage for this specific query
"""

        payload = {
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            "max_tokens": 2000,
            "temperature": 0.1,
            "top_p": 0.9,
        }

        try:
            response = await safe_request(
                self._client,
                self._settings,
                "POST",
                endpoint,
                headers=headers,
                json=payload,
                timeout=120.0,
            )
            return response.json()["choices"][0]["message"]["content"].strip()
        except Exception as e:
            logger.error("Error generating comparative analysis: %s", e)
            return "An unexpected error occurred while generating the comparative analysis."
