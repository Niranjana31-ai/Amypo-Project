import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTasks } from '../../store/slices/taskSlice';
import taskService from '../../services/taskService';

const TaskForm = ({ projectId, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', projectId });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await taskService.create(formData);
      dispatch(fetchTasks(projectId));
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>New Task</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title*</label>
            <input type="text" name="title" placeholder="e.g. Implement Auth Filter" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" placeholder="What needs to be done?" value={formData.description} onChange={handleChange} rows={3} />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Creating ...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
