#  RAG Chatbot - Production-Ready RAG Application

A production-ready Retrieval-Augmented Generation (RAG) chatbot built with Python, featuring semantic document search, AI-powered question answering, and source citations.

##  Features

-  **Semantic Search** - Find relevant documents using vector similarity
-  **AI-Powered Answers** - Generate accurate responses using LLM
-  **Multi-Document Support** - Index and search across multiple documents
-  **Source Citations** - Every answer includes relevant sources
-  **Chat History** - Track conversation history per session
-  **Production-Ready** - Docker support, logging, error handling
-  **REST API** - Clean FastAPI endpoints for easy integration

##  Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   FastAPI       │────▶│   RAG Engine    │
│   (Your HTML)   │     │   Backend       │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                        ┌────────────────────────────────┼────────────────────────────────┐
                        │                                │                                │
                        ▼                                ▼                                ▼
                ┌───────────────┐              ┌─────────────────┐              ┌─────────────────┐
                │   Qdrant      │              │   OpenRouter    │              │   MongoDB       │
                │   (Vectors)   │              │   (LLM/Embed)   │              │   (Metadata)    │
                └───────────────┘              └─────────────────┘              └─────────────────┘
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Python 3.11+, FastAPI |
| RAG Engine | LlamaIndex |
| Vector DB | Qdrant Cloud |
| LLM & Embeddings | OpenRouter (DeepSeek) |
| Metadata DB | MongoDB Atlas |
| Containerization | Docker |

## 📁 Project Structure

```
RAGChatbot/
├── api/
│   ├── __init__.py
│   ├── models.py          # Pydantic request/response models
│   └── routes.py          # API endpoints
├── config/
│   ├── __init__.py
│   ├── settings.py        # Configuration management
│   ├── constants.py       # Application constants
│   └── logging_config.py  # Logging setup
├── rag/
│   ├── __init__.py
│   ├── indexing.py        # Document indexing logic
│   ├── retrieval.py       # Query & retrieval logic
│   └── utils.py           # Helper functions
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── views/         # Page components
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app
│   ├── package.json
│   └── vite.config.ts
├── tests/
│   ├── test_indexing.py
│   ├── test_retrieval.py
│   └── test_integration.py
├── main.py                # Application entry point
├── requirements.txt       # Python dependencies
├── Dockerfile            # Container definition
├── docker-compose.yml    # Docker Compose config
├── .env.example          # Environment template
└── README.md             # This file
```

##  Quick Start

### 1. Clone & Setup

```bash
cd RAGChatbot

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy environment template
copy .env.example .env

# Edit .env with your API keys
```

### 3. Run the Application

```bash
# Development mode
python main.py

# Or with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Access the API

- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/v1/health

### 5. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

- **Frontend**: http://localhost:5173

##  Docker Deployment

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d
```

## 📡 API Endpoints

### Query (Ask Questions)
```bash
POST /api/v1/query
{
    "query": "What is machine learning?",
    "session_id": "user123",  # optional
    "top_k": 5                # optional
}
```

### Index Documents
```bash
POST /api/v1/index
{
    "documents": [
        {
            "source": "ml_guide",
            "content": "Machine learning is a subset of AI...",
            "url": "https://example.com/ml",
            "metadata": {"type": "article"}
        }
    ]
}
```

### Search Documents
```bash
POST /api/v1/search
{
    "query": "neural networks",
    "top_k": 10
}
```

### Health Check
```bash
GET /api/v1/health
```

### Collection Stats
```bash
GET /api/v1/stats
```

## 🔧 Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key | Required |
| `QDRANT_API_KEY` | Qdrant Cloud API key | Required |
| `QDRANT_URL` | Qdrant Cloud URL | Required |
| `MONGO_URI` | MongoDB connection URI | Required |
| `LLM_MODEL` | LLM model name | `deepseek/deepseek-chat` |
| `EMBEDDING_MODEL` | Embedding model | `openai/text-embedding-3-small` |
| `TOP_K` | Documents to retrieve | `5` |
| `CHUNK_SIZE` | Text chunk size | `512` |

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html
```

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
