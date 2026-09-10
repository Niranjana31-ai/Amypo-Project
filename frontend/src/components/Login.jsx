import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

/* ── Inline styles scoped to login page ── */
const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background:
      'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(91,92,226,0.18) 0%, transparent 55%),' +
      'radial-gradient(ellipse 60% 50% at 80% 70%, rgba(108,124,255,0.12) 0%, transparent 55%),' +
      '#0B1026',
    fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
    overflow: 'hidden',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '56px 64px',
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute', width: 420, height: 420, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(91,92,226,0.22) 0%, transparent 70%)',
    top: -80, left: -100, pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', width: 320, height: 320, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,124,255,0.16) 0%, transparent 70%)',
    bottom: 40, right: 60, pointerEvents: 'none',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 52 },
  brandName: {
    fontSize: 22, fontWeight: 800,
    background: 'linear-gradient(135deg,#ffffff 0%,#cbd5e1 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  headline: {
    fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#ffffff',
    lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 4,
  },
  headlineAccent: {
    background: 'linear-gradient(90deg, #6C7CFF, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block',
  },
  subtext: {
    fontSize: 15, color: '#AAB3D0', marginTop: 16, marginBottom: 44,
    maxWidth: 340, lineHeight: 1.7,
  },
  features: {
    display: 'grid', gridTemplateColumns: 'repeat(4, auto)',
    gap: '24px 28px', marginBottom: 44,
  },
  featureItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' },
  featureIcon: {
    width: 44, height: 44, borderRadius: 12,
    background: 'rgba(91,92,226,0.14)', border: '1px solid rgba(108,124,255,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#8c97ff', boxShadow: '0 0 14px rgba(91,92,226,0.18)',
  },
  featureLabel: { fontSize: 11, color: '#AAB3D0', fontWeight: 600, lineHeight: 1.3, maxWidth: 72 },
  diagram: { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 },
  diagramRow: { display: 'flex', gap: 10, justifyContent: 'center' },
  diagramNode: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px',
    borderRadius: 20, background: 'rgba(21,29,59,0.85)',
    border: '1px solid rgba(108,124,255,0.2)', backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)', color: '#ffffff',
    fontSize: 13, fontWeight: 600, minWidth: 140,
  },
  diagramNodeSub: { fontSize: 10, color: '#6B789E', fontWeight: 400 },
  footerPills: { display: 'flex', gap: 20, marginTop: 40, alignItems: 'center' },
  footerPill: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#AAB3D0', fontWeight: 500 },
  pillDot: { width: 3, height: 3, borderRadius: '50%', background: '#4B5563' },
  right: {
    width: 460, flexShrink: 0, display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '40px 48px 40px 32px',
  },
  card: {
    width: '100%', maxWidth: 400,
    background: 'rgba(15,20,50,0.82)',
    border: '1px solid rgba(108,124,255,0.22)', borderRadius: 24,
    padding: '36px 36px 32px', backdropFilter: 'blur(24px)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(108,124,255,0.08), 0 0 40px rgba(91,92,226,0.12)',
  },
  cardBrand: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 24 },
  cardBrandName: {
    fontSize: 17, fontWeight: 800,
    background: 'linear-gradient(135deg,#ffffff 0%,#cbd5e1 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em',
  },
  cardTitle: { fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 },
  cardSub: { fontSize: 13.5, color: '#AAB3D0', marginBottom: 26, lineHeight: 1.5 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#AAB3D0', marginBottom: 7 },
  inputWrap: { position: 'relative', marginBottom: 18 },
  inputIcon: {
    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
    color: '#6B789E', display: 'flex', alignItems: 'center', pointerEvents: 'none',
  },
  input: {
    width: '100%', padding: '12px 44px 12px 42px',
    background: 'rgba(11,16,38,0.8)', border: '1px solid rgba(108,124,255,0.2)',
    borderRadius: 12, color: '#ffffff', fontSize: 14,
    fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  eyeBtn: {
    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#6B789E',
    display: 'flex', alignItems: 'center', padding: 0,
  },
  rowLine: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  rememberLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#AAB3D0', cursor: 'pointer', userSelect: 'none' },
  checkbox: { width: 17, height: 17, borderRadius: 5, accentColor: '#5B5CE2', cursor: 'pointer' },
  forgotLink: { fontSize: 13.5, color: '#8c97ff', fontWeight: 500, textDecoration: 'none' },
  signInBtn: {
    width: '100%', padding: '13px 24px',
    background: 'linear-gradient(135deg, #5B5CE2 0%, #6C7CFF 100%)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 50,
    color: '#ffffff', fontSize: 15, fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, boxShadow: '0 6px 24px rgba(91,92,226,0.45)',
    transition: 'all 0.2s', letterSpacing: '0.01em',
  },
  dividerRow: { display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 18px' },
  dividerLine: { flex: 1, height: 1, background: 'rgba(108,124,255,0.15)' },
  dividerText: { fontSize: 11.5, color: '#6B789E', whiteSpace: 'nowrap', fontWeight: 500 },
  registerRow: { textAlign: 'center', fontSize: 13.5, color: '#AAB3D0' },
  registerLink: { color: '#8c97ff', fontWeight: 600, textDecoration: 'none', marginLeft: 4 },
  errorBox: {
    color: '#fca5a5', background: 'rgba(239,68,68,0.13)',
    border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10,
    padding: '10px 14px', marginBottom: 16, fontSize: 13, backdropFilter: 'blur(8px)',
  },
};

/* ── Logo — same as dashboard sidebar ── */
const Logo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="none">
    <defs>
      <linearGradient id="lgLogin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5B5CE2" />
        <stop offset="100%" stopColor="#6C7CFF" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="9" height="9" rx="2.5" fill="url(#lgLogin)" />
    <rect x="13" y="2" width="9" height="9" rx="2.5" fill="url(#lgLogin)" />
    <rect x="2" y="13" width="9" height="9" rx="2.5" fill="url(#lgLogin)" />
    <rect x="13" y="13" width="9" height="9" rx="2.5" fill="url(#lgLogin)" opacity="0.45" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const FEATURES = [
  {
    label: 'Project\nManagement',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  },
  {
    label: 'Team\nCollaboration',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  },
  {
    label: 'Task & Progress\nTracking',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
  },
  {
    label: 'Real-time\nVisibility',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  },
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [inputFocus, setInputFocus] = useState({});

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  useEffect(() => { setLocalError(error); }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ username: formData.username, password: formData.password }));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  const focusStyle = (name) => inputFocus[name] ? {
    borderColor: '#6C7CFF',
    boxShadow: '0 0 0 3px rgba(91,92,226,0.25), 0 0 16px rgba(108,124,255,0.18)',
    background: 'rgba(11,16,38,0.97)',
  } : {};

  return (
    <div style={S.page}>
      <style>{`
        @media (max-width: 860px) {
          .login-left { display: none !important; }
          .login-right { width: 100% !important; padding: 32px 20px !important; }
        }
      `}</style>

      {/* ── LEFT MARKETING PANEL ── */}
      <div className="login-left" style={S.left}>
        <div style={S.orb1} />
        <div style={S.orb2} />

        <div style={S.brand}>
          <Logo size={26} />
          <span style={S.brandName}>SyncUp</span>
        </div>

        <h1 style={S.headline}>
          One team. One workspace.
          <span style={S.headlineAccent}>One direction.</span>
        </h1>
        <p style={S.subtext}>
          Connect projects, tasks, teams and progress<br />
          in one intelligent workspace.
        </p>

        {/* Feature grid */}
        <div style={S.features}>
          {FEATURES.map((f) => (
            <div key={f.label} style={S.featureItem}>
              <div style={S.featureIcon}>{f.icon}</div>
              <span style={{ ...S.featureLabel, whiteSpace: 'pre-line' }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Workflow diagram */}
        <div style={S.diagram}>
          <div style={S.diagramRow}>
            <div style={{ ...S.diagramNode, borderColor: 'rgba(108,124,255,0.4)', boxShadow: '0 0 20px rgba(108,124,255,0.15)' }}>
              <span>📁</span>
              <div>
                <div>Projects</div>
                <div style={S.diagramNodeSub}>Plan • Organize • Build</div>
              </div>
            </div>
          </div>
          <div style={S.diagramRow}>
            <div style={{ ...S.diagramNode, borderColor: 'rgba(167,139,250,0.4)', boxShadow: '0 0 20px rgba(167,139,250,0.15)' }}>
              <span>✅</span>
              <div>
                <div>Tasks</div>
                <div style={S.diagramNodeSub}>Track • Manage • Complete</div>
              </div>
            </div>
          </div>
          <div style={{ ...S.diagramRow }}>
            <div style={{ ...S.diagramNode, flex: 1, borderColor: 'rgba(108,124,255,0.28)' }}>
              <span>👥</span>
              <div>
                <div>Team</div>
                <div style={S.diagramNodeSub}>Collaborate • Communicate</div>
              </div>
            </div>
            <div style={{ ...S.diagramNode, flex: 1, borderColor: 'rgba(108,124,255,0.28)' }}>
              <span>📅</span>
              <div>
                <div>Deadlines</div>
                <div style={S.diagramNodeSub}>Stay on Schedule</div>
              </div>
            </div>
          </div>
          <div style={S.diagramRow}>
            <div style={{ ...S.diagramNode, borderColor: 'rgba(52,211,153,0.4)', boxShadow: '0 0 20px rgba(52,211,153,0.1)' }}>
              <span>📈</span>
              <div>
                <div style={{ color: '#34d399' }}>Progress</div>
                <div style={S.diagramNodeSub}>Measure • Improve • Succeed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer pills */}
        <div style={S.footerPills}>
          {['Projects', 'Tasks', 'Teams', 'Progress'].map((pill, i) => (
            <React.Fragment key={pill}>
              {i > 0 && <div style={S.pillDot} />}
              <span style={S.footerPill}>{pill}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── RIGHT LOGIN CARD ── */}
      <div className="login-right" style={S.right}>
        <div style={S.card}>
          <div style={S.cardBrand}>
            <Logo size={20} />
            <span style={S.cardBrandName}>SyncUp</span>
          </div>

          <h2 style={S.cardTitle}>Welcome back 👋</h2>
          <p style={S.cardSub}>Sign in to continue to your SyncUp workspace.</p>

          {localError && (
            <div style={S.errorBox}>{localError.message || 'Invalid credentials'}</div>
          )}

          <form onSubmit={handleSubmit} autoComplete="on">
            <label htmlFor="login-email" style={S.label}>Email</label>
            <div style={S.inputWrap}>
              <span style={S.inputIcon}><MailIcon /></span>
              <input
                id="login-email"
                type="text"
                name="username"
                placeholder="Enter your email"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setInputFocus((p) => ({ ...p, username: true }))}
                onBlur={() => setInputFocus((p) => ({ ...p, username: false }))}
                required
                style={{ ...S.input, ...focusStyle('username') }}
              />
            </div>

            <label htmlFor="login-password" style={S.label}>Password</label>
            <div style={S.inputWrap}>
              <span style={S.inputIcon}><LockIcon /></span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setInputFocus((p) => ({ ...p, password: true }))}
                onBlur={() => setInputFocus((p) => ({ ...p, password: false }))}
                required
                style={{ ...S.input, ...focusStyle('password') }}
              />
              <button
                type="button"
                style={S.eyeBtn}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>

            <div style={S.rowLine}>
              <label style={S.rememberLabel}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={S.checkbox}
                />
                Remember me
              </label>
              <a href="#" style={S.forgotLink}>Forgot password?</a>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{ ...S.signInBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.boxShadow = '0 8px 32px rgba(91,92,226,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(91,92,226,0.45)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight /></>}
            </button>
          </form>

          <div style={S.dividerRow}>
            <div style={S.dividerLine} />
            <span style={S.dividerText}>Your work matters</span>
            <div style={S.dividerLine} />
          </div>

          <div style={S.registerRow}>
            Don't have an account?
            <Link to="/register" style={S.registerLink}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
