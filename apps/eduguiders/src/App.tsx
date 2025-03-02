// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, UserRole } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
// './integration/eduteachers'   --- This is the original approach, was this intended?
import { EduTeachersRoutes } from '../../eduteachers/src/integration/eduteachers';

// Lazy-loaded pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard'));

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
                        </Route>

                        {/* Admin routes */}
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                                <MainLayout />
                            </ProtectedRoute>
                        }>
                            {/* Admin routes go here */}
                        </Route>

                        {/* Teacher routes */}
                        <Route path="/teacher" element={
                            <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                                <MainLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<TeacherDashboard />} />
                            {/* Other teacher routes go here */}
                        </Route>

                        {/* Student routes */}
                        <Route path="/student" element={
                            <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                                <MainLayout />
                            </ProtectedRoute>
                        }>
                            {/* Student routes go here */}
                        </Route>

                        {/* Integrate EduTeachers routes */}
                        <Route path="/*" element={<EduTeachersRoutes />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;