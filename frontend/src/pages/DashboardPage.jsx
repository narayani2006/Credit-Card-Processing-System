import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import RevenueChart from '../components/dashboard/RevenueChart';
import PaymentMethodsChart from '../components/dashboard/PaymentMethodsChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { DollarSign, CheckCircle2, AlertCircle, RefreshCw, Plus, Calendar, ArrowRight, X } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVolume: 0,
    successfulPayments: 0,
    failedPayments: 0,
    totalRefunds: 0
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showToastBanner, setShowToastBanner] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setPaymentMethods(res.data.paymentMethods || []);
        setRecentTransactions(res.data.recentTransactions || []);
      }
    } catch (err) {
      console.error('[Dashboard fetch error]', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <main style={{ padding: '2rem', flex: 1 }}>
          {/* Header Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
                {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                Here's how your payment system is performing this period.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.875rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#475569'
                }}
              >
                <Calendar size={16} color="#64748b" />
                <span>Current Month</span>
              </div>

              <button onClick={() => navigate('/new-payment')} className="btn-primary">
                <Plus size={16} />
                Create Payment
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
              <LoadingSpinner size={32} text="Loading dashboard stats..." />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <StatCard
                  title="Total Volume"
                  value={`$${stats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  icon={DollarSign}
                  trend="+0.0%"
                  iconBg="#eeeffe"
                  iconColor="#4f46e5"
                />
                <StatCard
                  title="Successful Payments"
                  value={stats.successfulPayments.toLocaleString()}
                  icon={CheckCircle2}
                  trend="+0.0%"
                  iconBg="#ecfdf5"
                  iconColor="#10b981"
                />
                <StatCard
                  title="Failed Payments"
                  value={stats.failedPayments.toLocaleString()}
                  icon={AlertCircle}
                  trend="0.0%"
                  iconBg="#fef2f2"
                  iconColor="#ef4444"
                />
                <StatCard
                  title="Refunds"
                  value={`$${stats.totalRefunds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  icon={RefreshCw}
                  trend="0.0%"
                  iconBg="#e0e7ff"
                  iconColor="#4338ca"
                />
              </div>

              {/* Charts Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', minHeight: '340px' }}>
                <RevenueChart transactions={recentTransactions} />
                <PaymentMethodsChart paymentMethods={paymentMethods} />
              </div>

              {/* Recent Transactions Card */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Recent transactions</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Your latest payment activity</p>
                  </div>

                  {recentTransactions.length > 0 && (
                    <Link
                      to="/transactions"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: '#4f46e5',
                        textDecoration: 'none'
                      }}
                    >
                      View all transactions <ArrowRight size={14} />
                    </Link>
                  )}
                </div>

                {recentTransactions.length === 0 ? (
                  <EmptyState
                    title="No transactions yet."
                    description="Your dashboard starts completely clean. Create your first payment to process transactions and see live statistics."
                    showCreatePayment={true}
                  />
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '0.75rem 1rem' }}>Transaction ID</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Card</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((tx) => (
                          <tr
                            key={tx._id || tx.transactionId}
                            onClick={() => navigate(`/transactions/${tx.transactionId}`)}
                            style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <td style={{ padding: '1rem', fontWeight: 700, color: '#4f46e5' }}>{tx.transactionId}</td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: 600, color: '#0f172a' }}>{tx.customerName}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.customerEmail}</div>
                            </td>
                            <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                              ${tx.amount.toFixed(2)}
                            </td>
                            <td style={{ padding: '1rem', color: '#475569', fontWeight: 500 }}>
                              {tx.cardBrand} •••• {tx.last4}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <StatusBadge status={tx.status} />
                            </td>
                            <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.8125rem' }}>
                              {new Date(tx.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Updated Toast Banner at Bottom */}
        {showToastBanner && (
          <div
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              left: 'calc(260px + 2rem)',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '0.8125rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
              zIndex: 30
            }}
          >
            <span>Dashboard data synchronized with MongoDB.</span>
            <button
              onClick={() => setShowToastBanner(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
