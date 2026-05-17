import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-gemBgAlt flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-gemBorder border-t-gemRed rounded-full animate-spin"></div>
                    <p className="text-gemTextLight text-sm uppercase tracking-widest">Loading...</p>
                </div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
