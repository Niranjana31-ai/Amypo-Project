import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ProjectList from './components/projects/ProjectList.jsx';
import TaskList from './components/tasks/TaskList.jsx';
import TeamWorkload from './components/team/TeamWorkload.jsx';
import MemberDashboard from './components/dashboard/MemberDashboard.jsx';
import StakeholderDashboard from './components/dashboard/StakeholderDashboard.jsx';
import StatCards from './components/dashboard/StatCards.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Dashboard = () => {
  const { user } = useSelector((s) => s.auth);
  if (user?.role === 'TEAM_MEMBER') return <MemberDashboard />;
  if (user?.role === 'STAKEHOLDER') return <StakeholderDashboard />;
  return <StatCards />;
};

const AUTH_PATHS = ['/login', '/register'];

export default function App() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);
  const showSidebar = isAuthenticated && !isAuthPage;

  return (
    <div className={showSidebar ? 'app-layout' : ''}>
      {showSidebar && <Navbar />}
      <div className={showSidebar ? 'app-main' : ''}>
        {showSidebar && <div className="mobile-topbar-spacer" />}
        <div className={showSidebar ? 'main-content' : ''}>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/"         element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
            <Route path="/projects/:projectId/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
            <Route path="/team"     element={<PrivateRoute><TeamWorkload /></PrivateRoute>} />
            <Route path="*"         element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
