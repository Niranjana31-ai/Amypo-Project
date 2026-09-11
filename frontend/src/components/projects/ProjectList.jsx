import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, updateProjectStatus } from '../../store/slices/projectSlice';
import projectService from '../../services/projectService';
import CapacityBar from '../common/CapacityBar';
import EmptyState from '../common/EmptyState';
import ProjectForm from './ProjectForm';

const ProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [progressData, setProgressData] = useState({});

  const isCoordinator = user?.role === 'PROJECT_COORDINATOR';

  // Stable key so the progress effect only re-runs when project IDs actually change
  const projectIds = useMemo(() => items.map((p) => p.id).join(','), [items]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!projectIds) return;
    items.forEach(async (p) => {
      try {
        const res = await projectService.getProgress(p.id);
        const data = res.data;
        const pct =
          data?.completionPercentage ??
          data?.completion_percentage ??
          data?.percentage ??
          0;
        setProgressData((prev) => ({ ...prev, [p.id]: { ...data, completionPercentage: pct } }));
        if (data?.status) dispatch(updateProjectStatus({ id: p.id, status: data.status }));
      } catch (err) {
        console.error(`Failed to fetch progress for project ${p.id}:`, err);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIds, dispatch]);

  const handleArchive = async (id) => {
    if (!window.confirm('Archive this project?')) return;
    await projectService.archiveProject(id);
    dispatch(fetchProjects());
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditProject(null);
    dispatch(fetchProjects());
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error) return <div className="error-message">Failed to load projects. Please refresh the page.</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Project Registry</h2>
        {isCoordinator && (
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowForm(true)}>
            + New Project
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState message="Start by creating your first coordination project." />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Timeline</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const prog = progressData[p.id];
                const pct = p.status === 'COMPLETED'
                  ? 100
                  : prog?.completionPercentage ?? 0;
                return (
                  <tr key={p.id} className="task-row">
                    <td>{p.name}</td>
                    <td>{p.description}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                    <td>{p.startDate} → {p.endDate}</td>
                    <td style={{ minWidth: 140 }}><CapacityBar percentage={pct} mode="progress" /></td>
                    <td>
                      <div className="task-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/projects/${p.id}/tasks`)}>Tasks</button>
                        {isCoordinator && p.status !== 'ARCHIVED' && (
                          <>
                            <button className="btn btn-sm btn-secondary" onClick={() => { setEditProject(p); setShowForm(true); }}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleArchive(p.id)}>Archive</button>
                          </>
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

      {showForm && (
        <ProjectForm project={editProject} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default ProjectList;
