import React from 'react';

const getColor = (percentage, mode) => {
  if (mode === 'progress') {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 30) return '#f59e0b';
    return '#ef4444';
  }
  if (percentage >= 90) return '#ef4444';
  if (percentage >= 70) return '#f59e0b';
  return '#10b981';
};

const CapacityBar = ({ percentage = 0, mode = 'workload' }) => {
  const pct = Math.min(100, Math.max(0, percentage));
  const color = getColor(pct, mode);
  return (
    <div className="capacity-bar-wrap">
      <div className="capacity-bar-track">
        <div className="capacity-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="capacity-bar-label">
        {Math.round(pct)}% {mode === 'progress' ? 'Complete' : 'Load'}
      </div>
    </div>
  );
};

export default CapacityBar;
