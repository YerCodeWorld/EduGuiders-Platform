// src/components/common/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, hasRole, loading } = useAuth();
    const location = useLocation();

    // Show loading state
    if (loading) {
        return <div className="loading">Getting there. Hold on...</div>;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If roles are specified and user doesn't have permission
    if (allowedRoles && !hasRole(allowedRoles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Render children if authenticated and authorized
    return <>{children}</>;
};

export default ProtectedRoute;