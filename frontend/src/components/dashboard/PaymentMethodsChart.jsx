import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentMethodsChart = ({ paymentMethods = [] }) => {
  const hasData = paymentMethods && paymentMethods.length > 0;
  const brandColors = {
    Visa: '#4f46e5',
    Mastercard: '#f59e0b',
    Amex: '#3b82f6',
    Discover: '#10b981',
    RuPay: '#8b5cf6'
  };

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '340px' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Payment methods</h3>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>By processed volume & share</p>
      </div>

      {!hasData ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #e2e8f0',
            borderRadius: '0.75rem',
            padding: '2rem 1rem',
            textAlign: 'center',
            backgroundColor: '#f8fafc'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}
          >
            <CreditCard size={22} />
          </div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
            No payment methods used yet.
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '240px' }}>
            Card brand breakdown will appear automatically as customers process transactions.
          </p>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Donut Chart representation */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', position: 'relative' }}>
            <svg width="140" height="140" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
              {paymentMethods.map((method, idx) => {
                const color = brandColors[method.brand] || '#4f46e5';
                const strokeDasharray = `${method.percentage} ${100 - method.percentage}`;
                return (
                  <circle
                    key={method.brand}
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="4"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={25 - idx * 20}
                  />
                );
              })}
            </svg>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>100%</div>
              <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active</div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {paymentMethods.map((method) => {
              const color = brandColors[method.brand] || '#4f46e5';
              return (
                <div key={method.brand} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                    <span style={{ fontWeight: 600, color: '#334155' }}>{method.brand}</span>
                  </div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{method.percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsChart;
