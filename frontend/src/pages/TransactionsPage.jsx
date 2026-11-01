import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import RefundModal from '../components/transactions/RefundModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import axiosClient from '../api/axiosClient';
import { Search, Download, Plus, Filter, RefreshCw, Eye, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState('All statuses');
  const [cardType, setCardType] = useState('All card types');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedTx, setSelectedTx] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [page, status, cardType]);

  const fetchTransactions = async (overrideParams = {}) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: overrideParams.search !== undefined ? overrideParams.search : search,
        status: overrideParams.status !== undefined ? overrideParams.status : status,
        cardType: overrideParams.cardType !== undefined ? overrideParams.cardType : cardType,
        startDate: overrideParams.startDate !== undefined ? overrideParams.startDate : startDate,
        endDate: overrideParams.endDate !== undefined ? overrideParams.endDate : endDate
      };

      const res = await axiosClient.get('/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.transactions);
        setTotal(res.data.total);
        setPages(res.data.pages);
      }
    } catch (err) {
      console.error('[Fetch transactions error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All statuses');
    setCardType('All card types');
    setStartDate('');
    setEndDate('');
    setPage(1);
    fetchTransactions({ search: '', status: 'All statuses', cardType: 'All card types', startDate: '', endDate: '' });
  };

  const handleExportCsv = async () => {
    try {
      const response = await axiosClient.get('/transactions/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payflow_transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToastMessage('Transactions exported to CSV successfully');
    } catch (err) {
      setToastMessage('Failed to export CSV');
    }
  };

  const handleRefundSuccess = (updatedTx, msg) => {
    setToastMessage(msg || 'Refund processed successfully');
    fetchTransactions();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <main style={{ padding: '2rem', flex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                PAYMENTS / TRANSACTIONS
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
                Transactions
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                Search, filter, and manage every card payment.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={handleExportCsv} className="btn-secondary">
                <Download size={16} />
                Export CSV
              </button>
              <button onClick={() => navigate('/new-payment')} className="btn-primary">
                <Plus size={16} />
                Create Payment
              </button>
            </div>
          </div>

          {/* Filter Bar Card */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <form onSubmit={handleApplyFilters} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label className="form-label">Search</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search by ID, customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input">
                  <option value="All statuses">All statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Declined">Declined</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="form-label">Card Type</label>
                <select value={cardType} onChange={(e) => setCardType(e.target.value)} className="form-input">
                  <option value="All card types">All card types</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">Amex</option>
                  <option value="Discover">Discover</option>
                </select>
              </div>

              <div>
                <label className="form-label">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  <Filter size={14} />
                  Apply
                </button>
                <button type="button" onClick={handleResetFilters} className="btn-secondary">
                  <RefreshCw size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Table Container */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                <LoadingSpinner size={30} text="Fetching transactions..." />
              </div>
            ) : transactions.length === 0 ? (
              <EmptyState
                title="No transactions found"
                description="Your transaction records are clean. Once payments are created, they will automatically appear here."
                showCreatePayment={true}
              />
            ) : (
              <div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '0.875rem 1.25rem' }}>Transaction ID</th>
                        <th style={{ padding: '0.875rem 1.25rem' }}>Customer</th>
                        <th style={{ padding: '0.875rem 1.25rem' }}>Amount</th>
                        <th style={{ padding: '0.875rem 1.25rem' }}>Card</th>
                        <th style={{ padding: '0.875rem 1.25rem' }}>Status</th>
                        <th style={{ padding: '0.875rem 1.25rem' }}>Date</th>
                        <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr
                          key={tx._id || tx.transactionId}
                          style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                            <button
                              onClick={() => navigate(`/transactions/${tx.transactionId}`)}
                              style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
                            >
                              {tx.transactionId}
                            </button>
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{tx.customerName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.customerEmail}</div>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>
                            ${tx.amount.toFixed(2)}
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: '#475569', fontWeight: 500 }}>
                            {tx.cardBrand} •••• {tx.last4}
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <StatusBadge status={tx.status} />
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8125rem' }}>
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => navigate(`/transactions/${tx.transactionId}`)}
                                className="btn-secondary"
                                style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                                title="View details"
                              >
                                <Eye size={14} /> View
                              </button>
                              {tx.status !== 'Refunded' && (
                                <button
                                  onClick={() => {
                                    setSelectedTx(tx);
                                    setShowRefundModal(true);
                                  }}
                                  className="btn-secondary"
                                  style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem', color: '#ef4444' }}
                                  title="Issue refund"
                                >
                                  <RotateCcw size={14} /> Refund
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#64748b' }}>
                  <div>
                    Showing <strong>{transactions.length}</strong> of <strong>{total}</strong> transactions
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-secondary"
                      style={{ padding: '0.375rem 0.75rem' }}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <span style={{ fontWeight: 600, color: '#0f172a', padding: '0 0.5rem' }}>
                      Page {page} of {pages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page >= pages}
                      className="btn-secondary"
                      style={{ padding: '0.375rem 0.75rem' }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        transaction={selectedTx}
        onSuccess={handleRefundSuccess}
      />

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default TransactionsPage;
