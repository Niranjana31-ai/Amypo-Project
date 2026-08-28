import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CapacityBar from '../common/CapacityBar';

const MemberDashboard = () => {
  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const projectsRes = await api.get('/projects');
        const taskArrays = await Promise.all(
          projectsRes.data.map((p) => api.get(`/tasks/project/${p.id}`).then((r) => r.data).catch(() => []))
        );
        const all = taskArrays.flat().filter((t) => t.status !== 'DONE');
        setActiveTasks(all);
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const pct = (activeTasks.length / 5) * 100;
  const upcoming = activeTasks.slice(0, 3);

  return (
    <div>
      <div className="page-header">
        <h2>🛠️ My Workbench — {activeTasks.length} active task{activeTasks.length !== 1 ? 's' : ''}</h2>
      </div>
      <div className="card dashboard-section" style={{ maxWidth: 400 }}>
        <p style={{ marginBottom: 8, fontWeight: 500 }}>Capacity</p>
        <CapacityBar percentage={pct} mode="workload" />
      </div>
      <div className="dashboard-section">
        <h3 style={{ marginBottom: 12 }}>Upcoming Deadlines</h3>
        {upcoming.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No upcoming deadlines.</p>
        ) : (
          <ul className="deadline-list">
            {upcoming.map((t) => (
              <li key={t.id}><strong>{t.title}</strong> — {t.dueDate || 'No due date'}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
