import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Prevent private dashboards from search engine indexing
  React.useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    const previous = metaRobots.getAttribute('content');
    metaRobots.setAttribute('content', 'noindex, nofollow');
    return () => {
      metaRobots.setAttribute('content', previous || 'index, follow');
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bgDarker text-white">جاري التحميل...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const userRole = user.role ? String(user.role).toUpperCase().trim() : '';
    const allowed = allowedRoles.map(r => String(r).toUpperCase().trim());

    if (!userRole || !allowed.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
