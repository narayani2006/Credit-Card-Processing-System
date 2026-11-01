import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
  showCreatePayment = false
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (showCreatePayment) {
      navigate('/new-payment');
    }
  };

  return (
    <div
      style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        borderRadius: '0.75rem'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <Icon size={26} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.375rem' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '360px', marginBottom: '1.25rem', lineHeight: '1.5' }}>
        {description}
      </p>
      {(actionLabel || showCreatePayment) && (
        <button onClick={handleAction} className="btn-primary">
          <Plus size={16} />
          {actionLabel || 'Create Payment'}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
