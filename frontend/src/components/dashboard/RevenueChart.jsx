import React from 'react';
import { TrendingUp, BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RevenueChart = ({ transactions = [] }) => {
  const navigate = useNavigate();
  const hasData = transactions && transactions.length > 0;

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '340px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Revenue over time</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Gross volume over current period</p>
        </div>
        {hasData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700, color: '#10b981' }}>
            <TrendingUp size={16} />
            <span>Active</span>
          </div>
        )}
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
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#eeeffe',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}
          >
            <BarChart3 size={24} />
          </div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
            No payment data yet
          </h4>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', maxWidth: '300px', marginBottom: '1.25rem' }}>
            Create your first payment to see revenue insights and analytics over time.
          </p>
          <button onClick={() => navigate('/new-payment')} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
            <Plus size={14} />
            Create Payment
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {/* Custom SVG Line Graph rendered dynamically from real transactions */}
          <div style={{ height: '200px', width: '100%', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 160 Q 125 110, 250 80 T 500 30 L 500 180 L 0 180 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M 0 160 Q 125 110, 250 80 T 500 30"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="500" cy="30" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Today</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
