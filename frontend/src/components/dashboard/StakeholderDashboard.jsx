import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CapacityBar from '../common/CapacityBar';

const calculateHealth = (project, completion) => {
  if (completion >= 100) return 'COMPLETED';
  const now = new Date();
  const end = new Date(project.endDate);
  if (now > end) return 'AT RISK';
  const start = new Date(project.startDate);
  const totalTime = end - start;
  const elapsed = now - start;
  const timeWeight = totalTime > 0 ? elapsed / totalTime : 0;
  if (timeWeight > 0.5 && completion / 100 < timeWeight * 0.8) return 'NEEDS ATTENTION';
  return 'ON TRACK';
};

const HEALTH_BADGE = {
  COMPLETED:       'badge-success',
  'ON TRACK':      'badge-success',
  'NEEDS ATTENTION':'badge-warning',
  'AT RISK':       'badge-danger',
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const StakeholderDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
        const entries = await Promise.all(
          res.data.map(async (p) => {
            try {
              const pr = await api.get(`/projects/${p.id}/progress`);
              return [p.id, pr.data];
            } catch (_) { return [p.id, { completionPercentage: 0 }]; }
          })
        );
        setProgressMap(Object.fromEntries(entries));
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const onTrack = projects.filter((p) => {
    const pct = progressMap[p.id]?.completionPercentage ?? 0;
    return calculateHealth(p, pct) === 'ON TRACK';
  }).length;

  const atRisk = projects.filter((p) => {
    const pct = progressMap[p.id]?.completionPercentage ?? 0;
    const h = calculateHealth(p, pct);
    return h === 'AT RISK' || h === 'NEEDS ATTENTION';
  }).length;

  const completed = projects.filter((p) => {
    const pct = progressMap[p.id]?.completionPercentage ?? 0;
    return calculateHealth(p, pct) === 'COMPLETED';
  }).length;

  return (
    <div className="dashboard">

      <div className="dash-welcome">
        <div className="dash-welcome-text">
          <h1>{greeting()} 👋</h1>
          <p>Strategic portfolio overview — {projects.length} project{projects.length !== 1 ? 's' : ''} tracked.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <div className="stat-value">{projects.length}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <div className="stat-value">{onTrack}</div>
          <div className="stat-label">On Track</div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
            </svg>
          </div>
          <div className="stat-value">{atRisk}</div>
          <div className="stat-label">Needs Attention</div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            </svg>
          </div>
          <div className="stat-value">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Portfolio table */}
      <div className="dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Portfolio Overview</h3>
        </div>
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No projects yet</h3>
            <p>Projects will appear here once they are created.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Initiative</th>
                  <th>Health</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Target Date</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const pct = progressMap[p.id]?.completionPercentage ?? 0;
                  const health = calculateHealth(p, pct);
                  return (
                    <tr key={p.id} className="task-row">
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                      <td><span className={`badge ${HEALTH_BADGE[health]}`}>{health}</span></td>
                      <td style={{ minWidth: 160 }}><CapacityBar percentage={pct} mode="progress" /></td>
                      <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>{p.endDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default StakeholderDashboard;
