import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthContext] useEffect started. Checking localStorage for token...");
    const token = localStorage.getItem('accessToken');
    console.log(`[AuthContext] token found in localStorage: ${!!token}`);
    
    if (token) {
      console.log("[AuthContext] Token found. Calling GET /auth/me/ to fetch user data.");
      api.get('/auth/me/')
        .then(res => {
          console.log("[AuthContext] GET /auth/me/ SUCCESS. Setting user:", res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.log("[AuthContext] GET /auth/me/ FAILED. Error:", err.message);
          console.log("[AuthContext] Removing tokens from localStorage.");
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => {
          console.log("[AuthContext] Setting loading to false.");
          setLoading(false);
        });
    } else {
      console.log("[AuthContext] No token found. Setting loading to false.");
      setLoading(false);
    }
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    console.log("[AuthContext] login() called.");
    console.log("[AuthContext] State BEFORE login() -> user:", user, "loading:", loading, "accessToken:", localStorage.getItem('accessToken'));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
    console.log("[AuthContext] State AFTER login() -> user:", userData, "role:", userData?.role, "accessToken:", localStorage.getItem('accessToken'));
  };

  const logout = () => {
    console.log("[AuthContext] logout() called. Triggered at:", new Error().stack);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    console.log("[AuthContext] Triggering window.location.href = '/login'");
    window.location.href = '/login';
  };

  // Log state changes
  useEffect(() => {
    console.log("[AuthContext] STATE RENDER UPDATE -> isAuthenticated:", !!user, "| user:", user?.email, "| role:", user?.role, "| loading:", loading, "| token:", !!localStorage.getItem('accessToken'));
  });

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
