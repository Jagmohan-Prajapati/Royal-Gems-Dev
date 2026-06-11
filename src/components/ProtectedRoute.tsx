import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex justify-center items-center">
        <div className="h-6 w-12 border-b-2 border-primary animate-pulse" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex justify-center items-center">
        <div className="h-6 w-12 border-b-2 border-primary animate-pulse" />
      </div>
    );
  }

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}
