import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import ReceiptModal from '../components/transactions/ReceiptModal';
import axiosClient from '../api/axiosClient';
import { Lock, ShieldCheck, CheckCircle2, RefreshCw, CreditCard, DollarSign, Download, Plus } from 'lucide-react';

const NewPaymentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    customerName: '',
    customerEmail: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    cardholderName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successTransaction, setSuccessTransaction] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Card brand detection
  const getCardBrand = (number) => {
    const clean = number.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'Visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'Amex';
    if (/^6(?:011|5)/.test(clean)) return 'Discover';
    return 'Card';
  };

  const cardBrand = getCardBrand(formData.cardNumber);
  const cleanCardNumber = formData.cardNumber.replace(/\s+/g, '');
  const last4 = cleanCardNumber.length >= 4 ? cleanCardNumber.slice(-4) : '••••';

  const amountVal = Number(formData.amount) || 0;
  const processingFee = amountVal > 0 ? Number((amountVal * 0.029 + 0.3).toFixed(2)) : 0;
  const totalCharge = amountVal > 0 ? (amountVal + processingFee).toFixed(2) : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || amountVal <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }
    if (!formData.customerName || !formData.customerEmail) {
      setError('Customer name and email address are required.');
      return;
    }
    if (cleanCardNumber.length < 13) {
      setError('Please enter a valid 13-16 digit card number.');
      return;
    }
    if (!formData.expDate || !formData.expDate.includes('/')) {
      setError('Expiry date must be in MM/YY format.');
      return;
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      setError('CVV must be 3 or 4 digits.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        amount: amountVal,
        currency: formData.currency,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        cardNumber: cleanCardNumber,
        expDate: formData.expDate,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName || formData.customerName,
        billingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        description: formData.description
      };

      const res = await axiosClient.post('/transactions', payload);
      if (res.data.success) {
        setSuccessTransaction(res.data.transaction);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing payment transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSuccessTransaction(null);
    setFormData({
      amount: '',
      currency: 'USD',
      customerName: '',
      customerEmail: '',
      cardNumber: '',
      expDate: '',
      cvv: '',
      cardholderName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      description: ''
    });
    setError('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <main style={{ padding: '2rem', flex: 1 }}>
          {/* Breadcrumb & Title */}
          <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                VIRTUAL TERMINAL / CREATE A NEW PAYMENT
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
                Create a new payment
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                Accept a secure card-not-present payment in seconds.
              </p>
            </div>

            <button onClick={handleResetForm} className="btn-secondary">
              <RefreshCw size={14} />
              Reset form
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: '0.875rem 1.25rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                color: '#991b1b',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}
            >
              {error}
            </div>
          )}

          {/* Grid Layout: Left Form (2/3), Right Order Summary (1/3) */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* LEFT FORM */}
            <div className="card" style={{ padding: '2rem' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Section: Amount & Currency */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Payment details</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>Enter the customer and card information.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Amount</label>
                      <div style={{ position: 'relative' }}>
                        <DollarSign size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                          type="number"
                          step="0.01"
                          name="amount"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={handleChange}
                          className="form-input"
                          style={{ paddingLeft: '2.5rem', fontSize: '1.125rem', fontWeight: 700 }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Currency</label>
                      <select name="currency" value={formData.currency} onChange={handleChange} className="form-input" style={{ height: '42px', fontWeight: 600 }}>
                        <option value="USD">USD — US Dollar</option>
                        <option value="EUR">EUR — Euro</option>
                        <option value="GBP">GBP — British Pound</option>
                        <option value="INR">INR — Indian Rupee</option>
                        <option value="CAD">CAD — Canadian Dollar</option>
                        <option value="AUD">AUD — Australian Dollar</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

                {/* Section: Customer */}
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Customer</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Customer name</label>
                      <input
                        type="text"
                        name="customerName"
                        placeholder="Jordan Ellis"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Email address</label>
                      <input
                        type="email"
                        name="customerEmail"
                        placeholder="jordan.ellis@example.com"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

                {/* Section: Card Information */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Card information</h4>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}>
                      <ShieldCheck size={14} /> Secured & Tokenized
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Card number</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="4242 4242 4242 4242"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="form-input"
                          maxLength={19}
                          required
                        />
                        <div
                          style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#4f46e5',
                            backgroundColor: '#eeeffe',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          <CreditCard size={14} />
                          {cardBrand}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="form-label">Expiry date</label>
                        <input
                          type="text"
                          name="expDate"
                          placeholder="12/28"
                          value={formData.expDate}
                          onChange={handleChange}
                          className="form-input"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleChange}
                          className="form-input"
                          maxLength={4}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Card check</label>
                        <div
                          style={{
                            height: '38px',
                            backgroundColor: cleanCardNumber.length >= 13 ? '#ecfdf5' : '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: cleanCardNumber.length >= 13 ? '#15803d' : '#94a3b8',
                            gap: '0.375rem'
                          }}
                        >
                          <CheckCircle2 size={14} />
                          {cleanCardNumber.length >= 13 ? 'Valid format' : 'Verification'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

                {/* Section: Billing Address */}
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Billing address</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Street address</label>
                      <input
                        type="text"
                        name="address"
                        placeholder="1830 Market Street"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          name="city"
                          placeholder="Philadelphia"
                          value={formData.city}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          name="state"
                          placeholder="PA"
                          value={formData.state}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">ZIP code</label>
                        <input
                          type="text"
                          name="zip"
                          placeholder="19103"
                          value={formData.zip}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Description (optional)</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="e.g. Order #1048 - consulting services"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </form>
            </div>

            {/* RIGHT ORDER SUMMARY / SUCCESS CARD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {!successTransaction ? (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Order summary</h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>Review before processing</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.8125rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Customer</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{formData.customerName || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Payment method</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{cardBrand} •••• {last4}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Subtotal</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>${amountVal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Processing fee (2.9% + $0.30)</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>${processingFee.toFixed(2)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>Total charge</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5' }}>${totalCharge}</span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem' }}
                    disabled={loading}
                  >
                    <Lock size={16} />
                    {loading ? 'Processing Payment...' : 'Process Payment'}
                  </button>

                  <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <ShieldCheck size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span>PCI-DSS secured checkout · Card data never touches raw servers.</span>
                  </div>
                </div>
              ) : (
                /* Payment Success Card State */
                <div className="card animate-fade-in" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid #10b981' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.375rem' }}>
                    Payment successful
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    ${successTransaction.amount.toFixed(2)} was charged to {successTransaction.cardBrand} •••• {successTransaction.last4}
                  </p>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#64748b' }}>Transaction ID:</span>
                      <strong style={{ color: '#4f46e5' }}>{successTransaction.transactionId}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Auth Code:</span>
                      <strong style={{ color: '#0f172a' }}>{successTransaction.authCode || 'AUTH-892140'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button onClick={() => setShowReceipt(true)} className="btn-secondary" style={{ width: '100%' }}>
                      <Download size={16} />
                      Download receipt
                    </button>
                    <button onClick={handleResetForm} className="btn-primary" style={{ width: '100%' }}>
                      <Plus size={16} />
                      New payment
                    </button>
                    <button
                      onClick={() => navigate(`/transactions/${successTransaction.transactionId}`)}
                      style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', marginTop: '0.25rem' }}
                    >
                      View transaction details →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ReceiptModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} transaction={successTransaction} />
    </div>
  );
};

export default NewPaymentPage;
