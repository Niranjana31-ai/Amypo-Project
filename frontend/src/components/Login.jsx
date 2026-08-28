import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  // Sync redux error into local so we can clear it on input
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ username: formData.username, password: formData.password }));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <div className="form-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        {localError && (
          <div className="error-message">{localError.message || 'Invalid credentials'}</div>
        )}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in ...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
