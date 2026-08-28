import api from './api';

const taskService = {
  getByProject: (projectId) => api.get(`/tasks/project/${projectId}`),

  getAll: () => api.get('/tasks'),

  create: (data) => api.post('/tasks', data),

  updateTaskStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status?status=${status}`),

  assignTask: (taskId, userId) => api.post(`/tasks/${taskId}/assign/${userId}`),
};

export default taskService;
