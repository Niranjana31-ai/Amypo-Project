import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../../store/slices/projectSlice';
import taskService from '../../services/taskService';
import projectService from '../../services/projectService';
import CapacityBar from '../common/CapacityBar';

const Icon = ({ d, size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const STAT_CONFIG = [
  { key: 'totalProjects', label: 'Total Projects',  icon: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z', variant: '' },
  { key: 'totalTasks',    label: 'Total Tasks',     icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7',    variant: 'stat-info' },
  { key: 'inProgress',    label: 'In Progress',     icon: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83', variant: '' },
  { key: 'inTesting',     label: 'In Testing',      icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18', variant: 'stat-warning' },
  { key: 'completed',     label: 'Completed',       icon: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3', variant: 'stat-success' },
  { key: 'backlog',       label: 'Backlog',         icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', variant: 'stat-danger' },
];

const STATUS_BARS = [
  { key: 'inProgress', label: 'In Progress', color: '#2563eb' },
  { key: 'inTesting',  label: 'In Testing',  color: '#d97706' },
  { key: 'completed',  label: 'Completed',   color: '#16a34a' },
  { key: 'backlog',    label: 'Backlog',      color: '#dc2626' },
];

const StatCards = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const projects = useSelector((s) => s.projects.items);
  const tasks = useSelector((s) => s.tasks.items);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    dispatch(fetchProjects());
    taskService.getAll()
      .then((res) => dispatch({ type: 'tasks/fetchByProject/fulfilled', payload: res.data }))
      .catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    projects.forEach(async (p) => {
      try {
        const res = await projectService.getProgress(p.id);
        setProgressMap((prev) => ({ ...prev, [p.id]: res.data?.completionPercentage ?? 0 }));
      } catch (_) {}
    });
  }, [projects.length]);

  const count = (status) => tasks.filter((t) => t.status === status).length;

  const stats = {
    totalProjects: projects.length,
    totalTasks:    tasks.length,
    inProgress:    count('IN_PROGRESS'),
    inTesting:     count('TESTING'),
    completed:     count('DONE'),
    backlog:       count('BACKLOG'),
  };

  const total = stats.totalTasks || 1;
  const recentProjects = [...projects].slice(0, 5);
  const recentTasks = [...tasks].slice(0, 6);
  const isCoordinator = user?.role === 'PROJECT_COORDINATOR';

  return (
    <div className="dashboard">

      {/* ── Welcome Header ── */}
      <div className="dash-welcome">
        <div className="dash-welcome-text">
          <h1>{greeting()}, {user?.username} 👋</h1>
          <p>Here's what's happening with your projects today.</p>
        </div>
        {isCoordinator && (
          <button className="btn btn-primary" style={{ width: 'auto' }}
            onClick={() => navigate('/projects')}>
            <Icon d="M12 5v14M5 12h14" size={16} />
            New Project
          </button>
        )}
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-grid">
        {STAT_CONFIG.map(({ key, label, icon, variant }) => (
          <div key={key} className={`stat-card ${variant}`}>
            <div className="stat-card-icon">
              <Icon d={icon} size={18} />
            </div>
            <div className="stat-value">{stats[key]}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Middle Row: Task Status + Recent Projects ── */}
      <div className="dash-mid-grid">

        {/* Task Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3>Task Status Distribution</h3>
            <span className="badge badge-primary">{stats.totalTasks} total</span>
          </div>
          <div className="card-body">
            {stats.totalTasks === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                No tasks yet
              </div>
            ) : (
              <>
                {/* Stacked bar */}
                <div className="task-stack-bar">
                  {STATUS_BARS.map(({ key, color }) =>
                    stats[key] > 0 ? (
                      <div key={key} title={`${key}: ${stats[key]}`}
                        style={{ flex: stats[key], background: color, height: '100%', transition: 'flex 0.4s ease' }} />
                    ) : null
                  )}
                </div>
                {/* Legend */}
                <div className="task-stack-legend">
                  {STATUS_BARS.map(({ key, label, color }) => (
                    <div key={key} className="task-stack-legend-item">
                      <span className="task-stack-dot" style={{ background: color }} />
                      <span className="task-stack-legend-label">{label}</span>
                      <span className="task-stack-legend-count">{stats[key]}</span>
                    </div>
                  ))}
                </div>
                {/* Individual bars */}
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {STATUS_BARS.map(({ key, label, color }) => {
                    const pct = Math.round((stats[key] / total) * 100);
                    return (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{stats[key]} ({pct}%)</span>
                        </div>
                        <div className="progress">
                          <div className="progress-bar" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Projects</h3>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/projects')}>View all</button>
          </div>
          <div className="card-body">
            {recentProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                No projects yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {recentProjects.map((p) => {
                  const pct = progressMap[p.id] ?? 0;
                  return (
                    <div key={p.id} className="recent-project-row"
                      onClick={() => navigate(`/projects/${p.id}/tasks`)}
                      style={{ cursor: 'pointer' }}>
                      <div className="recent-project-icon">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.name}
                          </span>
                          <span className={`badge badge-${p.status}`} style={{ marginLeft: 8, flexShrink: 0 }}>{p.status}</span>
                        </div>
                        <CapacityBar percentage={pct} mode="progress" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Tasks ── */}
      <div className="dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Recent Tasks</h3>
          <button className="btn btn-sm btn-secondary" onClick={() => navigate('/projects')}>View projects</button>
        </div>
        {recentTasks.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 24px' }}>
            <div className="empty-icon">📋</div>
            <h3>No tasks yet</h3>
            <p>Tasks will appear here once projects are created.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((t) => (
                  <tr key={t.id} className="task-row">
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.title}</td>
                    <td>
                      <span className={`badge ${
                        t.priority === 'HIGH' ? 'badge-danger' :
                        t.priority === 'MEDIUM' ? 'badge-warning' : 'badge-info'
                      }`}>{t.priority}</span>
                    </td>
                    <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>{t.dueDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default StatCards;
