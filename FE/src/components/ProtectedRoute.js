// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // 1) Not logged in?
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) If a specific role is required, but it doesn't match...
  if (role && userRole !== role && userRole !== `ROLE_${role}`) {
    return <Navigate to="/login" replace />;
  }

  // 3) All good
  return children;
}
