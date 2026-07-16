import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  console.log(`[ProtectedRoute] RENDER -> location: ${location.pathname} | required role: ${allowedRoles} | current role: ${user?.role} | authenticated: ${!!user} | loading: ${loading}`);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bgDarker text-white">جاري التحميل...</div>;
  }

  if (!user) {
    console.log(`[ProtectedRoute] redirecting because user is null. Triggering <Navigate to="/login" />`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`[ProtectedRoute] redirecting because user.role '${user.role}' is not in allowedRoles [${allowedRoles}]. Triggering <Navigate to="/" />`);
    return <Navigate to="/" replace />;
  }

  console.log(`[ProtectedRoute] PASSED! Rendering children.`);
  return children;
};

export default ProtectedRoute;
