import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTasks, setSearchQuery } from '../../store/slices/taskSlice';
import taskService from '../../services/taskService';
import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';
import TaskForm from './TaskForm';
import AssignmentModal from './AssignmentModal';

const STATUSES = ['BACKLOG', 'IN_PROGRESS', 'TESTING', 'DONE'];

const TaskList = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { items, loading, error, searchQuery } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);
  const projects = useSelector((s) => s.projects.items);
  const project = projects.find((p) => String(p.id) === String(projectId));

  const [filterStatus, setFilterStatus] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [assignTask, setAssignTask] = useState(null);

  const isCoordinator = user?.role === 'PROJECT_COORDINATOR';
  const isMember = user?.role === 'TEAM_MEMBER';

  useEffect(() => {
    dispatch(fetchTasks(projectId));
  }, [dispatch, projectId]);

  const filteredTasks = items.filter((t) => {
    const matchSearch = t.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = !filterStatus || t.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const handleStatusChange = async (taskId, status) => {
    await taskService.updateTaskStatus(taskId, status);
    dispatch(fetchTasks(projectId));
  };

  const nextStatus = { BACKLOG: 'IN_PROGRESS', IN_PROGRESS: 'TESTING', TESTING: 'DONE' };
  const actionLabel = { BACKLOG: '▶ Start Task', IN_PROGRESS: '🧪 Send to Testing', TESTING: '✔️ Complete Task' };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error) return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <p>Unable to load tasks. Click to retry.</p>
      <button className="retry-btn" onClick={() => dispatch(fetchTasks(projectId))}>Retry</button>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h2>{project?.name || 'Tasks'}</h2>
        {isCoordinator && project?.status !== 'ARCHIVED' && (
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowTaskForm(true)}>
            + Add Task
          </button>
        )}
      </div>

      <SearchFilterBar
        placeholder="Search tasks by title ..."
        options={STATUSES}
        onSearchChange={(v) => dispatch(setSearchQuery(v))}
        onFilterChange={setFilterStatus}
      />

      {filteredTasks.length === 0 ? (
        <EmptyState message="No tasks matching your criteria." />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id} className="task-row">
                  <td>{t.title}</td>
                  <td>{t.priority}</td>
                  <td>{t.dueDate || '—'}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td>
                    <div className="task-actions">
                      {isCoordinator && (
                        <>
                          <button className="btn btn-sm btn-secondary" onClick={() => setAssignTask(t)}>Assign</button>
                          <select
                            value={t.status}
                            onChange={(e) => handleStatusChange(t.id, e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.85rem' }}
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </>
                      )}
                      {isMember && t.status !== 'DONE' && nextStatus[t.status] && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(t.id, nextStatus[t.status])}>
                          {actionLabel[t.status]}
                        </button>
                      )}
                      {isMember && t.status === 'DONE' && (
                        <span className="badge badge-DONE">Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showTaskForm && (
        <TaskForm projectId={projectId} onClose={() => { setShowTaskForm(false); dispatch(fetchTasks(projectId)); }} />
      )}
      {assignTask && (
        <AssignmentModal
          task={assignTask}
          onAssigned={() => dispatch(fetchTasks(projectId))}
          onClose={() => setAssignTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
