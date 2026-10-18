import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />
  };

  const borders = {
    success: 'border-emerald-500/40 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]',
    error: 'border-rose-500/40 shadow-[0_0_20px_-3px_rgba(244,63,94,0.3)]',
    warning: 'border-amber-500/40 shadow-[0_0_20px_-3px_rgba(245,158,11,0.3)]',
    info: 'border-cyan-500/40 shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)]'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl bg-[#0D1527] border ${
          borders[toast.type] || borders.info
        } backdrop-blur-xl text-slate-100`}
      >
        <div className="mt-0.5 flex-shrink-0">{icons[toast.type] || icons.info}</div>
        <div className="flex-1">
          {toast.title && <h4 className="text-sm font-semibold text-white">{toast.title}</h4>}
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
