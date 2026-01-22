export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

export interface Source {
  id: string;
  document_id: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface Document {
  id: string;
  filename: string;
  content_type: string;
  chunk_count: number;
  indexed_at: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface SystemStats {
  total_documents: number;
  total_chunks: number;
  total_queries: number;
  avg_latency_ms: number;
  vector_db_status: 'connected' | 'disconnected';
  metadata_db_status: 'connected' | 'disconnected';
}

export interface IndexingProgress {
  stage: 'uploading' | 'chunking' | 'embedding' | 'indexing' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface QueryRequest {
  query: string;
  session_id?: string;
  top_k?: number;
  filters?: Record<string, any>;
}

export interface QueryResponse {
  response: string;
  sources: Source[];
  session_id: string;
  latency_ms: number;
}

export interface IndexRequest {
  content: string;
  filename: string;
  content_type?: string;
  metadata?: Record<string, any>;
}

export interface IndexResponse {
  document_id: string;
  chunks_created: number;
  message: string;
}
