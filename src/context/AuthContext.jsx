import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      api.get('/auth/me/')
        .then(res => {
          setUser(res.data);
        })
        .catch((err) => {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Cross-tab session sync: if token changes in another tab, reload to sync or logout
    const syncLogout = (event) => {
      if (event.key === 'accessToken') {
        if (event.newValue === null) {
          window.location.href = '/login';
        } else if (event.newValue !== localStorage.getItem('accessToken')) {
          window.location.reload();
        }
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
