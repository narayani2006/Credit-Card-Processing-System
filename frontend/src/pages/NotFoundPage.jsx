import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#ffffff', padding: '2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '440px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '1rem',
            backgroundColor: '#4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)'
          }}
        >
          <CreditCard size={32} color="#ffffff" />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#cbd5e1' }}>Page Not Found</h2>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.6' }}>
          The page you are trying to access does not exist or has been moved.
        </p>

        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
