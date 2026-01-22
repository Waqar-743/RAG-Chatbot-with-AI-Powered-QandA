import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';

// Context
import { ToastProvider, IndexingProvider } from './context/GlobalContext';

// Views
import ChatView from './views/ChatView';
import IndexingView from './views/IndexingView';
import ArchitectureView from './views/ArchitectureView';
import TraceView from './views/TraceView';
import SecurityView from './views/SecurityView';

// Navigation Item Component
interface NavItemProps {
  to: string;
  icon: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        isActive
          ? 'bg-primary text-white shadow-lg shadow-primary/20'
          : 'text-[#9dabb9] hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

// Main Layout with Sidebar
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background-dark text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-[#111418] border-r border-[#283039] flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-[#283039]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-white text-2xl">psychology</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">RAG Chatbot</h1>
              <p className="text-[10px] text-[#9dabb9] font-bold uppercase tracking-widest">Enterprise Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-black text-[#9dabb9] uppercase tracking-widest px-4 mb-4">Main Menu</p>
          <NavItem to="/" icon="upload_file" label="Indexing Dashboard" />
          <NavItem to="/chat" icon="chat" label="Chat Interface" />
          <NavItem to="/architecture" icon="account_tree" label="Architecture" />
          <NavItem to="/trace" icon="timeline" label="Query Trace" />
          <NavItem to="/security" icon="shield" label="Security & Monitoring" />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#283039]">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="size-9 rounded-full bg-primary/20 border border-primary/30 overflow-hidden">
              <img src="https://picsum.photos/seed/admin/40/40" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-[10px] text-[#9dabb9]">System Administrator</p>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg text-[#9dabb9] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

// App Component
const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <IndexingProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<IndexingView />} />
              <Route path="/chat" element={<ChatView />} />
              <Route path="/architecture" element={<ArchitectureView />} />
              <Route path="/trace" element={<TraceView />} />
              <Route path="/security" element={<SecurityView />} />
            </Routes>
          </Layout>
        </IndexingProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
