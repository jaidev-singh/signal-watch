import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import Home from '../features/home/Home';
import AdminPage from '../features/admin/AdminPage';
import Login from '../features/auth/Login';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import DatabaseTest from '../features/admin/DatabaseTest';
import { authService } from '../config/auth';

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  console.log('AppRoutes - Current user:', user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/login" 
            element={
              user ? <Navigate to="/admin" replace /> : <Login onLoginSuccess={setUser} />
            } 
          />
          <Route path="test-db" element={<DatabaseTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
