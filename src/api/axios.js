import axios from 'axios';

// Determine base URL:
// In browser on production (e.g. minasat-fitna.vercel.app):
// Use relative '/api/v1' so Vercel's API proxy routes it to Railway from Vercel's edge,
// eliminating client-side ISP DNS blocks, mobile carrier timeouts, and CORS preflights!
const getBaseUrl = () => {
  // In production browser, always use same-origin relative '/api/v1' proxy:
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api/v1';
  }
  // For local development on localhost:
  return import.meta.env.VITE_API_BASE_URL || 'https://fitna-backend-production.up.railway.app/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // LocalStorage access may be restricted in private browsing / sandboxes
    }
    // Only set JSON content-type if not sending FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized and attempt silent JWT refresh
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login/') &&
      !originalRequest.url?.includes('/auth/refresh/')
    ) {
      const refreshToken = (() => {
        try {
          return localStorage.getItem('refreshToken');
        } catch {
          return null;
        }
      })();

      if (refreshToken) {
        if (isRefreshing) {
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
          const refreshUrl = `${getBaseUrl()}/auth/refresh/`;
          const res = await axios.post(refreshUrl, { refresh: refreshToken }, { timeout: 15000 });
          const newAccess = res.data?.access;

          if (newAccess) {
            try {
              localStorage.setItem('accessToken', newAccess);
            } catch {}

            api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            processQueue(null, newAccess);
            return api(originalRequest);
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          } catch {}
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Normalize error message for user-facing displays
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
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      userMessage = 'انتهى وقت الطلب. الخادم يستغرق وقتاً طويلاً للاستجابة. يرجى المحاولة مرة أخرى.';
    } else if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
      userMessage = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.';
    } else if (error.message) {
      userMessage = error.message;
    }

    error.userMessage = userMessage;
    return Promise.reject(error);
  }
);

export const getMediaUrl = (path) => {
  if (!path) return '';
  // If it's already an absolute URL (e.g. Cloudflare R2 / S3), return as is:
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // In production browser, serve relative /media so it routes through Vercel proxy:
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return path.startsWith('/') ? path : `/${path}`;
  }
  return `https://fitna-backend-production.up.railway.app${path.startsWith('/') ? path : '/' + path}`;
};

export default api;
