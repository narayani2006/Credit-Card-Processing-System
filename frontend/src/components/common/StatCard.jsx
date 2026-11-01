import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, subtitle, iconBg = '#EEFFFE', iconColor = '#4F46E5' }) => {
  return (
    <div className="card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>{title}</span>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '0.5rem',
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {Icon && <Icon size={18} />}
        </div>
      </div>
      <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {(trend || subtitle) && (
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem' }}>
          {trend && (
            <span style={{ fontWeight: 600, color: trend.startsWith('+') ? '#10b981' : '#64748b' }}>
              {trend}
            </span>
          )}
          <span style={{ color: '#94a3b8' }}>{subtitle || 'vs previous period'}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
