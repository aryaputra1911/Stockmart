import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen, onClose, onConfirm, title, message,
  confirmText = 'Hapus', confirmClass = 'btn-danger', loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-sm">
        <div className="p-8 text-center">
          {/* Warning icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: '#fee2e2', border: '3px solid #fecaca' }}
          >
            <AlertTriangle size={30} style={{ color: '#dc2626' }} />
          </div>

          <h3 className="text-lg font-bold mb-2" style={{ color: '#111827' }}>{title}</h3>
          <p className="text-sm mb-7" style={{ color: '#6b7280' }}>{message}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="btn-secondary px-6"
              disabled={loading}
              id="confirm-cancel-btn"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className={`${confirmClass} px-6`}
              disabled={loading}
              id="confirm-action-btn"
              style={{ padding: '10px 24px', fontSize: '0.875rem' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
