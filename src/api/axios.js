import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fitna-backend-production.up.railway.app/api/v1',
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Only set JSON content-type if not sending FormData
    // (FormData must let the browser set multipart/form-data with boundary)
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global 401
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Normalize error message
    let userMessage = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    if (error.response && error.response.data) {
      const data = error.response.data;
      if (typeof data.error === 'string') {
        userMessage = data.error;
      } else if (typeof data.message === 'string') {
        userMessage = data.message;
      } else if (typeof data.detail === 'string') {
        userMessage = data.detail;
      } else if (typeof data === 'string') {
        userMessage = data;
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      userMessage = 'انتهى وقت الطلب. الخادم يستغرق وقتاً طويلاً للاستجابة. يرجى المحاولة مرة أخرى.';
    } else if (error.message) {
      userMessage = error.message;
    }
    
    // Attach to error object so components can use err.userMessage
    error.userMessage = userMessage;
    
    return Promise.reject(error);
  }
);

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://fitna-backend-production.up.railway.app/api/v1';
  try {
    const urlObj = new URL(baseUrl);
    const host = `${urlObj.protocol}//${urlObj.host}`;
    return path.startsWith('/') ? `${host}${path}` : `${host}/${path}`;
  } catch (e) {
    return path;
  }
};

export default api;
