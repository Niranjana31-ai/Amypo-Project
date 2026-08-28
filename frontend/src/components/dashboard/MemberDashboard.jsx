import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CapacityBar from '../common/CapacityBar';

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const MemberDashboard = () => {
  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const projectsRes = await api.get('/projects');
        const taskArrays = await Promise.all(
          projectsRes.data.map((p) =>
            api.get(`/tasks/project/${p.id}`).then((r) => r.data).catch(() => [])
          )
        );
        const all = taskArrays.flat().filter((t) => t.status !== 'DONE');
        setActiveTasks(all);
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const pct = Math.min(100, (activeTasks.length / 5) * 100);
  const done = activeTasks.filter((t) => t.status === 'DONE').length;
  const inProgress = activeTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const inTesting = activeTasks.filter((t) => t.status === 'TESTING').length;
  const backlog = activeTasks.filter((t) => t.status === 'BACKLOG').length;
  const upcoming = activeTasks.slice(0, 5);

  return (
    <div className="dashboard">

      {/* Welcome */}
      <div className="dash-welcome">
        <div className="dash-welcome-text">
          <h1>{greeting()} 👋</h1>
          <p>You have <strong>{activeTasks.length}</strong> active task{activeTasks.length !== 1 ? 's' : ''} to work on.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-card-icon"><Icon d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" size={18} /></div>
          <div className="stat-value">{activeTasks.length}</div>
          <div className="stat-label">Active Tasks</div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-card-icon"><Icon d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" size={18} /></div>
          <div className="stat-value">{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-card-icon"><Icon d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" size={18} /></div>
          <div className="stat-value">{inTesting}</div>
          <div className="stat-label">In Testing</div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-card-icon"><Icon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" size={18} /></div>
          <div className="stat-value">{backlog}</div>
          <div className="stat-label">Backlog</div>
        </div>
      </div>

      {/* Capacity + Upcoming */}
      <div className="dash-mid-grid">
        <div className="card">
          <div className="card-header"><h3>My Capacity</h3></div>
          <div className="card-body">
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 12 }}>
              {activeTasks.length} of 5 task slots used
            </p>
            <CapacityBar percentage={pct} mode="workload" />
            <p style={{ marginTop: 12, fontSize: 'var(--font-size-sm)', fontWeight: 500,
              color: pct >= 100 ? 'var(--danger)' : pct >= 70 ? 'var(--warning)' : 'var(--success)' }}>
              {pct >= 100 ? '⚠️ At maximum capacity' : pct >= 70 ? '⚡ Getting busy' : '✅ Available for tasks'}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Upcoming Deadlines</h3></div>
          <div className="card-body">
            {upcoming.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: '16px 0' }}>
                No upcoming deadlines 🎉
              </p>
            ) : (
              <ul className="deadline-list">
                {upcoming.map((t) => (
                  <li key={t.id}>
                    <Icon d="M8 6h13M8 12h13M3 6h.01M3 12h.01" size={14} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.title}</span>
                      <span style={{ marginLeft: 8 }}>
                        <span className={`badge badge-${t.status}`}>{t.status}</span>
                      </span>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', flexShrink: 0 }}>
                      {t.dueDate || 'No date'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MemberDashboard;
