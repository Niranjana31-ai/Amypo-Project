import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProjects } from '../../store/slices/projectSlice';
import projectService from '../../services/projectService';

const ProjectForm = ({ project, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (project) {
        await projectService.update(project.id, formData);
      } else {
        await projectService.create(formData);
      }
      dispatch(fetchProjects());
      onClose();
    } catch (err) {
      if (err.status === 400) {
        setError(err.message || 'Invalid request.');
      } else if (!err.status) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.message || 'An error occurred.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{project ? 'Edit Project' : 'New Project'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name*</label>
            <input type="text" name="name" placeholder="Project Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" placeholder="Detailed project scope." value={formData.description} onChange={handleChange} rows={3} />
          </div>
          <div className="form-group">
            <label>Start Date *</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>
          <button type="submit" role="button" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving ...' : project ? 'Save Changes' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
