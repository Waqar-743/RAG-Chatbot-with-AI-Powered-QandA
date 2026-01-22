# 🛠️ Setup Guide - RAG Chatbot

This guide will walk you through setting up the RAG Chatbot from scratch.

## Prerequisites

- Python 3.11 or higher
- Git
- Docker (optional, for containerized deployment)

## Step 1: Get API Keys

You'll need accounts and API keys from the following services:

### 1.1 OpenRouter (LLM & Embeddings)

1. Go to [OpenRouter](https://openrouter.ai/)
2. Create an account
3. Navigate to **Keys** section
4. Create a new API key
5. Copy the key (starts with `sk-or-...`)

### 1.2 Qdrant Cloud (Vector Database)

1. Go to [Qdrant Cloud](https://cloud.qdrant.io/)
2. Create a free account
3. Create a new cluster (free tier available)
4. Once created, copy:
   - **Cluster URL**: `https://xxx-xxx.aws.cloud.qdrant.io`
   - **API Key**: Found in cluster dashboard

### 1.3 MongoDB Atlas (Metadata Storage)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Set up database user credentials
5. Get connection string:
   - Click **Connect** → **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database user password

## Step 2: Environment Setup

### 2.1 Create Virtual Environment

```bash
cd RAGChatbot

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

### 2.3 Configure Environment Variables

```bash
# Copy the example file
copy .env.example .env   # Windows
# cp .env.example .env   # Linux/Mac

# Edit .env with your actual values
```

Edit `.env` file:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Qdrant Configuration
QDRANT_API_KEY=your-qdrant-api-key-here
QDRANT_URL=https://your-cluster-id.aws.cloud.qdrant.io
QDRANT_COLLECTION=rag_documents

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rag_db?retryWrites=true&w=majority
MONGO_DB_NAME=rag_db

# Application Configuration
APP_HOST=0.0.0.0
APP_PORT=8000
DEBUG=True
LOG_LEVEL=INFO

# LLM Configuration
LLM_MODEL=deepseek/deepseek-chat
EMBEDDING_MODEL=openai/text-embedding-3-small
TEMPERATURE=0.7
MAX_TOKENS=2048

# RAG Configuration
TOP_K=5
SIMILARITY_THRESHOLD=0.6
CHUNK_SIZE=512
CHUNK_OVERLAP=50
```

## Step 3: Run the Application

### Development Mode

```bash
python main.py
```

Or with auto-reload:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Verify It's Running

1. Open browser: http://localhost:8000
2. Check API docs: http://localhost:8000/docs
3. Health check: http://localhost:8000/api/v1/health

## Step 4: Test the API

### Index a Document

```bash
curl -X POST http://localhost:8000/api/v1/index \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [
      {
        "source": "test_doc",
        "content": "Artificial Intelligence (AI) is the simulation of human intelligence by machines. Machine Learning is a subset of AI that enables systems to learn from data.",
        "url": "https://example.com"
      }
    ]
  }'
```

### Query the System

```bash
curl -X POST http://localhost:8000/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is AI?"
  }'
```

## Step 5: Docker Deployment (Optional)

### Build and Run

```bash
docker-compose up --build
```

### Run in Background

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f
```

### Stop

```bash
docker-compose down
```

## Troubleshooting

### Common Issues

1. **Connection Error to Qdrant**
   - Verify QDRANT_URL is correct
   - Check QDRANT_API_KEY
   - Ensure cluster is running

2. **MongoDB Connection Failed**
   - Check MONGO_URI format
   - Verify IP whitelist includes your IP
   - Test connection with MongoDB Compass

3. **OpenRouter API Error**
   - Verify API key is correct
   - Check model names are valid
   - Ensure you have credits

4. **Import Errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` again

### Need Help?

Check the logs in the `logs/` directory for detailed error messages.
