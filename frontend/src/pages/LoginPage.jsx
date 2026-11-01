import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    rememberMe: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone
      });

      setSuccessMsg(res.message || 'Account created successfully! You can now log in.');
      setIsSignUp(false); // Switch to login tab
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* LEFT COLUMN: Dark Navy Branding & Graphics (Matching Figma) */}
      <div
        style={{
          flex: '1 1 50%',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '3.5rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Branding */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3.5rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '0.625rem',
                backgroundColor: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.5)'
              }}
            >
              <CreditCard size={22} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.025em' }}>PayFlow</span>
          </div>

          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#818cf8',
              textTransform: 'uppercase',
              marginBottom: '0.875rem'
            }}
          >
            PAYMENTS, SIMPLIFIED
          </div>

          <h1
            style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              lineHeight: '1.15',
              letterSpacing: '-0.035em',
              marginBottom: '1.25rem',
              maxWidth: '480px'
            }}
          >
            Move money with confidence.
          </h1>

          <p style={{ fontSize: '1.0625rem', color: '#94a3b8', lineHeight: '1.6', maxWidth: '440px', marginBottom: '2.5rem' }}>
            Accept cards, track every transaction, and protect customer data from one calm, secure workspace.
          </p>

          {/* Sleek Visual Card Graphic */}
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '210px',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#818cf8', letterSpacing: '0.05em' }}>PAYFLOW CARD</div>
              <ShieldCheck size={24} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.25em', color: '#f8fafc' }}>
              •••• •••• •••• 4242
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
              <div>
                <div style={{ fontSize: '0.625rem', uppercase: true, color: '#64748b' }}>CARDHOLDER</div>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>ACME GOODS CO.</div>
              </div>
              <div>
                <div style={{ fontSize: '0.625rem', uppercase: true, color: '#64748b' }}>EXPIRES</div>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>12/28</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security badges at bottom left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={18} color="#10b981" />
            <span style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>
              <strong>PCI-DSS compliant</strong> — Built to meet rigorous cardholder data security standards.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Lock size={18} color="#818cf8" />
            <span style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>
              <strong>Encrypted end-to-end</strong> — TLS in transit and AES-256 encryption at rest.
            </span>
          </div>
          <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            © 2026 PayFlow, Inc. Privacy · Terms · Security
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: White Form Area (Matching Figma) */}
      <div
        style={{
          flex: '1 1 50%',
          backgroundColor: '#ffffff',
          padding: '3.5rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>
              {isSignUp ? 'Sign up to start accepting card payments.' : 'Sign in to manage payments for your business.'}
            </p>
          </div>

          {/* Toggle Switcher (Log in / Sign up) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.625rem',
              padding: '4px',
              marginBottom: '1.75rem'
            }}
          >
            <button
              onClick={() => {
                setIsSignUp(false);
                setError('');
                setSuccessMsg('');
              }}
              style={{
                padding: '0.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: !isSignUp ? '#ffffff' : 'transparent',
                color: !isSignUp ? '#0f172a' : '#64748b',
                boxShadow: !isSignUp ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Log in
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setError('');
                setSuccessMsg('');
              }}
              style={{
                padding: '0.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: isSignUp ? '#ffffff' : 'transparent',
                color: isSignUp ? '#0f172a' : '#64748b',
                boxShadow: isSignUp ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Sign up
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.875rem 1rem',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '0.5rem',
                color: '#065f46',
                fontSize: '0.875rem',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.875rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                color: '#991b1b',
                fontSize: '0.875rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {!isSignUp ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Work email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="alex@acmegoods.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    style={{ accentColor: '#4f46e5' }}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset instructions will be sent to your email if registered.'); }} style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
                {loading ? 'Logging in to PayFlow...' : 'Log in to PayFlow'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              </div>

              <button
                type="button"
                onClick={() => alert('Google Sign-In is visual in this environment.')}
                className="btn-secondary"
                style={{ width: '100%', padding: '0.625rem' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '0.5rem' }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Note: All registered user accounts receive standard <strong style={{ color: '#0f172a' }}>role = "user"</strong>.
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
            Need help? <a href="#support" onClick={(e) => { e.preventDefault(); alert('Contact support at support@payflow.com'); }} style={{ color: '#4f46e5', fontWeight: 600 }}>Contact support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
