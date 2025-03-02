import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, MainLayout, ProtectedRoute, UserRole } from '../../../packages/ui/src/exports';
import { TeachersProvider } from "@/contexts";

// Lazy-loaded pages
const TeacherSelector = lazy(() => import('./pages/TeacherSelector'));
const TeacherProfile = lazy(() => import('./pages/TeacherProfile'));

function App() {
    return (
        <AuthProvider>
            <TeachersProvider>
            <Router>
                <Suspense fallback={<div className="loading">Loading...</div>}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<TeacherSelector />} />
                            <Route path="teachers/:id" element={<TeacherProfile />} />

                            {/* Protected routes */}
                            <Route path="teacher" element={
                                <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                                    <MainLayout />
                                </ProtectedRoute>
                            }>
                                {/* Add teacher routes */}
                            </Route>

                            <Route path="student" element={
                                <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                                    <MainLayout />
                                </ProtectedRoute>
                            }>
                                {/* Add student routes */}
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </Router>
            </TeachersProvider>
        </AuthProvider>
    );
}

export default App;