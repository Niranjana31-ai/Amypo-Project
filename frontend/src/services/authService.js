import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response;
  },

  logout: () => {
    localStorage.removeItem('user');
  },
};

export default authService;
