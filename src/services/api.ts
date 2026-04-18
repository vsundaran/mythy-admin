import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// Create axial instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
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
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor to handle errors globally and perform automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait and retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        if (response.data.success) {
          const { accessToken } = response.data.data;
          
          // Update local storage
          localStorage.setItem('admin_token', accessToken);
          
          // Update header for retry
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          processQueue(null, accessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Comprehensive logout and redirect
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session_expired=true';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Return standardized error object for all other errors
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({
      ...error,
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export default api;
