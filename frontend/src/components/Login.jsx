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
      'radial-gradient(circle at 15% 50%, rgba(91,92,226,0.12) 0%, transparent 40%),' +
      'radial-gradient(circle at 85% 30%, rgba(108,124,255,0.08) 0%, transparent 45%),' +
      '#050814',
    fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: 1600,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2vw',
  },
  leftCol: {
    flex: '1.2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    maxWidth: 600,
    zIndex: 10,
  },
  midCol: {
    flex: '1.5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minHeight: 600,
  },
  rightCol: {
    flex: '1',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minWidth: 400,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 },
  brandName: {
    fontSize: 26, fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  headline: {
    fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', fontWeight: 800, color: '#ffffff',
    lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 6,
  },
  headlineAccent: {
    color: '#6C7CFF', display: 'block',
  },
  subtext: {
    fontSize: 16, color: '#94A3B8', marginTop: 16, marginBottom: 40,
    maxWidth: 420, lineHeight: 1.6,
  },
  features: {
    display: 'flex',
    gap: 32, marginBottom: 50,
  },
  featureItem: { display: 'flex', flexDirection: 'column', gap: 12 },
  featureIcon: {
    width: 48, height: 48, borderRadius: 14,
    background: 'rgba(91,92,226,0.1)', border: '1px solid rgba(108,124,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#8c97ff',
  },
  featureLabel: { fontSize: 12, color: '#94A3B8', fontWeight: 600, lineHeight: 1.4 },
  

  /* Flowchart Diagram */
  diagramNode: {
    position: 'absolute',
    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px',
    borderRadius: 30, background: 'rgba(12,16,40,0.85)',
    border: '1px solid', backdropFilter: 'blur(12px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.4)', color: '#ffffff',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
    minWidth: 180,
  },
  diagramTitle: { fontSize: 14, fontWeight: 700, marginBottom: 2 },
  diagramSub: { fontSize: 11, color: '#64748b', fontWeight: 500 },
  diagramIcon: {
    width: 32, height: 32, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  /* Right Side Card */
  card: {
    width: '100%', maxWidth: 440,
    background: 'rgba(12,16,36,0.6)',
    border: '1px solid rgba(108,124,255,0.15)', borderRadius: 28,
    padding: '48px 40px', backdropFilter: 'blur(20px)',
    boxShadow: '0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  cardBrand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 },
  cardBrandName: {
    fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
  },
  cardTitle: { fontSize: 28, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 8 },
  cardSub: { fontSize: 14, color: '#94A3B8', marginBottom: 36, lineHeight: 1.5 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 },
  inputWrap: { position: 'relative', marginBottom: 24 },
  inputIcon: {
    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
    color: '#64748b', display: 'flex', alignItems: 'center', pointerEvents: 'none',
  },
  input: {
    width: '100%', padding: '14px 44px 14px 48px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, color: '#ffffff', fontSize: 15,
    fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
    outline: 'none', transition: 'all 0.2s',
  },
  eyeBtn: {
    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
    display: 'flex', alignItems: 'center', padding: 0,
  },
  rowLine: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  rememberLabel: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#94A3B8', cursor: 'pointer', userSelect: 'none' },
  checkbox: { width: 18, height: 18, borderRadius: 6, accentColor: '#6C7CFF', cursor: 'pointer' },
  forgotLink: { fontSize: 14, color: '#8c97ff', fontWeight: 500, textDecoration: 'none' },
  signInBtn: {
    width: '100%', padding: '16px 24px',
    background: 'linear-gradient(135deg, #5B5CE2 0%, #8b96ff 100%)',
    border: 'none', borderRadius: 50,
    color: '#ffffff', fontSize: 16, fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10, boxShadow: '0 8px 24px rgba(91,92,226,0.4)',
    transition: 'all 0.2s', letterSpacing: '0.01em',
  },
  dividerRow: { display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0 24px' },
  dividerLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' },
  dividerText: { fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', fontWeight: 500 },
  registerRow: { textAlign: 'center', fontSize: 14, color: '#94A3B8' },
  registerLink: { color: '#8c97ff', fontWeight: 600, textDecoration: 'none', marginLeft: 6 },
  errorBox: {
    color: '#fca5a5', background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12,
    padding: '12px 16px', marginBottom: 20, fontSize: 14, backdropFilter: 'blur(8px)',
  },
  footerLinks: { display: 'flex', gap: 24, marginTop: 40, alignItems: 'center', color: '#64748b', fontSize: 13, fontWeight: 500 },
};

/* ── Logo ── */
const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="none">
    <defs>
      <linearGradient id="lgLogin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6C7CFF" />
        <stop offset="100%" stopColor="#8b96ff" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="9" height="9" rx="2.5" fill="url(#lgLogin)" />
    <rect x="13" y="2" width="9" height="9" rx="2.5" fill="url(#lgLogin)" />
    <rect x="2" y="13" width="9" height="9" rx="2.5" fill="url(#lgLogin)" />
    <rect x="13" y="13" width="9" height="9" rx="2.5" fill="url(#lgLogin)" opacity="0.45" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const FEATURES = [
  { label: 'Project\nManagement', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg> },
  { label: 'Team\nCollaboration', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg> },
  { label: 'Task & Progress\nTracking', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg> },
  { label: 'Real-time\nVisibility', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> },
];

const FlowchartDiagram = () => {
  return (
    <div style={{ position: 'relative', width: 500, height: 600 }}>
      {/* SVG Connecting Lines */}
      <svg width="500" height="600" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
          </linearGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,2 L8,5 L0,8" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        
        {/* Projects to Tasks */}
        <path d="M250,110 C250,140 250,150 250,170" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
        
        {/* Tasks to Team and Deadlines */}
        <path d="M250,230 C250,260 120,270 120,300" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
        <path d="M250,230 C250,260 380,270 380,300" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
        
        {/* Team and Deadlines to Progress */}
        <path d="M120,360 C120,390 250,400 250,430" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
        <path d="M380,360 C380,390 250,400 250,430" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
      </svg>

      {/* Nodes */}
      <div style={{ ...S.diagramNode, top: 80, left: 250, borderColor: 'rgba(99,102,241,0.5)', boxShadow: '0 0 24px rgba(99,102,241,0.2)' }}>
        <div style={{ ...S.diagramIcon, background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>📁</div>
        <div><div style={S.diagramTitle}>Projects</div><div style={S.diagramSub}>Plan • Organize • Build</div></div>
      </div>

      <div style={{ ...S.diagramNode, top: 200, left: 250, borderColor: 'rgba(168,85,247,0.5)', boxShadow: '0 0 24px rgba(168,85,247,0.2)' }}>
        <div style={{ ...S.diagramIcon, background: 'rgba(168,85,247,0.2)', color: '#c084fc' }}>✅</div>
        <div><div style={S.diagramTitle}>Tasks</div><div style={S.diagramSub}>Track • Manage • Complete</div></div>
      </div>

      <div style={{ ...S.diagramNode, top: 330, left: 120, borderColor: 'rgba(59,130,246,0.5)', boxShadow: '0 0 24px rgba(59,130,246,0.2)' }}>
        <div style={{ ...S.diagramIcon, background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>👥</div>
        <div><div style={S.diagramTitle}>Team</div><div style={S.diagramSub}>Collaborate • Communicate</div></div>
      </div>

      <div style={{ ...S.diagramNode, top: 330, left: 380, borderColor: 'rgba(14,165,233,0.5)', boxShadow: '0 0 24px rgba(14,165,233,0.2)' }}>
        <div style={{ ...S.diagramIcon, background: 'rgba(14,165,233,0.2)', color: '#38bdf8' }}>📅</div>
        <div><div style={S.diagramTitle}>Deadlines</div><div style={S.diagramSub}>Stay on Schedule</div></div>
      </div>

      <div style={{ ...S.diagramNode, top: 460, left: 250, borderColor: 'rgba(16,185,129,0.5)', boxShadow: '0 0 24px rgba(16,185,129,0.2)' }}>
        <div style={{ ...S.diagramIcon, background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>📈</div>
        <div><div style={{ ...S.diagramTitle, color: '#34d399' }}>Progress</div><div style={S.diagramSub}>Measure • Improve • Succeed</div></div>
      </div>
    </div>
  );
};

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
    boxShadow: '0 0 0 3px rgba(91,92,226,0.3)',
    background: 'rgba(255,255,255,0.06)',
  } : {};

  return (
    <div style={S.page}>
      <style>{`
        @media (max-width: 1200px) {
          .login-container { flex-direction: column; padding: 40px 20px !important; }
          .login-mid { display: none !important; }
          .login-left { align-items: center; text-align: center; margin-bottom: 60px; }
          .login-features { justify-content: center; flex-wrap: wrap; }
        }
      `}</style>

      <div className="login-container" style={S.container}>
        {/* ── LEFT COLUMN ── */}
        <div className="login-left" style={S.leftCol}>
          <div style={S.brand}>
            <Logo size={32} />
            <span style={S.brandName}>SyncUp</span>
          </div>

          <h1 style={S.headline}>
            One team. One workspace.
            <span style={S.headlineAccent}>One direction.</span>
          </h1>
          <p style={S.subtext}>
            Connect projects, tasks, teams and progress in one intelligent workspace.
          </p>

          <div className="login-features" style={S.features}>
            {FEATURES.map((f) => (
              <div key={f.label} style={S.featureItem}>
                <div style={S.featureIcon}>{f.icon}</div>
                <span style={{ ...S.featureLabel, whiteSpace: 'pre-line' }}>{f.label}</span>
              </div>
            ))}
          </div>


          <div style={S.footerLinks}>
            <span>Projects</span> • <span>Tasks</span> • <span>Teams</span> • <span>Progress</span>
          </div>
        </div>

        {/* ── MIDDLE COLUMN: DIAGRAM ── */}
        <div className="login-mid" style={S.midCol}>
          <FlowchartDiagram />
        </div>

        {/* ── RIGHT COLUMN: LOGIN CARD ── */}
        <div className="login-right" style={S.rightCol}>
          <div style={S.card}>
            <div style={S.cardBrand}>
              <Logo size={24} />
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
                style={{ ...S.signInBtn, opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.boxShadow = '0 12px 32px rgba(91,92,226,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(91,92,226,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
    </div>
  );
};

export default Login;
