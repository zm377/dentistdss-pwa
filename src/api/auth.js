import api from './config';

const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  signup: (userData) => api.post('/api/auth/signup', userData),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
};

export default authAPI;
