import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../../store/slices/projectSlice';
import taskService from '../../services/taskService';
import EmptyState from '../common/EmptyState';

const Icon = ({ d, size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const STATUSES = ['BACKLOG', 'IN_PROGRESS', 'TESTING', 'DONE'];
const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];

const RecentTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const projects = useSelector((s) => s.projects.items);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const isCoordinator = user?.role === 'PROJECT_COORDINATOR';
  const isMember = user?.role === 'TEAM_MEMBER';

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.getAll();
      setTasks(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProjects());
    loadTasks();
  }, [dispatch]);

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      const res = await taskService.getAll();
      setTasks(res.data || []);
    } catch (err) {
      alert(err.message || 'Failed to update task status');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const nextStatus = { BACKLOG: 'IN_PROGRESS', IN_PROGRESS: 'TESTING', TESTING: 'DONE' };
  const actionLabel = { BACKLOG: '▶ Start Task', IN_PROGRESS: '🧪 Send to Testing', TESTING: '✔️ Complete Task' };

  // Helper to resolve project name
  const getProjectInfo = (task) => {
    if (task.project?.name) return task.project;
    const found = projects.find((p) => String(p.id) === String(task.projectId || task.project?.id));
    return found || { id: task.projectId || task.project?.id, name: 'Project' };
  };

  // Sort tasks by ID descending (most recent first)
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((t) => {
      const matchSearch =
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = !statusFilter || t.status === statusFilter;
      const matchPriority = !priorityFilter || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [sortedTasks, searchQuery, statusFilter, priorityFilter]);

  const count = (status) => tasks.filter((t) => t.status === status).length;
  const inProgressCount = count('IN_PROGRESS');
  const testingCount = count('TESTING');
  const doneCount = count('DONE');
  const backlogCount = count('BACKLOG');

  if (loading && tasks.length === 0) {
    return <div className="spinner-wrap"><div className="spinner" /></div>;
  }

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h2>Recent Tasks</h2>
          <p>Comprehensive list of recent tasks across all project workstreams.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          <button className="btn btn-outline" style={{ width: 'auto' }} onClick={loadTasks}>
            <Icon d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size={16} />
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ── Stat Summary Cards ── */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon">
            <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </div>
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-card-icon">
            <Icon d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
          </div>
          <div className="stat-value">{inProgressCount}</div>
          <div className="stat-label">In Progress</div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-card-icon">
            <Icon d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </div>
          <div className="stat-value">{testingCount}</div>
          <div className="stat-label">In Testing</div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-card-icon">
            <Icon d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
          </div>
          <div className="stat-value">{doneCount}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-card-icon">
            <Icon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </div>
          <div className="stat-value">{backlogCount}</div>
          <div className="stat-label">Backlog</div>
        </div>
      </div>

      {/* ── Search and Filter Controls ── */}
      <div className="search-filter-bar" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          className="search-input"
          type="text"
          placeholder="Search recent tasks by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ minWidth: 260 }}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* ── Tasks Table ── */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          message={searchQuery || statusFilter || priorityFilter ? 'No tasks match the selected criteria.' : 'No recent tasks available.'}
          ctaText="Explore Projects"
          onCtaClick={() => navigate('/projects')}
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => {
                const project = getProjectInfo(t);
                const isUpdating = updatingTaskId === t.id;
                const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE';

                return (
                  <tr key={t.id} className="task-row">
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {t.title}
                        </div>
                        {t.description && (
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {t.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {project.id ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/projects/${project.id}/tasks`)}
                          style={{
                            background: 'var(--primary-light)',
                            color: 'var(--accent)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                          title="Open Project Tasks"
                        >
                          📁 {project.name}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                          {project.name}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        t.priority === 'HIGH' ? 'badge-danger' :
                        t.priority === 'MEDIUM' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${t.status}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        color: isOverdue ? 'var(--danger)' : 'var(--text-muted)',
                        fontWeight: isOverdue ? 600 : 400,
                      }}>
                        {t.dueDate || '—'} {isOverdue && '⚠️ Overdue'}
                      </span>
                    </td>
                    <td>
                      <div className="task-actions">
                        {isCoordinator && (
                          <select
                            value={t.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(t.id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 6,
                              border: '1px solid var(--border)',
                              fontSize: '0.85rem',
                              background: 'var(--surface)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        )}

                        {isMember && t.status !== 'DONE' && nextStatus[t.status] && (
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ width: 'auto' }}
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(t.id, nextStatus[t.status])}
                          >
                            {isUpdating ? 'Updating...' : actionLabel[t.status]}
                          </button>
                        )}

                        {project.id && (
                          <button
                            className="btn btn-sm btn-secondary"
                            style={{ width: 'auto' }}
                            onClick={() => navigate(`/projects/${project.id}/tasks`)}
                          >
                            View →
                          </button>
                        )}
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

export default RecentTasks;
