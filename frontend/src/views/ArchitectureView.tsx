import React from 'react';
import { useToast } from '../context/GlobalContext';

const ArchitectureView: React.FC = () => {
  const { showToast } = useToast();

  const handleExport = () => {
    showToast('Preparing system blueprint PDF...', 'info');
    setTimeout(() => showToast('Architecture exported successfully', 'success'), 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Blueprint link copied to clipboard', 'success');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="px-10 py-6 border-b border-[#283039] bg-[#111418]/50">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-[#9dabb9] text-sm font-medium">System Dashboard</span>
          <span className="text-[#9dabb9] text-sm font-medium">/</span>
          <span className="text-white text-sm font-medium">Architecture Blueprint</span>
        </div>
        <div className="flex flex-wrap justify-between items-end gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-3xl font-black tracking-tight">System Architecture</h2>
            <p className="text-[#9dabb9] text-base">High-level technical blueprint of the RAG pipeline and data flow.</p>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg h-10 px-4 bg-[#283039] text-white text-sm font-bold border border-[#3b4754] hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export PDF
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              Share Blueprint
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-10 overflow-auto no-scrollbar">
        <div className="relative w-full h-[650px] min-w-[1000px] bg-[#111418] rounded-2xl border border-[#283039] blueprint-grid overflow-hidden p-8 shadow-2xl">
          {/* Legend */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 bg-[#111418]/90 p-3 rounded-lg border border-[#283039] backdrop-blur-sm z-20">
            <p className="text-[10px] uppercase font-bold text-[#9dabb9] mb-1">Legend</p>
            <div className="flex items-center gap-2 text-xs">
              <div className="size-2 rounded-full bg-primary"></div>
              <span>Core Application</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="size-2 rounded-full bg-accent-teal"></div>
              <span>Managed Services</span>
            </div>
          </div>

          {/* Node 1: Frontend */}
          <div className="absolute top-1/2 -translate-y-1/2 left-10 z-10">
            <NodeCard 
              icon="web" 
              title="Frontend Layer" 
              subtitle="React + Vite" 
              desc="Handles chat interface, document indexing UI, and admin dashboard." 
              type="core"
              onClick={() => showToast('Frontend Layer: React 18 + TypeScript', 'info')}
            />
          </div>

          {/* Connector: REST */}
          <div className="absolute top-1/2 left-[264px] w-[60px] h-[2px] bg-primary/40 flex items-center justify-center -translate-y-1/2">
            <span className="text-[9px] bg-[#111418] px-1 text-primary font-mono border border-primary/30 rounded">REST</span>
            <div className="absolute right-0 translate-x-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_8px_#FFB200]"></div>
          </div>

          {/* Node 2: Backend */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[324px] z-10">
            <NodeCard 
              icon="api" 
              title="Backend Layer" 
              subtitle="FastAPI Server" 
              desc="API routing, request validation, and session management." 
              type="core"
              onClick={() => showToast('Backend Layer: FastAPI + Uvicorn', 'success')}
            />
          </div>

          {/* Connector: Async */}
          <div className="absolute top-1/2 left-[548px] w-[60px] h-[2px] bg-primary/40 flex items-center justify-center -translate-y-1/2">
            <span className="text-[9px] bg-[#111418] px-1 text-primary font-mono border border-primary/30 rounded">Async</span>
            <div className="absolute right-0 translate-x-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_8px_#FFB200]"></div>
          </div>

          {/* Node 3: Engine */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[608px] z-10">
            <div 
              className="w-72 bg-[#1b222a] border-2 border-primary/50 p-6 rounded-2xl shadow-[0_0_40px_rgba(255, 178, 0,0.15)] scale-110 cursor-pointer hover:border-primary transition-all"
              onClick={() => showToast('RAG Engine: LlamaIndex + Custom Pipeline', 'info')}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-3xl">hub</span>
                </div>
                <div>
                  <h3 className="text-sm font-black">RAG Engine</h3>
                  <p className="text-[10px] text-[#9dabb9] uppercase font-bold tracking-tight">LlamaIndex v0.10+</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-white/80 bg-white/5 p-2 rounded border border-white/10">
                  <span className="material-symbols-outlined text-[14px] text-primary">search</span>
                  Semantic Search
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/80 bg-white/5 p-2 rounded border border-white/10">
                  <span className="material-symbols-outlined text-[14px] text-primary">edit_note</span>
                  Query Synthesis
                </div>
              </div>
            </div>
          </div>

          {/* External Services Node */}
          <div className="absolute top-16 left-[612px] z-10">
             <NodeCard 
              icon="cloud" 
              title="External Services" 
              subtitle="OpenRouter API" 
              desc="DeepSeek LLM & OpenAI Embeddings via OpenRouter." 
              type="managed"
              width="w-72"
              onClick={() => showToast('External APIs: OpenRouter → DeepSeek + text-embedding-3-small', 'success')}
            />
            {/* vertical connector */}
            <div className="absolute top-full left-[144px] w-[2px] h-[64px] bg-accent-teal/30">
               <span className="absolute -left-14 top-1/2 -translate-y-1/2 text-[8px] text-accent-teal font-mono uppercase">HTTP/JSON</span>
            </div>
          </div>

          {/* Data Persistence Node */}
          <div className="absolute bottom-16 left-[612px] z-10">
            <div 
              className="w-72 bg-[#1b222a] border border-accent-teal/30 p-5 rounded-xl shadow-xl cursor-pointer hover:border-accent-teal transition-all"
              onClick={() => showToast('Persistence: Qdrant + MongoDB Atlas', 'success')}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-accent-teal/20 flex items-center justify-center text-accent-teal">
                  <span className="material-symbols-outlined">database</span>
                </div>
                <h3 className="text-sm font-bold">Data Persistence</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 p-3 rounded-lg text-center border border-white/5">
                  <p className="text-[9px] font-black text-accent-teal uppercase">Vector</p>
                  <p className="text-xs font-medium">Qdrant</p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg text-center border border-white/5">
                  <p className="text-[9px] font-black text-accent-teal uppercase">Metadata</p>
                  <p className="text-xs font-medium">MongoDB</p>
                </div>
              </div>
            </div>
            {/* vertical connector */}
            <div className="absolute bottom-full left-[144px] w-[2px] h-[64px] bg-accent-teal/30"></div>
          </div>
        </div>

        {/* Component Specifications */}
        <div className="mt-12 mb-10">
          <h2 className="text-white text-2xl font-bold tracking-tight mb-8">Component Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SpecCard 
              icon="view_quilt" 
              title="UI & Access" 
              points={[
                { label: "React Frontend", desc: "TypeScript-based reactive UI with real-time updates." },
                { label: "REST API", desc: "FastAPI backend with automatic OpenAPI documentation." }
              ]} 
              color="primary"
            />
            <SpecCard 
              icon="psychology" 
              title="Intelligence Layer" 
              points={[
                { label: "DeepSeek LLM", desc: "High-quality reasoning model via OpenRouter." },
                { label: "Embeddings", desc: "text-embedding-3-small (1536 dimensions)." }
              ]} 
              color="primary"
            />
            <SpecCard 
              icon="storage" 
              title="Storage Backend" 
              points={[
                { label: "Qdrant Vector DB", desc: "High-performance vector search with HNSW indexing." },
                { label: "MongoDB Atlas", desc: "Stores document metadata and chat history." }
              ]} 
              color="accent-teal"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface NodeCardProps {
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  type: 'core' | 'managed';
  width?: string;
  onClick?: () => void;
}

const NodeCard: React.FC<NodeCardProps> = ({ icon, title, subtitle, desc, type, width = 'w-56', onClick }) => (
  <div 
    onClick={onClick}
    className={`${width} bg-[#1b222a] border ${type === 'core' ? 'border-[#283039]' : 'border-accent-teal/30'} p-4 rounded-xl shadow-2xl transition-all hover:border-primary/50 cursor-pointer group`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`size-10 rounded-lg flex items-center justify-center ${type === 'core' ? 'bg-primary/20 text-primary' : 'bg-accent-teal/20 text-accent-teal'}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-bold group-hover:text-white transition-colors">{title}</h3>
        <p className="text-[10px] text-[#9dabb9] uppercase font-bold tracking-tight">{subtitle}</p>
      </div>
    </div>
    <p className="text-xs text-[#9dabb9] leading-relaxed line-clamp-2">{desc}</p>
  </div>
);

interface SpecCardProps {
  icon: string;
  title: string;
  points: { label: string; desc: string }[];
  color: 'primary' | 'accent-teal';
}

const SpecCard: React.FC<SpecCardProps> = ({ icon, title, points, color }) => (
  <div className="bg-[#1b222a] border border-[#283039] rounded-xl p-6 hover:shadow-xl transition-all group cursor-default">
    <div className="flex items-center gap-3 mb-6">
      <span className={`material-symbols-outlined transition-transform group-hover:scale-110 ${color === 'primary' ? 'text-primary' : 'text-accent-teal'}`}>{icon}</span>
      <h4 className="font-bold text-lg">{title}</h4>
    </div>
    <div className="space-y-6">
      {points.map((p, i) => (
        <div key={i} className={`border-l-2 ${color === 'primary' ? 'border-primary' : 'border-accent-teal'} pl-4 hover:border-white transition-colors`}>
          <p className="text-sm font-bold mb-1">{p.label}</p>
          <p className="text-xs text-[#9dabb9] leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ArchitectureView;
