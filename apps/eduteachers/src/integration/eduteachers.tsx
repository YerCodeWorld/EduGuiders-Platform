// src/integration/eduteachers.tsx
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// These are probably import problems that just need path configuration
import MainLayout from '../../../eduguiders/src/components/layout/MainLayout';
import ProtectedRoute from '../../../eduguiders/src/components/common/ProtectedRoute';
import { UserRole } from '../../../eduguiders/src/contexts/AuthContext';

/*
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { UserRole } from '../contexts/AuthContext';
*/

import '../pages/TeacherProfile';

// Lazy load EduTeachers components to improve performance
const TeacherSelector = lazy(() => import('../pages/TeacherSelector'));
const TeacherProfile = lazy(() => import('../pages/TeacherProfile'));

/*
const TeacherDashboard = lazy(() => import('../pages/TeacherDashboard'));
const StudentDashboard = lazy(() => import('../../eduteachers/src/pages/StudentDashboard'));
const BookingManagement = lazy(() => import('../../eduteachers/src/pages/BookingManagement'));
*/

/**
 * EduTeachers routes to be integrated into the main EduGuiders router
 */
export const EduTeachersRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
                <Route path="teachers" element={
                    <Suspense fallback={<div className="loading">Loading teacher listings...</div>}>
                        <TeacherSelector />
                    </Suspense>
                } />

                <Route path="teachers/:id" element={
                    <Suspense fallback={<div className="loading">Loading teacher profile...</div>}>
                        <TeacherProfile />
                    </Suspense>
                } />

                {/* Protected Teacher routes */}
                <Route path="teacher" element={
                    <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    {/*
                    <Route path="dashboard" element={
                        <Suspense fallback={<div className="loading">Loading dashboard...</div>}>
                            <TeacherDashboard />
                        </Suspense>
                    } />
                    <Route path="bookings" element={
                        <Suspense fallback={<div className="loading">Loading bookings...</div>}>
                            <BookingManagement />
                        </Suspense>
                    } />
                    */}
                </Route>

                {/* Protected Student routes */}
                <Route path="student" element={
                    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    {/*
                    <Route path="dashboard" element={
                        <Suspense fallback={<div className="loading">Loading dashboard...</div>}>
                            <StudentDashboard />
                        </Suspense>
                    } />
                    */}
                </Route>
            </Route>
        </Routes>
    );
};

// Export key components for use in other parts of the app
// These are also supossed to export
//    TeacherDashboard,
//    StudentDashboard,
//    BookingManagement
export {
    TeacherSelector,
    TeacherProfile,

};