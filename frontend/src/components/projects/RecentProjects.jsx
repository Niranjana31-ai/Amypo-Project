import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../../store/slices/projectSlice';
import projectService from '../../services/projectService';
import CapacityBar from '../common/CapacityBar';
import EmptyState from '../common/EmptyState';

const Icon = ({ d, size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const STATUS_OPTIONS = ['ACTIVE', 'COMPLETED', 'ARCHIVED'];

const RecentProjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: projects, loading, error } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);

  const [progressMap, setProgressMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const isCoordinator = user?.role === 'PROJECT_COORDINATOR';

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    projects.forEach(async (p) => {
      try {
        const res = await projectService.getProgress(p.id);
        setProgressMap((prev) => ({ ...prev, [p.id]: res.data?.completionPercentage ?? 0 }));
      } catch (_) {}
    });
  }, [projects]);

  // Sort projects so the most recent / active are first
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return sortedProjects.filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [sortedProjects, searchQuery, statusFilter]);

  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length;
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length;
  const archivedCount = projects.filter((p) => p.status === 'ARCHIVED').length;

  const totalProgressSum = projects.reduce((acc, p) => acc + (progressMap[p.id] ?? 0), 0);
  const avgProgress = projects.length > 0 ? Math.round(totalProgressSum / projects.length) : 0;

  if (loading && projects.length === 0) {
    return <div className="spinner-wrap"><div className="spinner" /></div>;
  }

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h2>Recent Projects</h2>
          <p>Real-time overview and progress tracking across all your projects.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          {isCoordinator && (
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/projects')}>
              <Icon d="M12 5v14M5 12h14" size={16} />
              Project Registry
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">Failed to load projects. Please refresh.</div>}

      {/* ── Stat Summary Cards ── */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon">
            <Icon d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </div>
          <div className="stat-value">{projects.length}</div>
          <div className="stat-label">Total Projects</div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-card-icon">
            <Icon d="M13 10V3L4 14h7v7l9-11h-7z" />
          </div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">Active</div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-card-icon">
            <Icon d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
          </div>
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-card-icon">
            <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </div>
          <div className="stat-value">{avgProgress}%</div>
          <div className="stat-label">Avg Completion</div>
        </div>
      </div>

      {/* ── Search and Filter Controls ── */}
      <div className="search-filter-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search projects by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* ── Projects List / Table ── */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          message={searchQuery || statusFilter ? 'No projects match your current filters.' : 'No projects found in the system yet.'}
          ctaText={isCoordinator ? 'Go to Projects to Create' : undefined}
          onCtaClick={() => navigate('/projects')}
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Description</th>
                <th>Status</th>
                <th>Timeline</th>
                <th>Completion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => {
                const pct = progressMap[p.id] ?? 0;
                return (
                  <tr key={p.id} className="task-row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="recent-project-icon">
                          {p.name?.slice(0, 2).toUpperCase() || 'PR'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {p.name}
                          </div>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                            ID #{p.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 280, color: 'var(--text-secondary)' }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {p.description || 'No description provided'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${p.status}`}>{p.status}</span>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                      {p.startDate ? `${p.startDate} → ${p.endDate || 'Ongoing'}` : 'Not scheduled'}
                    </td>
                    <td style={{ minWidth: 160 }}>
                      <CapacityBar percentage={pct} mode="progress" />
                    </td>
                    <td>
                      <div className="task-actions">
                        <button
                          className="btn btn-sm btn-primary"
                          style={{ width: 'auto' }}
                          onClick={() => navigate(`/projects/${p.id}/tasks`)}
                        >
                          View Tasks →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
