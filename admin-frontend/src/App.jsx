import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

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
  );
}

export default App;
