import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { ToastProvider } from './context/ToastContext';

function ProtectedRoute({ children }) {
    const userInfo = localStorage.getItem('adminInfo');
    if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed.isAdmin) return children;
    }
    return <Navigate to="/login" replace />;
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={
              <ProtectedRoute>
                  <AdminDashboard />
              </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

