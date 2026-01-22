import React, { useState } from 'react';
import { useToast } from '../context/GlobalContext';

const TraceView: React.FC = () => {
  const { showToast } = useToast();
  const [traceId] = useState(`rag-trace-${Math.random().toString(36).substr(2, 8)}`);
  const [timestamp] = useState(new Date().toISOString());

  const handleExport = () => {
    showToast('Compiling trace JSON data...', 'info');
    
    // Generate actual JSON trace data
    const traceData = {
      trace_id: traceId,
      timestamp: timestamp,
      status: 'success',
      total_latency_ms: 3245,
      stages: [
        {
          name: 'Query Preprocessing',
          latency_ms: 45,
          status: 'completed',
          details: { cleaned_query: true, expanded: true }
        },
        {
          name: 'Embedding Generation',
          latency_ms: 182,
          status: 'completed',
          model: 'text-embedding-3-small',
          dimensions: 1536
        },
        {
          name: 'Semantic Search',
          latency_ms: 418,
          status: 'completed',
          vector_db: 'Qdrant',
          top_k: 5,
          retrieved_chunks: ['chunk_8829_1', 'chunk_4412_5', 'chunk_3301_2', 'chunk_9921_7', 'chunk_1123_3']
        },
        {
          name: 'Context Assembly',
          latency_ms: 10,
          status: 'completed',
          prompt_tokens: 1420
        },
        {
          name: 'LLM Synthesis',
          latency_ms: 2590,
          status: 'completed',
          model: 'deepseek/deepseek-chat',
          input_tokens: 1420,
          output_tokens: 342
        }
      ],
      query: 'What are the latest compliance requirements for RAG?',
      response_preview: 'According to the internal policy docs...'
    };

    const jsonStr = JSON.stringify(traceData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${traceId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`Trace exported: ${traceId}.json`, 'success');
  };

  const handleReRun = () => {
    showToast('Re-triggering trace pipeline...', 'info');
    setTimeout(() => showToast('Trace complete (Latency: 3,110ms)', 'success'), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto no-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full border border-emerald-500/20">Success</span>
            <span className="text-[#9dabb9] text-xs font-bold tracking-tight">Jan 22, 2026 • 14:22:10 UTC</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Query Flow Visualization</h1>
          <p className="text-[#9dabb9] text-base">
            Trace ID: <code 
              onClick={() => {
                navigator.clipboard.writeText(traceId);
                showToast('Trace ID copied', 'success');
              }}
              className="bg-[#1b222a] px-2 py-1 rounded text-primary font-mono text-sm border border-[#283039] cursor-pointer hover:border-primary transition-all"
            >
              {traceId}
            </code> 
            <span className="mx-3 opacity-20">|</span> 
            Total Latency: <span className="text-white font-black">3,245ms</span>
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1b222a] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all border border-[#283039]"
          >
            <span className="material-symbols-outlined text-lg">download</span> Export JSON
          </button>
          <button 
            onClick={handleReRun}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">refresh</span> Re-run Trace
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        <LatencyCard label="Preprocessing" val="45ms" onClick={() => showToast('Stage 1 Details')} />
        <LatencyCard label="Embedding" val="182ms" onClick={() => showToast('Stage 2 Details')} />
        <LatencyCard label="Retrieval" val="418ms" onClick={() => showToast('Stage 3 Details')} />
        <LatencyCard label="Assembly" val="10ms" onClick={() => showToast('Stage 4 Details')} />
        <LatencyCard label="Synthesis" val="2,590ms" active onClick={() => showToast('Stage 5 Details')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 xl:col-span-3">
           <div className="bg-[#1b222a] border border-[#283039] rounded-2xl p-8 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined">analytics</span> Pipeline Trace
              </h3>
              <div className="space-y-0 relative">
                 <TraceStep icon="check_circle" title="Query Preprocessing" sub="Cleaned & expanded query" done />
                 <TraceStep icon="memory" title="Embedding Generation" sub="OpenRouter API (1536 dim)" done />
                 <TraceStep icon="database" title="Semantic Search" sub="Qdrant (top_k=5)" done />
                 <TraceStep icon="description" title="Context Assembly" sub="Prompt Construction" done />
                 <TraceStep icon="chat" title="LLM Synthesis" sub="DeepSeek Chat" active />
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-10">
           <section className="bg-[#1b222a] border border-[#283039] rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-8 py-5 border-b border-[#283039] flex justify-between items-center bg-[#1c2229]">
                 <div className="flex items-center gap-4">
                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
                       <span className="material-symbols-outlined text-primary text-2xl">database</span>
                    </div>
                    <h2 className="text-lg font-black tracking-tight">Stage 3: Semantic Search (Qdrant)</h2>
                 </div>
                 <span className="text-[#9dabb9] text-[10px] font-mono font-bold uppercase tracking-widest">latency: 418ms</span>
              </div>
              <div className="p-8">
                 <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#9dabb9] mb-4">Query Vector Snippet (First 4 dimensions):</p>
                    <code className="block bg-[#0d1117] p-5 rounded-xl text-xs font-mono text-primary leading-relaxed border border-[#283039]">
                       [-0.0124523, 0.0452311, -0.0023412, 0.0156782, ...]
                    </code>
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-[2px] text-[#9dabb9] mb-6">Retrieved Chunks (top_k=5)</h4>
                 <div className="space-y-4">
                    <ChunkItem id="chunk_8829_1" score="0.942" text="...the enterprise safety guidelines require all AI outputs to be grounded in the verified knowledge base using the RAG architecture..." onClick={() => showToast('Chunk 1 selected')} />
                    <ChunkItem id="chunk_4412_5" score="0.887" text="...compliance officers must review citations generated by the LLM synthesis engine for accuracy and source attribution..." onClick={() => showToast('Chunk 2 selected')} />
                    <button 
                      onClick={() => showToast('Loading more chunks from vector store...', 'info')}
                      className="w-full py-3 text-primary text-xs font-black uppercase tracking-widest hover:bg-white/5 rounded-xl border border-primary/10 transition-all"
                    >
                      View 3 More Results
                    </button>
                 </div>
              </div>
           </section>

           <section className="bg-[#1b222a] border border-[#283039] rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-8 py-5 border-b border-[#283039] flex justify-between items-center bg-[#1c2229]">
                 <div className="flex items-center gap-4">
                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
                       <span className="material-symbols-outlined text-primary text-2xl">chat</span>
                    </div>
                    <h2 className="text-lg font-black tracking-tight">Stage 5: LLM Synthesis</h2>
                 </div>
                 <span className="text-[#9dabb9] text-[10px] font-mono font-bold uppercase tracking-widest">tokens: 1,420 (in) / 342 (out)</span>
              </div>
              <div className="p-8">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-[#9dabb9] mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">terminal</span> Final Prompt Snippet
                       </h4>
                       <div className="bg-[#0d1117] rounded-xl p-6 font-mono text-[11px] text-slate-400 h-80 overflow-y-auto leading-relaxed border border-[#283039]">
                          <span className="text-emerald-500 font-black">System:</span> You are a helpful AI assistant...<br/>
                          <span className="text-emerald-500 font-black">Context:</span> [Retrieved Chunks 1-5]<br/>
                          <span className="text-emerald-500 font-black">Query:</span> "What are the latest compliance requirements for RAG?"<br/><br/>
                          <span className="opacity-30 italic text-white/50">...[Full prompt details truncated for brevity]...</span>
                       </div>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">auto_awesome</span> Model Output
                       </h4>
                       <div className="bg-primary/5 rounded-xl p-8 h-80 border border-primary/10 shadow-inner">
                          <div className="text-slate-200 text-sm leading-relaxed font-medium space-y-6">
                             <p>According to the internal policy docs (IDs: chunk_8829_1, chunk_4412_5), requirements for RAG systems include:</p>
                             <div className="space-y-4">
                                <p><span className="text-primary font-black">1. Grounded Outputs:</span> All synthesis must be derived directly from the provided context chunks.</p>
                                <p><span className="text-primary font-black">2. Citation Mapping:</span> Every claim must link back to a specific UUID from the vector store.</p>
                                <p><span className="text-primary font-black">3. Officer Review:</span> Outputs exceeding threshold must be flagged for manual review.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

const LatencyCard: React.FC<{ label: string; val: string; active?: boolean; onClick?: () => void }> = ({ label, val, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex flex-col gap-1 rounded-2xl p-6 border transition-all cursor-pointer hover:border-primary/50 group ${
    active ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/5' : 'border-[#283039] bg-[#1b222a]'
  }`}>
    <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${active ? 'text-primary' : 'text-[#9dabb9]'}`}>{label}</p>
    <p className={`text-3xl font-black group-hover:scale-105 transition-transform ${active ? 'text-white' : 'text-white/90'}`}>{val}</p>
  </div>
);

const TraceStep: React.FC<{ icon: string; title: string; sub: string; done?: boolean; active?: boolean }> = ({ icon, title, sub, done, active }) => (
  <div className="flex gap-6 group cursor-pointer pb-10 last:pb-0 relative">
     {/* step line */}
     <div className="absolute left-[15px] top-[32px] bottom-0 w-[2px] bg-[#283039] last:hidden group-last:hidden"></div>
     <div className="flex flex-col items-center shrink-0">
        <div className={`size-8 rounded-full flex items-center justify-center z-10 ring-4 transition-all ${
          done ? 'bg-primary text-white ring-primary/10' : 
          active ? 'bg-primary text-white ring-primary/30 animate-pulse' : 
          'bg-[#111418] text-slate-700 ring-[#111418]'
        }`}>
           <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
     </div>
     <div className="pt-0.5">
        <h4 className={`text-sm font-bold transition-colors ${active ? 'text-primary' : 'text-white'}`}>{title}</h4>
        <p className="text-[10px] text-[#9dabb9] font-medium tracking-tight mt-1">{sub}</p>
     </div>
  </div>
);

const ChunkItem: React.FC<{ id: string; score: string; text: string; onClick?: () => void }> = ({ id, score, text, onClick }) => (
  <div 
    onClick={onClick}
    className="p-5 rounded-xl border border-[#283039] bg-[#0d1117] hover:border-primary/40 transition-all cursor-pointer group"
  >
    <div className="flex justify-between mb-3 items-center">
      <span className="text-[10px] font-black text-[#9dabb9] uppercase tracking-widest group-hover:text-primary transition-colors">ID: {id}</span>
      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">Score: {score}</span>
    </div>
    <p className="text-xs text-slate-400 font-medium leading-relaxed italic line-clamp-2">"{text}"</p>
  </div>
);

export default TraceView;
