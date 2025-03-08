// packages/ui/src/exports.ts
// Enhanced exports file for shared components and utilities

// Layout components (Main components)
export { default as MainLayout } from './components/layout/MainLayout';
export { default as Footer } from './components/layout/Footer';
export { default as Header } from './components/layout/Header';
export { default as Menu } from './components/layout/Menu';

// Common components
export { default as ProtectedRoute } from './components/common/ProtectedRoute';
export { default as ErrorBoundary } from './components/common/ErrorBoundary';
export { default as LoadingSpinner } from './components/common/LoadingSpinner';
export { default as NotFound } from './components/common/NotFound';
export { default as UnderConstruction } from './components/common/UnderConstruction';
export { default as NotificationProvider } from './components/common/Notification';

// Context providers
export { AuthProvider, useAuth, UserRole } from './contexts/AuthContext';

// Utility functions
export { getInitials, formatDate, formatTime, getStatusBadgeClass } from './methods';

// Types
export type { User } from './contexts/AuthContext';