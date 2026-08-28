import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import taskService from '../../services/taskService';

const AssignmentModal = ({ task, onAssigned, onClose }) => {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/team/members').then((res) => setMembers(res.data)).catch(() => {});
  }, []);

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await taskService.assignTask(task.id, selected);
      onAssigned();
      onClose();
    } catch (err) {
      alert(err.message || 'Assignment failed. Member might be at full capacity.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Assign Task: {task.title}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="form-group">
          <label>Team Member</label>
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">- Choose Member -</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.username}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" disabled={!selected || saving} onClick={handleConfirm}>
          {saving ? 'Assigning ...' : 'Confirm Assignment'}
        </button>
      </div>
    </div>
  );
};

export default AssignmentModal;
