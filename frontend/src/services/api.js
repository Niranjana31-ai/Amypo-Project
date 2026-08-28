import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user?.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    } catch (_) {}
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // Only redirect on 401 if it's NOT an auth endpoint (i.e. user was already logged in)
    if (status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
      return Promise.reject({ message: 'Session expired', status: 401, timestamp: new Date().toISOString() });
    }

    // Retry once on network error (no response)
    if (!error.response && !error.config?.isRetryRequest) {
      error.config.isRetryRequest = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api(error.config);
    }

    // Normalize all errors to consistent shape
    const normalizedError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: status || 0,
      timestamp: new Date().toISOString(),
    };
    return Promise.reject(normalizedError);
  }
);

export default api;
