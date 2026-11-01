import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, text = 'Loading...' }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
      <Loader2 size={size} style={{ animation: 'spin 1s linear infinite' }} />
      {text && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{text}</span>}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
