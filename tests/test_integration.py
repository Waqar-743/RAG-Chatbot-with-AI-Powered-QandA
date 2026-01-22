"""
Integration Tests for RAG Chatbot API.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock

from main import app


class TestAPIEndpoints:
    """Tests for API endpoints."""
    
    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)
    
    def test_root_endpoint(self, client):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "RAG Chatbot API"
        assert "version" in data
    
    def test_health_endpoint(self, client):
        """Test health check endpoint."""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    @patch('api.routes.get_retriever')
    def test_query_endpoint(self, mock_get_retriever, client):
        """Test query endpoint."""
        # Mock retriever
        mock_retriever = MagicMock()
        mock_retriever.query = AsyncMock(return_value={
            "answer": "Test answer",
            "sources": [
                {
                    "source": "test",
                    "url": "http://example.com",
                    "text": "Test text",
                    "score": 0.9,
                    "chunk_index": 0
                }
            ],
            "query": "What is this?",
            "documents_retrieved": 1,
            "processing_time_ms": 100,
            "status": "success"
        })
        mock_get_retriever.return_value = mock_retriever
        
        response = client.post(
            "/api/v1/query",
            json={"query": "What is this?"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["answer"] == "Test answer"
        assert data["status"] == "success"
    
    @patch('api.routes.get_indexer')
    def test_index_endpoint(self, mock_get_indexer, client):
        """Test indexing endpoint."""
        # Mock indexer
        mock_indexer = MagicMock()
        mock_indexer.index_documents = AsyncMock(return_value={
            "total": 1,
            "successful": 1,
            "failed": 0,
            "total_chunks": 5,
            "details": [
                {
                    "status": "success",
                    "source": "test_doc",
                    "document_id": "doc123",
                    "chunks_indexed": 5,
                    "message": "Success"
                }
            ]
        })
        mock_get_indexer.return_value = mock_indexer
        
        response = client.post(
            "/api/v1/index",
            json={
                "documents": [
                    {
                        "source": "test_doc",
                        "content": "This is test content for indexing."
                    }
                ]
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["successful"] == 1
        assert data["total_chunks"] == 5
    
    def test_query_validation(self, client):
        """Test query validation."""
        # Empty query should fail
        response = client.post(
            "/api/v1/query",
            json={"query": ""}
        )
        assert response.status_code == 422
    
    def test_index_validation(self, client):
        """Test index validation."""
        # Empty documents should fail
        response = client.post(
            "/api/v1/index",
            json={"documents": []}
        )
        assert response.status_code == 422
        
        # Missing content should fail
        response = client.post(
            "/api/v1/index",
            json={
                "documents": [
                    {"source": "test"}
                ]
            }
        )
        assert response.status_code == 422


class TestAPIModels:
    """Tests for API models."""
    
    def test_query_request_model(self):
        """Test QueryRequest model."""
        from api.models import QueryRequest
        
        # Valid request
        request = QueryRequest(query="What is AI?")
        assert request.query == "What is AI?"
        
        # With optional fields
        request = QueryRequest(
            query="Test",
            session_id="session123",
            top_k=10
        )
        assert request.session_id == "session123"
        assert request.top_k == 10
    
    def test_index_request_model(self):
        """Test IndexRequest model."""
        from api.models import IndexRequest, DocumentInput
        
        request = IndexRequest(
            documents=[
                DocumentInput(
                    source="test",
                    content="Test content here"
                )
            ]
        )
        assert len(request.documents) == 1
        assert request.documents[0].source == "test"
