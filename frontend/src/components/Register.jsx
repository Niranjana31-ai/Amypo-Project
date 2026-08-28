import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice';
import authService from '../services/authService';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'TEAM_MEMBER' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register(formData);
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'var(--danger)', marginBottom: 12, fontSize: '0.9rem' }}>{error}</div>}
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" placeholder="Pick a unique username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>I am a ...</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="TEAM_MEMBER">TEAM_MEMBER</option>
            <option value="PROJECT_COORDINATOR">PROJECT_COORDINATOR</option>
            <option value="STAKEHOLDER">STAKEHOLDER</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Account ...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Register;
