from typing import Any, Dict, List, Literal, Optional, Union

from pydantic import BaseModel, Field, field_validator

from app.parsers.registry import DATABASES


class HealthResponse(BaseModel):
    status: str = "ok"
    azure_api_configured: bool
    blob_storage_configured: bool
    databases: Dict[str, Dict[str, Any]]


class DatabaseStatusItem(BaseModel):
    key: str
    status: str
    source: str | None = None
    section_count: int | None = None
    document_type: str | None = None


class DatabaseListResponse(BaseModel):
    databases: List[DatabaseStatusItem]


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Natural language question")
    databases: Union[Literal["all"], List[str]] = Field(
        default="all",
        description='Use "all" for comparative multi-database search, or a list of database keys.',
    )
    top_k: Optional[int] = Field(
        default=None,
        ge=3,
        le=15,
        description="If omitted, top_k is chosen from query complexity (same as original app).",
    )
    use_cache: bool = True
    include_comparative_analysis: bool = Field(
        default=True,
        description="When databases is 'all', optionally run cross-framework comparative LLM pass.",
    )

    @field_validator("databases", mode="before")
    @classmethod
    def normalize_databases(
        cls, v: Union[str, List[str]]
    ) -> Union[Literal["all"], List[str]]:
        if isinstance(v, str) and v.strip().lower() == "all":
            return "all"
        if isinstance(v, list):
            for key in v:
                if key not in DATABASES:
                    raise ValueError(f"Unknown database key: {key}")
            return v
        if isinstance(v, str) and v in DATABASES:
            return [v]
        raise ValueError("databases must be 'all', a known database key, or a list of keys")


class RetrievedSourceModel(BaseModel):
    rank: int
    content: str
    score: float
    metadata: Dict[str, Any]
    citation: str
    confidence: str


class DatabaseQueryResult(BaseModel):
    database_key: str
    document_type: str
    sources: List[RetrievedSourceModel]
    answer: str
    high_confidence_count: int
    total_sources: int
    quick_source_reference: List[str]


class ComparisonRowModel(BaseModel):
    regulatory_framework: str
    sources_found: int
    high_confidence: int
    avg_confidence: str
    best_source: str


class QueryResponse(BaseModel):
    query: str
    databases_queried: List[str]
    is_multi_db: bool
    top_k_used: int
    from_cache: bool
    results: List[DatabaseQueryResult]
    comparative_analysis: Optional[str] = None
    comparison_rows: Optional[List[ComparisonRowModel]] = None
    primary_recommendation: Optional[str] = None
