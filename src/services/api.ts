import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      // Handle 401 Unauthorized or 403 Forbidden
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin_token');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Return standardized error object
    const errorMessage = response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({
      ...error,
      message: errorMessage,
      status: response?.status,
      data: response?.data
    });
  }
);

export default api;
