from dataclasses import dataclass
from typing import Any, Callable, Dict

from app.parsers.basel import (
    citation_basel,
    extract_basel_metadata,
    parse_basel_chunk,
)
from app.parsers.hkma import (
    citation_hkma,
    extract_hkma_metadata,
    parse_hkma_chunk,
)
from app.parsers.pra import citation_pra, extract_pra_metadata, parse_pra_chunk


@dataclass(frozen=True)
class DatabaseConfig:
    file: str
    parser: Callable[[dict], str]
    metadata_extractor: Callable[[dict], dict]
    citation_format: Callable[[dict], str]


DATABASES: Dict[str, DatabaseConfig] = {
    "PRA_Rulebook": DatabaseConfig(
        file="pra_rulebook.jsonl",
        parser=parse_pra_chunk,
        metadata_extractor=extract_pra_metadata,
        citation_format=citation_pra,
    ),
    "Basel3_1_Rulebook": DatabaseConfig(
        file="basel3.1_rulebook.jsonl",
        parser=parse_basel_chunk,
        metadata_extractor=extract_basel_metadata,
        citation_format=citation_basel,
    ),
    "HKMA_Rulebook": DatabaseConfig(
        file="hkma_rulebook.jsonl",
        parser=parse_hkma_chunk,
        metadata_extractor=extract_hkma_metadata,
        citation_format=citation_hkma,
    ),
}


def chunk_to_text(chunk: dict, db_name: str) -> str:
    db_config = DATABASES[db_name]
    return db_config.parser(chunk)


def extract_metadata(chunk: dict, db_name: str) -> Dict[str, Any]:
    db_config = DATABASES[db_name]
    return db_config.metadata_extractor(chunk)
