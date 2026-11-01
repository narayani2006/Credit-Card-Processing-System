import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import axiosClient from '../api/axiosClient';
import { Users, UserX, UserCheck, Trash2, Shield, Calendar } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('[Admin fetch users error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userObj) => {
    try {
      setActionLoading(userObj._id);
      const res = await axiosClient.put(`/users/${userObj._id}/status`);
      if (res.data.success) {
        setToastMessage(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Error updating user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userObj) => {
    if (!window.confirm(`Are you sure you want to delete user account "${userObj.name}" (${userObj.email})?`)) {
      return;
    }

    try {
      setActionLoading(userObj._id);
      const res = await axiosClient.delete(`/users/${userObj._id}`);
      if (res.data.success) {
        setToastMessage(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Error deleting user account');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <main style={{ padding: '2rem', flex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                ADMINISTRATION / USER MANAGEMENT
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
                System Users & Roles
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                View, manage, and govern registered system user accounts and permissions.
              </p>
            </div>
          </div>

          {/* Table Container */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                <LoadingSpinner size={30} text="Fetching user accounts..." />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '0.875rem 1.25rem' }}>User Name</th>
                      <th style={{ padding: '0.875rem 1.25rem' }}>Email Address</th>
                      <th style={{ padding: '0.875rem 1.25rem' }}>Role</th>
                      <th style={{ padding: '0.875rem 1.25rem' }}>Status</th>
                      <th style={{ padding: '0.875rem 1.25rem' }}>Registered Date</th>
                      <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isSystemAdmin = u.role === 'admin' && u.email === (import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com');
                      return (
                        <tr
                          key={u._id}
                          style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>{u.name}</td>
                          <td style={{ padding: '1rem 1.25rem', color: '#4f46e5', fontWeight: 600 }}>{u.email}</td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <StatusBadge status={u.role} />
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <StatusBadge status={u.status} />
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8125rem' }}>
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            {isSystemAdmin ? (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>Protected System Admin</span>
                            ) : (
                              <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                <button
                                  onClick={() => handleToggleStatus(u)}
                                  disabled={actionLoading === u._id}
                                  className="btn-secondary"
                                  style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                                >
                                  {u.status === 'active' ? (
                                    <>
                                      <UserX size={14} color="#f59e0b" /> Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck size={14} color="#10b981" /> Activate
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  disabled={actionLoading === u._id}
                                  className="btn-secondary"
                                  style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem', color: '#ef4444' }}
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default AdminUsersPage;
