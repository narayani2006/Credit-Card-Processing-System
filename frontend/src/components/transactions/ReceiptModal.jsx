import React from 'react';
import Modal from '../common/Modal';
import { Download, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

const ReceiptModal = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `================================================
PAYFLOW OFFICIAL PAYMENT RECEIPT
================================================
Transaction ID : ${transaction.transactionId}
Date           : ${new Date(transaction.createdAt).toLocaleString()}
Status         : ${transaction.status}
------------------------------------------------
Customer Name  : ${transaction.customerName}
Customer Email : ${transaction.customerEmail}
Payment Method : ${transaction.cardBrand} •••• ${transaction.last4}
Auth Code      : ${transaction.authCode || 'N/A'}
------------------------------------------------
Subtotal       : $${transaction.amount.toFixed(2)} USD
Total Paid     : $${transaction.amount.toFixed(2)} USD
================================================
Thank you for your business!
PCI-DSS Compliant Payment System
================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${transaction.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Payment Receipt — ${transaction.transactionId}`} maxWidth="480px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header Icon */}
        <div style={{ textAlign: 'center', padding: '1rem 0', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem'
            }}
          >
            <CheckCircle2 size={26} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>${transaction.amount.toFixed(2)} USD</div>
          <div style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>
            Payment Successful
          </div>
        </div>

        {/* Details Table */}
        <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Transaction ID</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{transaction.transactionId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Date & Time</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{new Date(transaction.createdAt).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Customer</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{transaction.customerName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Payment Method</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{transaction.cardBrand} •••• {transaction.last4}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Auth Code</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{transaction.authCode || 'AUTH-942810'}</span>
          </div>
        </div>

        {/* Security Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          <span>PCI-DSS Secured & Verified Transaction</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn-secondary">
            <Printer size={16} />
            Print Receipt
          </button>
          <button onClick={handleDownload} className="btn-primary">
            <Download size={16} />
            Download TXT
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
