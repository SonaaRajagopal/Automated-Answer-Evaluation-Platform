import json
import logging
from typing import Any, Dict, List, Optional, Tuple

import faiss
import numpy as np
from azure.core.exceptions import AzureError
from azure.storage.blob import BlobServiceClient, ContainerClient

from app.core.config import DATABASE_BLOB_PATHS, Settings
from app.parsers.registry import DATABASES

logger = logging.getLogger(__name__)


class BlobStorageService:
    """Azure Blob Storage: download FAISS index, chunks, and metadata."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def get_blob_service_client(self) -> Optional[BlobServiceClient]:
        conn = self._settings.azure_storage_connection_string
        if not conn:
            logger.error("AZURE_STORAGE_CONNECTION_STRING is not set")
            return None
        try:
            return BlobServiceClient.from_connection_string(conn)
        except AzureError as e:
            logger.error("Failed to connect to Azure Blob Storage: %s", e)
            return None

    def download_blob_to_bytes(
        self, container_client: ContainerClient, blob_path: str
    ) -> Optional[bytes]:
        try:
            blob_client = container_client.get_blob_client(blob_path)
            return blob_client.download_blob().readall()
        except AzureError as e:
            logger.error("Failed to download blob %s: %s", blob_path, e)
            return None

    def load_index_data_from_blob(
        self, db_name: str
    ) -> Tuple[
        Optional[faiss.Index],
        Optional[List[dict]],
        Optional[List[Dict[str, Any]]],
    ]:
        blob_service = self.get_blob_service_client()
        if not blob_service:
            return None, None, None

        container_name = self._settings.blob_container_name
        if not container_name:
            logger.error("BLOB_CONTAINER_NAME is not set")
            return None, None, None

        try:
            container_client = blob_service.get_container_client(container_name)
        except AzureError as e:
            logger.error("Failed to access container '%s': %s", container_name, e)
            return None, None, None

        folder_path = DATABASE_BLOB_PATHS.get(db_name)
        if not folder_path:
            logger.error("No blob path configured for %s", db_name)
            return None, None, None

        index_blob = f"{folder_path}/faiss.index"
        chunks_blob = f"{folder_path}/chunks.json"
        metadata_blob = f"{folder_path}/metadata.json"

        try:
            index_bytes = self.download_blob_to_bytes(container_client, index_blob)
            if not index_bytes:
                logger.error("Failed to download index from %s", index_blob)
                return None, None, None

            index = faiss.deserialize_index(np.frombuffer(index_bytes, dtype=np.uint8))

            chunks_bytes = self.download_blob_to_bytes(container_client, chunks_blob)
            if not chunks_bytes:
                logger.error("Failed to download chunks from %s", chunks_blob)
                return None, None, None
            chunks: List[dict] = json.loads(chunks_bytes.decode("utf-8"))

            metadata_bytes = self.download_blob_to_bytes(container_client, metadata_blob)
            if not metadata_bytes:
                logger.error("Failed to download metadata from %s", metadata_blob)
                return None, None, None
            metadata: List[Dict[str, Any]] = json.loads(metadata_bytes.decode("utf-8"))

            logger.info(
                "Loaded %s from Azure Blob Storage (%s sections)",
                db_name,
                len(chunks),
            )
            return index, chunks, metadata
        except Exception as e:
            logger.error("Error loading data for %s from blob storage: %s", db_name, e)
            return None, None, None


def load_all_indices(blob: BlobStorageService) -> Dict[str, Dict[str, Any]]:
    indices: Dict[str, Dict[str, Any]] = {}
    for db_name in DATABASES.keys():
        index, chunks, metadata = blob.load_index_data_from_blob(db_name)
        if index is not None and chunks is not None and metadata is not None:
            indices[db_name] = {
                "index": index,
                "chunks": chunks,
                "metadata": metadata,
                "status": "ready",
                "source": "Azure Blob Storage",
            }
        else:
            indices[db_name] = {
                "status": "not_found",
                "source": "Azure Blob Storage",
            }
    return indices
