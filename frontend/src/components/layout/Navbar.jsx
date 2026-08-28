import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">SyncUp</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        {user.role === 'PROJECT_COORDINATOR' && <Link to="/team">Team</Link>}
      </div>
      <div className="navbar-user">
        <span>Welcome back! {user.username}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
