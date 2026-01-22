"""
Application Constants.
Static values that don't change based on environment.
"""

# ===========================================
# Vector Configuration
# ===========================================
VECTOR_DIMENSION = 1536  # text-embedding-3-small dimension
VECTOR_METRIC = "Cosine"

# ===========================================
# Response Configuration
# ===========================================
MAX_SOURCES_RETURNED = 5
MIN_SIMILARITY_SCORE = 0.5
DEFAULT_NO_ANSWER = "I don't have enough information to answer this question based on the available documents."

# ===========================================
# Rate Limiting
# ===========================================
RATE_LIMIT_REQUESTS = 100
RATE_LIMIT_PERIOD = 3600  # 1 hour in seconds

# ===========================================
# Timeouts (in seconds)
# ===========================================
REQUEST_TIMEOUT = 30
EMBEDDING_TIMEOUT = 30
LLM_TIMEOUT = 60
MONGODB_TIMEOUT = 10000  # milliseconds

# ===========================================
# File Processing
# ===========================================
SUPPORTED_FILE_TYPES = [".txt", ".pdf", ".docx", ".md"]
MAX_FILE_SIZE_MB = 10
MAX_CONTENT_LENGTH = 100000  # characters

# ===========================================
# System Prompts
# ===========================================
SYSTEM_PROMPT = """You are a helpful AI assistant specialized in answering questions based on provided context.

IMPORTANT RULES:
1. Answer ONLY based on the provided context
2. If the answer is not in the context, say "I don't have enough information to answer this question"
3. Be concise but comprehensive
4. Cite sources when possible by mentioning the document name
5. If the context contains conflicting information, mention both perspectives
6. Do not make up information or hallucinate facts

Always maintain a professional and helpful tone."""

RAG_PROMPT_TEMPLATE = """Based on the following context, please answer the user's question.

CONTEXT:
{context}

USER QUESTION: {question}

Please provide a helpful and accurate answer based only on the context above. If the context doesn't contain enough information to answer the question, say so clearly."""

# ===========================================
# Collection Names (MongoDB)
# ===========================================
DOCUMENTS_COLLECTION = "documents"
CHAT_HISTORY_COLLECTION = "chat_history"
METADATA_COLLECTION = "metadata"

# ===========================================
# API Response Messages
# ===========================================
MSG_SUCCESS = "Operation completed successfully"
MSG_ERROR_GENERIC = "An error occurred while processing your request"
MSG_ERROR_NO_DOCS = "No relevant documents found"
MSG_ERROR_INDEXING = "Error occurred during document indexing"
MSG_ERROR_RETRIEVAL = "Error occurred during document retrieval"
