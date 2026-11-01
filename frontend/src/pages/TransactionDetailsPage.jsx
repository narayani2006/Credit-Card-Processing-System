import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import StatusBadge from '../components/common/StatusBadge';
import RefundModal from '../components/transactions/RefundModal';
import ReceiptModal from '../components/transactions/ReceiptModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import axiosClient from '../api/axiosClient';
import { ArrowLeft, Download, RotateCcw, ShieldCheck, CheckCircle2, Clock, AlertOctagon, User, CreditCard as CardIcon, Activity } from 'lucide-react';

const TransactionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/transactions/${id}`);
      if (res.data.success) {
        setTransaction(res.data.transaction);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction not found');
    } finally {
      setLoading(false);
    }
  };

  const handleRefundSuccess = (updatedTx, msg) => {
    setTransaction(updatedTx);
    setToastMessage(msg || 'Refund processed successfully');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <main style={{ padding: '2rem', flex: 1 }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/transactions')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              marginBottom: '1.25rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Transactions
          </button>

          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
              <LoadingSpinner size={32} text="Loading transaction details..." />
            </div>
          ) : error || !transaction ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Transaction Not Found</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error || 'The requested transaction ID does not exist in the database.'}</p>
              <button onClick={() => navigate('/transactions')} className="btn-primary">
                Return to Transactions
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header Title Bar */}
              <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.375rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
                      {transaction.transactionId}
                    </h1>
                    <StatusBadge status={transaction.status} />
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    Created {new Date(transaction.createdAt).toLocaleString()} · Virtual Terminal
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right', paddingRight: '1rem', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', uppercase: true, fontWeight: 700 }}>TOTAL AMOUNT</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                      ${transaction.amount.toFixed(2)} {transaction.currency}
                    </div>
                  </div>

                  <button onClick={() => setShowReceiptModal(true)} className="btn-secondary">
                    <Download size={16} /> Receipt
                  </button>

                  {transaction.status !== 'Refunded' && (
                    <button onClick={() => setShowRefundModal(true)} className="btn-danger">
                      <RotateCcw size={16} /> Issue Refund
                    </button>
                  )}
                </div>
              </div>

              {/* Grid Content */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                {/* Left Column: Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Customer Information Card */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                      <User size={18} color="#4f46e5" />
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Customer information</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.875rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Name</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>{transaction.customerName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Email</div>
                        <div style={{ fontWeight: 600, color: '#4f46e5', marginTop: '0.25rem' }}>{transaction.customerEmail}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Customer ID</div>
                        <div style={{ fontWeight: 600, color: '#475569', marginTop: '0.25rem' }}>CUS-{transaction._id?.substring(0, 8)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Billing address</div>
                        <div style={{ fontWeight: 500, color: '#334155', marginTop: '0.25rem' }}>
                          {transaction.billingAddress?.address ? (
                            `${transaction.billingAddress.address}, ${transaction.billingAddress.city}, ${transaction.billingAddress.state} ${transaction.billingAddress.zip}`
                          ) : (
                            'No billing address recorded'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Information Card */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                      <CardIcon size={18} color="#4f46e5" />
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Card information</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.875rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Card number</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
                          {transaction.cardBrand} •••• •••• •••• {transaction.last4}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Expiry</div>
                        <div style={{ fontWeight: 600, color: '#334155', marginTop: '0.25rem' }}>
                          {transaction.expMonth}/{transaction.expYear}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Cardholder name</div>
                        <div style={{ fontWeight: 600, color: '#334155', marginTop: '0.25rem' }}>
                          {transaction.cardholderName || transaction.customerName}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Authorization code</div>
                        <div style={{ fontWeight: 600, color: '#10b981', marginTop: '0.25rem' }}>
                          {transaction.authCode || 'AUTH-948201'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Timeline */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                      <Clock size={18} color="#4f46e5" />
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Payment timeline</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {transaction.timeline && transaction.timeline.length > 0 ? (
                        transaction.timeline.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#dcfce7',
                                color: '#16a34a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              <CheckCircle2 size={16} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{step.stage}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                {new Date(step.timestamp).toLocaleString()} — {step.detail}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Authorized, Captured, and Settled successfully.</div>
                      )}
                    </div>
                  </div>

                  {/* Fraud Risk Card */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <ShieldCheck size={18} color="#10b981" />
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Fraud risk</h3>
                      </div>
                      <span className="badge badge-approved">
                        {transaction.fraudRisk?.level || 'LOW RISK'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
                        {transaction.fraudRisk?.score || 12} <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500 }}>/ 100</span>
                      </div>
                      <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${transaction.fraudRisk?.score || 12}%`, height: '100%', backgroundColor: '#10b981' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', color: '#475569' }}>
                      {transaction.fraudRisk?.signals?.map((sig, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={14} color="#10b981" />
                          <span>{sig}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Activity Log */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                    <Activity size={18} color="#4f46e5" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Activity log</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transaction.activityLog && transaction.activityLog.length > 0 ? (
                      transaction.activityLog.map((act, idx) => (
                        <div key={idx} style={{ paddingBottom: '0.875rem', borderBottom: idx < transaction.activityLog.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>{act.action}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.125rem' }}>
                            By {act.performedBy} on {new Date(act.timestamp).toLocaleString()}
                          </div>
                          {act.details && (
                            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.25rem', backgroundColor: '#f8fafc', padding: '0.375rem 0.5rem', borderRadius: '4px' }}>
                              {act.details}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>No activity logged yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        transaction={transaction}
        onSuccess={handleRefundSuccess}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        transaction={transaction}
      />

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default TransactionDetailsPage;
