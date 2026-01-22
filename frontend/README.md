# RAG Chatbot Frontend

A modern React-based admin dashboard for the RAG (Retrieval-Augmented Generation) Chatbot system.

## Features

- **Chat Interface**: Interactive chat with the RAG system, showing sources for each response
- **Indexing Dashboard**: Upload and index documents into the vector database
- **Architecture View**: Visual representation of the system architecture
- **Query Trace**: Detailed visualization of the RAG pipeline execution
- **Security & Monitoring**: Real-time metrics, access logs, and error tracking

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication

## Prerequisites

- Node.js 18+ or Bun
- Backend API running on `http://localhost:8000`

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Or using Bun
bun install
```

## Development

```bash
# Start development server
npm run dev

# Or using Bun
bun run dev
```

The frontend will be available at `http://localhost:5173` and will proxy API requests to the backend at `http://localhost:8000`.

## Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── views/
│   │   ├── ChatView.tsx          # Chat interface
│   │   ├── IndexingView.tsx      # Document indexing
│   │   ├── ArchitectureView.tsx  # System architecture
│   │   ├── TraceView.tsx         # Query flow visualization
│   │   └── SecurityView.tsx      # Security dashboard
│   ├── services/
│   │   └── api.ts                # API client
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── App.tsx                   # Main app with routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## API Integration

The frontend connects to the following backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/query` | POST | Send a query to the RAG system |
| `/api/v1/search` | POST | Semantic search without LLM response |
| `/api/v1/index` | POST | Index new documents |
| `/api/v1/stats` | GET | Get system statistics |
| `/api/v1/health` | GET | Health check |
| `/api/v1/documents/{id}` | GET | Get document metadata |
| `/api/v1/history/{session_id}` | GET | Get chat history |

## Environment Variables

Create a `.env` file for environment-specific settings:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Customization

### Theme Colors

The color scheme is defined in `tailwind.config.js`:

- **Primary**: `#FFB200` (Amber)
- **Accent Teal**: `#2dd4bf`
- **Background**: `#111418` (Dark)
- **Surface**: `#1b222a` (Slightly lighter dark)

### Icons

The project uses [Material Symbols](https://fonts.google.com/icons) for icons. Icon names can be found at the Google Fonts Icons website.
