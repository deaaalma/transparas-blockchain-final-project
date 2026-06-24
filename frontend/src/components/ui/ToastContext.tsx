/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 min-w-[300px] rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] p-4 shadow-2xl transition-all duration-300 ease-out animate-in slide-in-from-bottom-5 fade-in"
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="text-[var(--color-income)] w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="text-[var(--color-expense)] w-5 h-5 shrink-0" />
            )}
            <p className="text-sm font-medium text-[var(--color-text-primary)] flex-1 leading-snug">
              {t.message}
            </p>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
