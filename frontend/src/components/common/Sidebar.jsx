import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Receipt, Settings, Users, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Payment', path: '/new-payment', icon: CreditCard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  if (isAdmin) {
    navItems.push({ name: 'User Management', path: '/admin/users', icon: Users });
  }

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 20,
        borderRight: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <div>
        {/* Logo Section */}
        <div style={{ padding: '1.5rem 1.5rem 2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '0.5rem',
              backgroundColor: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
            }}
          >
            <CreditCard size={20} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff' }}>
              PayFlow
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#818cf8',
                textTransform: 'uppercase'
              }}
            >
              FINTECH OS
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '0 0.75rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.75rem 0.625rem' }}>
            Main Menu
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      padding: '0.75rem 0.875rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#ffffff' : '#94a3b8',
                      backgroundColor: isActive ? '#4f46e5' : 'transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={18} color={isActive ? '#ffffff' : '#94a3b8'} />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer Security Badge */}
      <div style={{ padding: '1.25rem' }}>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0.75rem',
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '0.375rem' }}>
            <ShieldCheck size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PCI-DSS Compliant
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
            Payments protected with bank-grade 256-bit encryption.
          </p>
        </div>
        <div style={{ marginTop: '0.875rem', fontSize: '0.6875rem', color: '#475569', textAlign: 'center' }}>
          PayFlow v2.4.0 · Production Ready
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
