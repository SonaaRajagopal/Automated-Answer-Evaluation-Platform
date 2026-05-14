import asyncio
import logging
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, query
from app.core.config import get_settings
from app.services.blob_service import (
    BlobStorageService,
    load_all_indices,
)
from app.services.cache_service import QueryCacheService
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.services.ranking_service import RankingService
from app.services.retrieval_service import RetrievalService


# =========================
# Application Lifespan
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):

    # Configure logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("hawkai")

    logger.info("Starting HawkAI backend...")

    # Load settings
    settings = get_settings()
    app.state.settings = settings

    # Shared async HTTP client
    client = httpx.AsyncClient(timeout=120.0)
    app.state.http_client = client

    # Initialize blob storage service
    blob_service = BlobStorageService(settings)

    logger.info("Loading FAISS indices from Azure Blob Storage...")

    # Load all vector DBs / indices
    app.state.db_data = await asyncio.to_thread(
        load_all_indices,
        blob_service
    )

    logger.info("Vector indices loaded successfully")

    # Initialize query cache
    app.state.query_cache = QueryCacheService(
        ttl_seconds=settings.query_cache_ttl_seconds,
        max_entries=settings.query_cache_max_entries,
    )

    # Initialize embedding service
    app.state.embedding_service = EmbeddingService(
        settings=settings,
        client=client,
    )

    # Initialize retrieval service
    app.state.retrieval_service = RetrievalService(
        settings=settings,
        embedding_service=app.state.embedding_service,
    )

    # Initialize ranking service
    app.state.ranking_service = RankingService(settings)

    # Initialize LLM service
    app.state.llm_service = LLMService(
        settings=settings,
        client=client,
    )

    logger.info("HawkAI backend initialized successfully")

    yield

    logger.info("Shutting down HawkAI backend...")

    # Close async HTTP client
    await client.aclose()

    logger.info("Shutdown complete")


# =========================
# FastAPI App Factory
# =========================
def create_app() -> FastAPI:

    application = FastAPI(
        title="HawkAI",
        description="Multi-regulatory RAG API using Azure OpenAI, FAISS, and Azure Blob Storage.",
        version="1.0.0",
        lifespan=lifespan,
    )

    # =========================
    # Enable CORS
    # =========================
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Replace with frontend URL in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # =========================
    # Register API Routes
    # =========================
    application.include_router(
        health.router,
        prefix="/api/v1",
        tags=["Health"],
    )

    application.include_router(
        query.router,
        prefix="/api/v1",
        tags=["Query"],
    )

    # =========================
    # Root Endpoint
    # =========================
    @application.get("/")
    async def root():
        return {
            "service": "HawkAI API",
            "status": "running",
            "docs": "/docs",
            "health": "/api/v1/health",
        }

    return application


# =========================
# Create App Instance
# =========================
app = create_app()