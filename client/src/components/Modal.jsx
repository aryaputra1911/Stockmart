import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box ${maxWidth}`}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
            borderRadius: '20px 20px 0 0',
          }}
        >
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            id="modal-close-btn"
          >
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
