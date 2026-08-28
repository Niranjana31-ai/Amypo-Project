import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../store/slices/projectSlice';
import { fetchTasks } from '../../store/slices/taskSlice';
import taskService from '../../services/taskService';

const StatCards = () => {
  const dispatch = useDispatch();
  const projects = useSelector((s) => s.projects.items);
  const tasks = useSelector((s) => s.tasks.items);

  useEffect(() => {
    dispatch(fetchProjects());
    taskService.getAll().then((res) => {
      dispatch({ type: 'tasks/fetchByProject/fulfilled', payload: res.data });
    }).catch(() => {});
  }, [dispatch]);

  const count = (status) => tasks.filter((t) => t.status === status).length;

  const stats = [
    { label: 'Total Projects', value: projects.length },
    { label: 'Total Tasks', value: tasks.length },
    { label: 'In Progress', value: count('IN_PROGRESS') },
    { label: 'In Testing', value: count('TESTING') },
    { label: 'Completed', value: count('DONE') },
    { label: 'Backlog', value: count('BACKLOG') },
  ];

  return (
    <div>
      <div className="page-header"><h2>Dashboard</h2></div>
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatCards;
