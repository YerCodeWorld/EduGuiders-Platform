// Explicitly export components and hooks for use by other apps
export { default as MainLayout } from './components/layout/MainLayout';
export { default as ProtectedRoute } from './components/common/ProtectedRoute';
export { AuthProvider, useAuth, UserRole } from './contexts/AuthContext';
export { getInitials } from './methods';