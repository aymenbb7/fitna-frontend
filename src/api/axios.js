import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const urlObj = new URL(baseUrl);
  const host = `${urlObj.protocol}//${urlObj.host}`;

  return path.startsWith('/') ? `${host}${path}` : `${host}/${path}`;
};

export default api;
