import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

// === Toast Context ===
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast-enter flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-primary/10 border-primary/30 text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <span className="text-sm font-medium text-white">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// === Indexing Context ===
export interface ActivityLog {
  name: string;
  time: string;
  duration: string;
  status: 'SUCCESS' | 'FAILED';
  icon: string;
  chunks?: number;
}

export interface IndexingDocument {
  sourceName: string;
  textContent: string;
  wikiUrl: string;
}

interface IndexingContextType {
  document: IndexingDocument;
  setDocument: (doc: IndexingDocument) => void;
  activityLogs: ActivityLog[];
  addActivityLog: (log: ActivityLog) => void;
  clearActivityLogs: () => void;
  sessionStats: {
    indexedCount: number;
    totalChunks: number;
  };
  updateSessionStats: (chunks: number) => void;
}

const IndexingContext = createContext<IndexingContextType | null>(null);

export const useIndexing = () => {
  const context = useContext(IndexingContext);
  if (!context) {
    throw new Error('useIndexing must be used within IndexingProvider');
  }
  return context;
};

export const IndexingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [document, setDocument] = useState<IndexingDocument>({
    sourceName: '',
    textContent: '',
    wikiUrl: ''
  });
  
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('indexingActivityLogs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [sessionStats, setSessionStats] = useState({
    indexedCount: 0,
    totalChunks: 0
  });

  const addActivityLog = useCallback((log: ActivityLog) => {
    setActivityLogs(prev => {
      const newLogs = [log, ...prev.slice(0, 49)];
      localStorage.setItem('indexingActivityLogs', JSON.stringify(newLogs));
      return newLogs;
    });
    if (log.status === 'SUCCESS') {
      setSessionStats(prev => ({
        indexedCount: prev.indexedCount + 1,
        totalChunks: prev.totalChunks + (log.chunks || 0)
      }));
    }
  }, []);

  const clearActivityLogs = useCallback(() => {
    setActivityLogs([]);
    localStorage.removeItem('indexingActivityLogs');
  }, []);

  const updateSessionStats = useCallback((chunks: number) => {
    setSessionStats(prev => ({
      indexedCount: prev.indexedCount + 1,
      totalChunks: prev.totalChunks + chunks
    }));
  }, []);

  return (
    <IndexingContext.Provider value={{
      document,
      setDocument,
      activityLogs,
      addActivityLog,
      clearActivityLogs,
      sessionStats,
      updateSessionStats
    }}>
      {children}
    </IndexingContext.Provider>
  );
};
