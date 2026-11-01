import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import Toast from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { Shield, Key, Users, User, CreditCard, Save, Smartphone, AlertTriangle, CheckCircle2, Copy } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateUserSettings } = useAuth();
  const [activeTab, setActiveTab] = useState('security');

  // Security Toggles State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.settings?.twoFactorEnabled || false);
  const [loginAlerts, setLoginAlerts] = useState(user?.settings?.loginAlerts ?? true);
  const [emailNotifications, setEmailNotifications] = useState(user?.settings?.emailNotifications ?? true);

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Live Secret Key', key: 'pk_live_94819401849182049184', maskedKey: 'pk_live_••••••••49184', created: 'Oct 1, 2026' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await axiosClient.put('/auth/security-settings', {
        twoFactorEnabled,
        loginAlerts,
        emailNotifications
      });

      if (res.data.success) {
        updateUserSettings(res.data.settings);
        setToastMessage('Security settings saved successfully!');
      }
    } catch (err) {
      setToastMessage('Error saving security settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) return;
    const rand = Math.random().toString(36).substring(2, 10);
    const newKey = {
      id: Date.now(),
      name: newKeyName.trim(),
      key: `sk_live_${rand}${Date.now()}`,
      maskedKey: `sk_live_••••${rand.slice(-4)}`,
      created: 'Just now'
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    setToastMessage(`API Key "${newKey.name}" generated.`);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'apikeys', name: 'API Keys', icon: Key },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <main style={{ padding: '2rem', flex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              SETTINGS & SECURITY
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
              Account Settings
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              Manage your profile preferences, team access, API keys, and security settings.
            </p>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="card" style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#4f46e5' : 'transparent',
                    color: isActive ? '#ffffff' : '#64748b',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SECURITY */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Security Preferences</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  Configure your multi-factor preferences, session timeouts, and security alert triggers.
                </p>

                <form onSubmit={handleSaveSecurity} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Toggle 1: Two-factor authentication */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>Two-factor authentication (2FA)</div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                        Store security preference token (Does not block standard email/password login flow).
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '46px', height: '24px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={twoFactorEnabled}
                        onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: twoFactorEnabled ? '#4f46e5' : '#cbd5e1',
                          borderRadius: '9999px',
                          transition: '0.2s'
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          left: twoFactorEnabled ? '24px' : '4px',
                          bottom: '4px',
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          transition: '0.2s'
                        }}
                      />
                    </label>
                  </div>

                  {/* Toggle 2: Login Alerts */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>Login & Device Security Alerts</div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                        Receive instant notifications when new devices sign in to your merchant account.
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '46px', height: '24px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={loginAlerts}
                        onChange={(e) => setLoginAlerts(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: loginAlerts ? '#4f46e5' : '#cbd5e1',
                          borderRadius: '9999px',
                          transition: '0.2s'
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          left: loginAlerts ? '24px' : '4px',
                          bottom: '4px',
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          transition: '0.2s'
                        }}
                      />
                    </label>
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn-primary" disabled={saving}>
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Security Settings'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Sessions Card */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>Active Sessions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <Smartphone size={20} color="#4f46e5" />
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Chrome / Windows 11 (Current Session)</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>127.0.0.1 · Active now</div>
                      </div>
                    </div>
                    <span className="badge badge-approved">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>Personal Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', maxWidth: '600px' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input type="text" value={user?.name || ''} readOnly className="form-input" style={{ backgroundColor: '#f8fafc' }} />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" value={user?.email || ''} readOnly className="form-input" style={{ backgroundColor: '#f8fafc' }} />
                </div>
                <div>
                  <label className="form-label">Account Role</label>
                  <input type="text" value={user?.role?.toUpperCase() || 'USER'} readOnly className="form-input" style={{ backgroundColor: '#f8fafc', fontWeight: 700 }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: API KEYS */}
          {activeTab === 'apikeys' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>API Keys</h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Manage live API keys for integrating PayFlow processing into external platforms.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', maxWidth: '500px' }}>
                <input
                  type="text"
                  placeholder="Key name (e.g. Production Webhook)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="form-input"
                />
                <button onClick={handleCreateApiKey} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  Generate Key
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem' }}>Key Name</th>
                      <th style={{ padding: '0.75rem' }}>Token</th>
                      <th style={{ padding: '0.75rem' }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((k) => (
                      <tr key={k.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{k.name}</td>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#4f46e5' }}>{k.maskedKey}</td>
                        <td style={{ padding: '0.75rem', color: '#64748b' }}>{k.created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4 & 5 Placeholders */}
          {(activeTab === 'team' || activeTab === 'billing') && (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                {activeTab === 'team' ? 'Team Access' : 'Billing & Invoices'}
              </h3>
              <p style={{ color: '#64748b' }}>
                {activeTab === 'team'
                  ? 'Manage team member access privileges and roles.'
                  : 'View merchant payout history and billing subscriptions.'}
              </p>
            </div>
          )}
        </main>
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default SettingsPage;
