import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gemBgAlt">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gemRed"></div>
            </div>
        );
    }

    if (!user || !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;
