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
  { to: '/',        label: 'Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', exact: true },
  { to: '/projects',label: 'Projects',  icon: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z' },
  { to: '/team',    label: 'Team',      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', roles: ['PROJECT_COORDINATOR'] },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : 'U';
  const roleLabel = user.role?.replace(/_/g, ' ') ?? 'User';

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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--primary)" stroke="none">
          <rect x="2" y="2" width="9" height="9" rx="2"/>
          <rect x="13" y="2" width="9" height="9" rx="2"/>
          <rect x="2" y="13" width="9" height="9" rx="2"/>
          <rect x="13" y="13" width="9" height="9" rx="2" opacity="0.4"/>
        </svg>
        SyncUp
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

        <span className="sidebar-section-label" style={{ marginTop: 8 }}>Other</span>
        <button className="sidebar-item" disabled style={{ opacity: 0.45, cursor: 'default' }}>
          <Icon d="M18 20V10M12 20V4M6 20v-6" size={17} />
          Reports
        </button>
        <button className="sidebar-item" disabled style={{ opacity: 0.45, cursor: 'default' }}>
          <Icon d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" size={17} />
          Settings
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.username}</div>
            <div className="sidebar-user-role">{roleLabel}</div>
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
        <span className="sidebar-brand" style={{ border: 'none', padding: 0, minHeight: 'unset' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary)" stroke="none">
            <rect x="2" y="2" width="9" height="9" rx="2"/>
            <rect x="13" y="2" width="9" height="9" rx="2"/>
            <rect x="2" y="13" width="9" height="9" rx="2"/>
            <rect x="13" y="13" width="9" height="9" rx="2" opacity="0.4"/>
          </svg>
          SyncUp
        </span>
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
