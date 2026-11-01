import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '0.875rem 1.25rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        borderLeft: `4px solid ${isSuccess ? '#10b981' : '#ef4444'}`,
        fontSize: '0.875rem',
        fontWeight: 500
      }}
    >
      {isSuccess ? <CheckCircle2 size={18} style={{ color: '#10b981' }} /> : <AlertCircle size={18} style={{ color: '#ef4444' }} />}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '0.5rem'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
