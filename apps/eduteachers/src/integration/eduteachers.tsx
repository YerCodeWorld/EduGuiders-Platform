import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../../../../packages/ui/src/exports.ts';
import {getRandomInt} from "../../../../packages/ui/src/methods.ts";
import ContentManagement from "../components/content/ContentManagement.tsx"
import { UserRole } from "../../../../packages/ui/src/exports.ts";
import ProtectedRoute from "@repo/ui/components/common/ProtectedRoute";

// Lazy load components
const TeacherSelector = lazy(() => import('../pages/TeacherSelector'));
const TeacherProfile = lazy(() => import('../pages/TeacherProfile'));

export const EduTeachersRoutes = () => {

    const loadingPhrases = [
        "Yahir is the best teacher in the world",
        "Paying in DOP is cheaper than dollars",
        "More than teachers, we are your close friends",
        "Did you know you can set modes? Agressive teaching, compassionate teaching, ...",
        "Why are some people so intelligent?"
    ]


    return (
        <Routes>
            {/* Routes content */}
            <Route path="/" element={<MainLayout />}>
                <Route path="teachers" element={
                    <Suspense fallback={ <p className="loading">{loadingPhrases[getRandomInt(0, loadingPhrases.length - 1)]}</p>}>
                        <TeacherSelector />
                    </Suspense>
                } />

                <Route path="teachers/:id" element={
                    <Suspense fallback={ <p>{loadingPhrases[getRandomInt(0, loadingPhrases.length - 1)]}</p>}>
                        <TeacherProfile />
                    </Suspense>
                } />

                <Route path="/teacher/content" element={
                    <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                        <ContentManagement />
                    </ProtectedRoute>
                } />

                {/* Protected routes */}
            </Route>
        </Routes>
    );
};

export { TeacherSelector, TeacherProfile };