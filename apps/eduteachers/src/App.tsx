// src/App.tsx
import { lazy, Suspense } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, UserRole } from '../../eduguiders/src/contexts/AuthContext';
import MainLayout from '../../eduguiders/src/components/layout/MainLayout';
import ProtectedRoute from '../../eduguiders/src/components/common/ProtectedRoute';

// Lazy-loaded pages for better performance
const TeacherSelector = lazy(() => import('./pages/TeacherSelector'));
const TeacherProfile = lazy(() => import('./pages/TeacherProfile'));

/*
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const BookingManagement = lazy(() => import('./pages/BookingManagement'));
*/

function App() {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<div className="loading">Loading...</div>}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<TeacherSelector />} />
                            <Route path="teachers/:id" element={<TeacherProfile />} />

                            {/* Protected Teacher routes */}
                            <Route path="teacher" element={
                                <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                                    <MainLayout />
                                </ProtectedRoute>
                            }>
                                {/*<Route index element={<TeacherDashboard />} />
                                <Route path="bookings" element={<BookingManagement />} />*/}
                            </Route>

                            {/* Protected Student routes */}
                            <Route path="student" element={
                                <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                                    <MainLayout />
                                </ProtectedRoute>
                            }>
                                {/*<Route index element={<StudentDashboard />} />*/}
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;