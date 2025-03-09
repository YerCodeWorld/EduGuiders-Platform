import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../../../../packages/ui/src/exports.ts';

// Lazy load components
const TeacherSelector = lazy(() => import('../pages/TeacherSelector'));
const TeacherProfile = lazy(() => import('../pages/TeacherProfile'));

export const EduTeachersRoutes = () => {
    return (
        <Routes>
            {/* Routes content */}
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

                {/* Protected routes */}
            </Route>
        </Routes>
    );
};

export { TeacherSelector, TeacherProfile };