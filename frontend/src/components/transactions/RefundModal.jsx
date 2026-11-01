import React, { useState } from 'react';
import Modal from '../common/Modal';
import { AlertTriangle, DollarSign } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const RefundModal = ({ isOpen, onClose, transaction, onSuccess }) => {
  const [refundType, setRefundType] = useState('full');
  const [customAmount, setCustomAmount] = useState('');
  const [reason, setReason] = useState('Requested by customer');
  const [emailReceipt, setEmailReceipt] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!transaction) return null;

  const refundAmountValue = refundType === 'full' ? transaction.amount : Number(customAmount) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (refundType === 'partial' && (!customAmount || Number(customAmount) <= 0 || Number(customAmount) > transaction.amount)) {
      setError(`Please enter a valid partial refund amount between $0.01 and $${transaction.amount}`);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post(`/transactions/${transaction._id || transaction.transactionId}/refund`, {
        refundType,
        refundAmount: refundAmountValue,
        reason,
        emailReceipt
      });

      if (res.data.success) {
        onSuccess(res.data.transaction, res.data.message);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Issue refund — ${transaction.transactionId}`} maxWidth="520px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '0.8125rem'
            }}
          >
            {error}
          </div>
        )}

        {/* Refund Type Radio Selection */}
        <div>
          <label className="form-label">Refund Option</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
            <label
              style={{
                border: `2px solid ${refundType === 'full' ? '#4f46e5' : '#e2e8f0'}`,
                backgroundColor: refundType === 'full' ? '#eeeffe' : '#ffffff',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem'
              }}
            >
              <input
                type="radio"
                name="refundType"
                value="full"
                checked={refundType === 'full'}
                onChange={() => setRefundType('full')}
                style={{ accentColor: '#4f46e5' }}
              />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Full refund</div>
                <div style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600 }}>${transaction.amount.toFixed(2)}</div>
              </div>
            </label>

            <label
              style={{
                border: `2px solid ${refundType === 'partial' ? '#4f46e5' : '#e2e8f0'}`,
                backgroundColor: refundType === 'partial' ? '#eeeffe' : '#ffffff',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem'
              }}
            >
              <input
                type="radio"
                name="refundType"
                value="partial"
                checked={refundType === 'partial'}
                onChange={() => setRefundType('partial')}
                style={{ accentColor: '#4f46e5' }}
              />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Partial refund</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Custom amount</div>
              </div>
            </label>
          </div>
        </div>

        {/* Custom Amount Input if Partial */}
        {refundType === 'partial' && (
          <div>
            <label className="form-label">Partial Amount ($)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="number"
                step="0.01"
                max={transaction.amount}
                placeholder={`Max $${transaction.amount}`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                required
              />
            </div>
          </div>
        )}

        {/* Reason Select */}
        <div>
          <label className="form-label">Refund Reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="form-input">
            <option value="Requested by customer">Requested by customer</option>
            <option value="Duplicate transaction">Duplicate transaction</option>
            <option value="Fraudulent activity">Fraudulent activity</option>
            <option value="Order cancelled / Return">Order cancelled / Return</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: '#334155', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={emailReceipt}
            onChange={(e) => setEmailReceipt(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}
          />
          <span>Email refund receipt to {transaction.customerEmail}</span>
        </label>

        {/* Warning Alert Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            backgroundColor: '#fffbe6',
            border: '1px solid #ffe58f',
            borderRadius: '0.5rem',
            color: '#b45309',
            fontSize: '0.8125rem'
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>Refunds can take 5-10 business days to clear and cannot be undone once confirmed.</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-danger" disabled={loading}>
            {loading ? 'Processing Refund...' : `Refund $${refundAmountValue.toFixed(2)}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RefundModal;
