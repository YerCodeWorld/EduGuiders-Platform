// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, UserRole } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
// Import shared UI components (example)
// import { Button } from '@repo/ui/button';
// import { Card } from '@repo/ui/card';

// Lazy-loaded pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
// const TeachersPage = lazy(() => import('./pages/TeachersPage'));
// const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
// const CoursesPage = lazy(() => import('./pages/CoursesPage'));
// const GamesPage = lazy(() => import('./pages/GamesPage'));
// const CompetitionsPage = lazy(() => import('./pages/CompetitionsPage'));
// const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
// const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Role-specific pages
// const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard'));
// const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));

function App() {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<div className="loading">Loading...</div>}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="login" element={<LoginPage />} />
                            <Route path="register" element={<RegisterPage />} />

                            {/*
                            <Route path="teachers" element={<TeachersPage />} />
                            <Route path="articles" element={<ArticlesPage />} />
                            <Route path="courses" element={<CoursesPage />} />
                            <Route path="games" element={<GamesPage />} />
                            <Route path="competitions" element={<CompetitionsPage />} />
                            <Route path="unauthorized" element={<UnauthorizedPage />} />
                            */}

                        </Route>

                        {/* Admin routes */}
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                                <MainLayout />
                            </ProtectedRoute>
                        }>
                            {/*<Route index element={<AdminDashboard />} />*/}
                            {/* Add more admin routes as needed */}
                        </Route>

                        {/* Teacher routes */}
                        <Route path="/teacher" element={
                            <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                                <MainLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<TeacherDashboard />} />
                            {/* Add more teacher routes as needed */}
                        </Route>

                        {/* Student routes */}
                        <Route path="/student" element={
                            <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                                <MainLayout />
                            </ProtectedRoute>
                        }>
                            {/*<Route index element={<StudentDashboard />} />*/}
                            {/* Add more student routes as needed */}
                        </Route>

                        {/* Catch-all route */}
                        {/*<Route path="*" element={<NotFoundPage />} />*/}
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;