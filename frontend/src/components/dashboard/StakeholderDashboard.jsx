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

const healthColor = { COMPLETED: 'var(--success)', 'ON TRACK': 'var(--success)', 'NEEDS ATTENTION': 'var(--warning)', 'AT RISK': 'var(--danger)' };

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

  return (
    <div>
      <div className="page-header">
        <h2>📈 Strategic Portfolio Overview — {projects.length} project{projects.length !== 1 ? 's' : ''}</h2>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Initiative</th>
              <th>Health Status</th>
              <th>Overall Progress</th>
              <th>Current Status</th>
              <th>Target Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const pct = progressMap[p.id]?.completionPercentage ?? 0;
              const health = calculateHealth(p, pct);
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td style={{ color: healthColor[health], fontWeight: 600 }}>{health}</td>
                  <td style={{ minWidth: 160 }}><CapacityBar percentage={pct} mode="progress" /></td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td>{p.endDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StakeholderDashboard;
