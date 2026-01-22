"""
Pydantic Models for API Request/Response validation.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


# ===========================================
# Request Models
# ===========================================

class QueryRequest(BaseModel):
    """Request model for RAG query."""
    query: str = Field(
        ..., 
        min_length=1, 
        max_length=2000,
        description="User's question"
    )
    session_id: Optional[str] = Field(
        default=None,
        description="Session ID for chat history"
    )
    top_k: Optional[int] = Field(
        default=None,
        ge=1,
        le=20,
        description="Number of documents to retrieve"
    )
    filter_source: Optional[str] = Field(
        default=None,
        description="Filter results by source name"
    )


class DocumentInput(BaseModel):
    """Single document for indexing."""
    source: str = Field(
        ..., 
        min_length=1,
        description="Document identifier/name"
    )
    content: str = Field(
        ..., 
        min_length=10,
        description="Document text content"
    )
    url: Optional[str] = Field(
        default="",
        description="Source URL"
    )
    metadata: Optional[Dict[str, Any]] = Field(
        default={},
        description="Additional metadata"
    )


class IndexRequest(BaseModel):
    """Request model for document indexing."""
    documents: List[DocumentInput] = Field(
        ..., 
        min_length=1,
        description="List of documents to index"
    )


class SearchRequest(BaseModel):
    """Request model for document search."""
    query: str = Field(
        ..., 
        min_length=1,
        description="Search query"
    )
    top_k: Optional[int] = Field(
        default=10,
        ge=1,
        le=50,
        description="Number of results"
    )


class DeleteDocumentRequest(BaseModel):
    """Request model for document deletion."""
    document_id: str = Field(
        ..., 
        description="Document ID to delete"
    )


# ===========================================
# Response Models
# ===========================================

class SourceInfo(BaseModel):
    """Source document information."""
    source: str
    url: str
    text: str
    score: float
    chunk_index: int


class QueryResponse(BaseModel):
    """Response model for RAG query."""
    answer: str
    sources: List[SourceInfo]
    query: str
    documents_retrieved: Optional[int] = 0
    processing_time_ms: int
    status: str


class IndexResult(BaseModel):
    """Result of single document indexing."""
    status: str
    source: str
    document_id: Optional[str] = None
    chunks_indexed: Optional[int] = 0
    message: Optional[str] = None


class IndexResponse(BaseModel):
    """Response model for document indexing."""
    total: int
    successful: int
    failed: int
    total_chunks: int
    details: List[IndexResult]


class SearchResult(BaseModel):
    """Single search result."""
    text: str
    source: str
    url: str
    score: float
    document_id: str
    chunk_index: int


class SearchResponse(BaseModel):
    """Response model for document search."""
    results: List[SearchResult]
    query: str
    total_results: int


class CollectionStats(BaseModel):
    """Collection statistics response."""
    collection_name: str
    vector_count: int
    document_count: int
    vector_dimension: int
    status: str


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    timestamp: str


class ChatHistoryEntry(BaseModel):
    """Single chat history entry."""
    query: str
    answer: str
    sources: List[Dict[str, Any]]
    timestamp: datetime
    processing_time_ms: int


class ChatHistoryResponse(BaseModel):
    """Chat history response."""
    session_id: str
    history: List[ChatHistoryEntry]
    total_entries: int


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str
    detail: Optional[str] = None
    status_code: int
