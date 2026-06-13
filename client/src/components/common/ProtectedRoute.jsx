import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page and record location to bounce back after auth
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo?.role)) {
    // User is authenticated but does not possess required role
    return <Navigate to="/" replace />;
  }

  return children;
}
