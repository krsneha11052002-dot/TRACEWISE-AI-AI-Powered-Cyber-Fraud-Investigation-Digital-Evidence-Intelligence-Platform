import React, { useState } from 'react';
import Modal from './Modal';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  caseItem
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!caseItem) return null;

  const handleConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      onConfirm(caseItem.id);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Case Purge / Deletion"
      subtitle="TRACEWISE AI Security Authorization"
      icon={AlertTriangle}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>Permanent Removal Warning</span>
          </div>
          <p className="leading-relaxed">
            You are about to permanently delete case <strong className="font-mono text-white">[{caseItem.id}]</strong>:
            <br />
            <span className="text-white font-medium">"{caseItem.title}"</span>.
          </p>
          <p className="text-[11px] text-rose-300/80">
            This action will unbind linked mule indicators and purge local forensic audit logs. This cannot be undone.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#070B14] border border-slate-800 space-y-1 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Case ID:</span>
            <span className="text-cyan-400 font-bold">{caseItem.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Modus:</span>
            <span className="text-slate-300">{caseItem.fraudType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Defrauded Loss:</span>
            <span className="text-rose-400">₹{caseItem.lossAmount?.toLocaleString('en-IN') || 0}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-semibold shadow-[0_0_20px_-3px_rgba(244,63,94,0.4)] transition-all cursor-pointer disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Purging Dossier...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm Deletion</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
