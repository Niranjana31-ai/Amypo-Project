import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CapacityBar from '../common/CapacityBar';

const TeamWorkload = () => {
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/team/workload')
      .then((res) => setWorkload(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header"><h2>Team Workload &amp; Capacity</h2></div>
      <div className="workload-grid">
        {workload.map((m) => {
          const pct = (m.taskCount / m.capacity) * 100;
          const atMax = m.taskCount >= m.capacity;
          return (
            <div key={m.id || m.username} className="workload-card">
              <h4>{m.username}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: 8 }}>
                Active Task Load: {m.taskCount} / {m.capacity}
              </p>
              <CapacityBar percentage={pct} mode="workload" />
              <p style={{ marginTop: 8, fontWeight: 500, color: atMax ? 'var(--danger)' : 'var(--success)' }}>
                {atMax ? '⚠️ At Maximum Capacity' : '✅ Available for Tasks'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamWorkload;
