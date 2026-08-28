import api from './api';

const projectService = {
  getProjects: async () => {
    try {
      return await api.get('/projects');
    } catch (error) {
      throw { message: error.message || 'Network Error' };
    }
  },

  create: (data) => api.post('/projects', data),

  update: (id, data) => api.put(`/projects/${id}`, data),

  archiveProject: (id) => api.patch(`/projects/${id}/archive`),

  getProgress: (id) => api.get(`/projects/${id}/progress`),
};

export default projectService;
