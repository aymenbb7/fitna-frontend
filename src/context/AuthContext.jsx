import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('authUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = (() => {
      try {
        return localStorage.getItem('accessToken');
      } catch {
        return null;
      }
    })();

    if (token) {
      api.get('/auth/me/')
        .then(res => {
          setUser(res.data);
          try {
            localStorage.setItem('authUser', JSON.stringify(res.data));
          } catch {}
        })
        .catch((err) => {
          // Only clear session if explicitly rejected with 401 or 403
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            try {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('authUser');
            } catch {}
            setUser(null);
          }
          // On transient network error, preserve cached authUser so user is not kicked out
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Cross-tab session sync: logout if cleared in another tab
    const syncLogout = (event) => {
      if (event.key === 'accessToken' && event.newValue === null) {
        setUser(null);
        try {
          localStorage.removeItem('authUser');
        } catch {}
        if (window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login';
        }
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
    } catch {}
    setUser(userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
    } catch {}
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
