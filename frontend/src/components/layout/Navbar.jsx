import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const NAV_ITEMS = [
  { to: '/',               label: 'Dashboard',       icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', exact: true },
  { to: '/recent-projects',label: 'Recent Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { to: '/recent-tasks',   label: 'Recent Tasks',    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { to: '/projects',       label: 'Projects',        icon: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z' },
  { to: '/team',           label: 'Team',            icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', roles: ['PROJECT_COORDINATOR'] },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : 'U';
  const roleLabel = user.role === 'TEAM_MEMBER' ? 'Member'
    : user.role === 'PROJECT_COORDINATOR' ? 'Coordinator'
    : user.role === 'STAKEHOLDER' ? 'Stakeholder'
    : user.role ?? 'User';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user.role)
  );

  const SidebarContent = () => (
    <>
      <div className="sidebar-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B5CE2" />
              <stop offset="100%" stopColor="#6C7CFF" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="9" height="9" rx="2.5" fill="url(#logoGrad)"/>
          <rect x="13" y="2" width="9" height="9" rx="2.5" fill="url(#logoGrad)"/>
          <rect x="2" y="13" width="9" height="9" rx="2.5" fill="url(#logoGrad)"/>
          <rect x="13" y="13" width="9" height="9" rx="2.5" fill="url(#logoGrad)" opacity="0.45"/>
        </svg>
        <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
          SyncUp
        </span>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main Menu</span>
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon d={item.icon} size={17} />
            {item.label}
          </NavLink>
        ))}


      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Welcome back! {user.username}</div>
            <div className="sidebar-user-role" aria-label="user-role">{roleLabel}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 4, borderRadius: 6,
              display: 'flex', alignItems: 'center',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" size={17} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
          <Icon d="M3 12h18M3 6h18M3 18h18" size={20} />
        </button>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="none" style={{ marginLeft: 4 }}>
          <rect x="2" y="2" width="9" height="9" rx="2" fill="#5B5CE2"/>
          <rect x="13" y="2" width="9" height="9" rx="2" fill="#6C7CFF"/>
          <rect x="2" y="13" width="9" height="9" rx="2" fill="#5B5CE2"/>
          <rect x="13" y="13" width="9" height="9" rx="2" fill="#6C7CFF" opacity="0.45"/>
        </svg>
        <div className="avatar avatar-sm" style={{ marginLeft: 'auto' }}>{initials}</div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
          <aside className="sidebar sidebar-mobile">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;
