import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, Settings, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '360px' }}>
        <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search transactions, customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', height: '40px', borderRadius: '0.5rem', backgroundColor: '#f8fafc' }}
        />
        <span
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#94a3b8',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '1px 5px'
          }}
        >
          ⌘K
        </span>
      </form>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            background: 'none',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '7px',
              height: '7px',
              backgroundColor: '#ef4444',
              borderRadius: '50%'
            }}
          />
        </button>

        {/* User Profile Menu */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#eeeffe',
                color: '#4f46e5',
                fontWeight: 700,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #e0e7ff'
              }}
            >
              {initials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.2' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 500 }}>
                {isAdmin ? 'Administrator' : 'User Account'}
              </div>
            </div>
            <ChevronDown size={16} style={{ color: '#94a3b8' }} />
          </button>

          {/* Dropdown Card */}
          {dropdownOpen && (
            <div
              className="animate-fade-in card"
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                width: '220px',
                padding: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                zIndex: 30
              }}
            >
              <div style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.25rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all' }}>{user?.email}</div>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 0.75rem',
                  fontSize: '0.875rem',
                  color: '#334155',
                  background: 'none',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                className="hover-bg"
              >
                <Settings size={16} />
                <span>Settings & Security</span>
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                  navigate('/login');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 0.75rem',
                  fontSize: '0.875rem',
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
