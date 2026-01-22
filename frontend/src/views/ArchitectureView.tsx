import React, { useRef, useState } from 'react';
import { useToast } from '../context/GlobalContext';
import { motion } from 'framer-motion';

const ArchitectureView: React.FC = () => {
  const { showToast } = useToast();
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  // Node positions state - tracked in state to update SVG lines
  const [nodes, setNodes] = useState({
    frontend: { x: 40, y: 280 },
    backend: { x: 324, y: 280 },
    engine: { x: 608, y: 280 },
    services: { x: 612, y: 40 },
    persistence: { x: 612, y: 500 }
  });

  const handleDrag = (id: keyof typeof nodes, info: any) => {
    setNodes(prev => ({
      ...prev,
      [id]: { 
        x: prev[id].x + info.delta.x, 
        y: prev[id].y + info.delta.y 
      }
    }));
  };

  const handleExport = () => {
    showToast('Preparing system blueprint PDF...', 'info');
    setTimeout(() => showToast('Architecture exported successfully', 'success'), 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Blueprint link copied to clipboard', 'success');
  };

  // Helper to get anchor points for lines
  const getAnchor = (id: keyof typeof nodes, side: 'left' | 'right' | 'top' | 'bottom') => {
    const node = nodes[id];
    const dimensions = {
      frontend: { w: 224, h: 130 },
      backend: { w: 224, h: 130 },
      engine: { w: 288, h: 175 },
      services: { w: 288, h: 120 },
      persistence: { w: 288, h: 140 }
    };
    
    const { w, h } = dimensions[id];
    
    switch(side) {
      case 'left': return { x: node.x, y: node.y + h/2 };
      case 'right': return { x: node.x + w, y: node.y + h/2 };
      case 'top': return { x: node.x + w/2, y: node.y };
      case 'bottom': return { x: node.x + w/2, y: node.y + h };
    }
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
            <p className="text-[#9dabb9] text-base">Interactive technical blueprint. Drag components to reorganize the flow.</p>
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
        <div 
          ref={constraintsRef}
          className="relative w-full h-[700px] min-w-[1000px] bg-[#111418] rounded-2xl border border-[#283039] blueprint-grid overflow-hidden shadow-2xl"
        >
          {/* SVG Connector Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFB200" fillOpacity="0.5" />
              </marker>
              <marker id="arrow-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" fillOpacity="0.5" />
              </marker>
            </defs>
            
            <ConnectionLine start={getAnchor('frontend', 'right')} end={getAnchor('backend', 'left')} label="REST" color="#FFB200" />
            <ConnectionLine start={getAnchor('backend', 'right')} end={getAnchor('engine', 'left')} label="Async" color="#FFB200" />
            <ConnectionLine start={getAnchor('engine', 'top')} end={getAnchor('services', 'bottom')} label="HTTP/JSON" color="#10b981" />
            <ConnectionLine start={getAnchor('engine', 'bottom')} end={getAnchor('persistence', 'top')} color="#10b981" />
          </svg>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 bg-[#111418]/90 p-3 rounded-lg border border-[#283039] backdrop-blur-sm z-20 pointer-events-none">
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

          <DraggableNode id="frontend" pos={nodes.frontend} onDrag={(info) => handleDrag('frontend', info)} constraints={constraintsRef}>
            <NodeCard 
              icon="web" 
              title="Frontend Layer" 
              subtitle="React + Vite" 
              desc="Handles chat interface, document indexing UI, and admin dashboard." 
              type="core"
              onClick={() => showToast('Frontend Layer: React 18 + TypeScript', 'info')}
            />
          </DraggableNode>

          <DraggableNode id="backend" pos={nodes.backend} onDrag={(info) => handleDrag('backend', info)} constraints={constraintsRef}>
            <NodeCard 
              icon="api" 
              title="Backend Layer" 
              subtitle="FastAPI Server" 
              desc="API routing, request validation, and session management." 
              type="core"
              onClick={() => showToast('Backend Layer: FastAPI + Uvicorn', 'success')}
            />
          </DraggableNode>

          <DraggableNode id="engine" pos={nodes.engine} onDrag={(info) => handleDrag('engine', info)} constraints={constraintsRef}>
            <div 
              className="w-72 bg-[#1b222a] border-2 border-primary/50 p-6 rounded-2xl shadow-[0_0_40px_rgba(255,178,0,0.15)] cursor-pointer hover:border-primary transition-all"
              onClick={() => showToast('RAG Engine: LlamaIndex + Custom Pipeline', 'info')}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-3xl">hub</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">RAG Engine</h3>
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
          </DraggableNode>

          <DraggableNode id="services" pos={nodes.services} onDrag={(info) => handleDrag('services', info)} constraints={constraintsRef}>
             <NodeCard 
              icon="cloud" 
              title="External Services" 
              subtitle="OpenRouter API" 
              desc="DeepSeek LLM & OpenAI Embeddings via OpenRouter." 
              type="managed"
              width="w-72"
              onClick={() => showToast('External APIs: OpenRouter  DeepSeek + text-embedding-3-small', 'success')}
            />
          </DraggableNode>

          <DraggableNode id="persistence" pos={nodes.persistence} onDrag={(info) => handleDrag('persistence', info)} constraints={constraintsRef}>
            <div 
              className="w-72 bg-[#1b222a] border border-accent-teal/30 p-5 rounded-xl shadow-xl cursor-pointer hover:border-accent-teal transition-all"
              onClick={() => showToast('Persistence: Qdrant + MongoDB Atlas', 'success')}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-accent-teal/20 flex items-center justify-center text-accent-teal">
                  <span className="material-symbols-outlined">database</span>
                </div>
                <h3 className="text-sm font-bold text-white">Data Persistence</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 p-3 rounded-lg text-center border border-white/5">
                  <p className="text-[9px] font-black text-accent-teal uppercase">Vector</p>
                  <p className="text-xs font-medium text-white">Qdrant</p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg text-center border border-white/5">
                  <p className="text-[9px] font-black text-accent-teal uppercase">Metadata</p>
                  <p className="text-xs font-medium text-white">MongoDB</p>
                </div>
              </div>
            </div>
          </DraggableNode>
        </div>

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

const DraggableNode: React.FC<{ id: string, pos: {x:number, y:number}, onDrag: (info: any)=>void, constraints: React.RefObject<any>, children: React.ReactNode }> = ({ pos, onDrag, constraints, children }) => (
  <motion.div
    drag
    dragMomentum={false}
    dragConstraints={constraints}
    onDrag={(_, info) => onDrag(info)}
    style={{ x: pos.x, y: pos.y, position: 'absolute' }}
    whileDrag={{ zIndex: 100, cursor: 'grabbing' }}
    className="cursor-grab select-none"
  >
    {children}
  </motion.div>
);

const ConnectionLine: React.FC<{ start: any, end: any, label?: string, color: string }> = ({ start, end, label, color }) => {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  return (
    <g>
      <path 
        d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} 
        stroke={color} 
        strokeWidth="2" 
        strokeDasharray="6 4"
        fill="none" 
        opacity="0.3"
        markerEnd={`url(#${color === '#10b981' ? 'arrow-teal' : 'arrow'})`}
      />
      {label && (
        <foreignObject x={midX - 30} y={midY - 10} width="60" height="20">
          <div className="flex items-center justify-center bg-[#111418] border border-white/5 rounded px-1 shadow-sm">
            <span className="text-[8px] font-mono font-bold uppercase text-white" style={{ color }}>{label}</span>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

const NodeCard: React.FC<{ icon: string, title: string, subtitle: string, desc: string, type: 'core' | 'managed', width?: string, onClick?: () => void }> = ({ icon, title, subtitle, desc, type, width = 'w-56', onClick }) => (
  <div 
    onClick={onClick}
    className={`${width} bg-[#1b222a] border ${type === 'core' ? 'border-[#283039]' : 'border-accent-teal/30'} p-4 rounded-xl shadow-2xl transition-all hover:border-primary/50 group text-white`}
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

const SpecCard: React.FC<{ icon: string, title: string, points: any[], color: 'primary' | 'accent-teal' }> = ({ icon, title, points, color }) => (
  <div className="bg-[#1b222a] border border-[#283039] rounded-xl p-6 hover:shadow-xl transition-all group text-white">
    <div className="flex items-center gap-3 mb-6">
      <span className={`material-symbols-outlined ${color === 'primary' ? 'text-primary' : 'text-accent-teal'}`}>{icon}</span>
      <h4 className="font-bold text-lg">{title}</h4>
    </div>
    <div className="space-y-6">
      {points.map((p, i) => (
        <div key={i} className={`border-l-2 ${color === 'primary' ? 'border-primary' : 'border-accent-teal'} pl-4`}>
          <p className="text-sm font-bold mb-1">{p.label}</p>
          <p className="text-xs text-[#9dabb9] leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ArchitectureView;
