// src/App.tsx

// Useless comments? Definitely. I'm just not a girl. I code in python and C# so this web development witchcraft
// is getting to my nerves. I will explain every single character in all my files until I make sure I understand this thing.

// Suspense is a react system
// Lazy is a react system
import { lazy, Suspense } from 'react';

// Here we are using several tools from the react available library
// BrowserRouter allows to wrap the application to enable routing (I suppose it enables scripts and methods for this purpose)
// Routes and Route are used to define pages or components that should load based on the URL
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import multiple components from a single file (global exports.ts in this case).
// Notice how the stuff imported here are not pages per se but systems to achieve some desired functionality.
import {
    AuthProvider,
    UserRole,  // What is this for?
    // NotificationProvider,
    MainLayout,
    ProtectedRoute,
    LoadingSpinner,
    ErrorBoundary,
    NotFound
} from '../../../packages/ui/src/exports';

// Our Routes system
import { ROUTES } from '../../../packages/ui/src/routes';

// EduTeachers integration
// Routes, classroom that we are currently not using and the teacher provider system
import { EduTeachersRoutes } from '../../eduteachers/src/integration/eduteachers';
import Classroom from '../../../packages/ui/src/components/Classroom';
import {TeachersProvider} from "../../eduteachers/src/contexts";

// Lazy-loaded pages for better performance. Self-explanatory
// The lazy system enables us to load a page only when needed.
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('../../../packages/ui/src/pages/LoginPage'));
const UnderConstruction = lazy(() => import('../../../packages/ui/src/components/common/UnderConstruction'));
const RegisterPage = lazy(() => import('../../../packages/ui/src/pages/RegisterPage'));
const TeacherDashboard = lazy(() => import('../../../packages/ui/src/pages/teacher/Dashboard'));
const StudentDashboard = lazy(() => import('../../../apps/eduteachers/src/pages/student/Dashboard'));
const SessionPrep = lazy(() => import('../../../packages/ui/src/components/Classroom'));


// To import a file before than needed we could use 'import(file)', just in case we by any chance don't want it to
// render every time.

// App on itself
function App() {

    return (
        <ErrorBoundary> {/*Is the system hierarchy important for non-related stuff? ... | See the component's code for doc.*/}
            <AuthProvider>
                {/*
                Here goes the notification provider
                */}
                <TeachersProvider>
                    {/*
                    Router: Allow/implement React routing
                    */}
                    <Router>
                        {/*
                        Suspense is the in-between page we use when lazy loading a page.
                        We use the fallback property to load a custom page as a suspense.
              ses props for a message (as we may want to change it depending on the context)
                        */}
                        <Suspense fallback={<LoadingSpinner fullPage message="We getting there, hold on..." />}>
                            {/*
                            Simple Stuff: Routes is a system that manages all routes in the page.
                            Route is using for a single component, but we could have nested routes and we can see below.
                            The LOGIN/REGISTER and other components will load inside the MainLayout page.
                            */}
                            <Routes>

                                {/* Public routes */}
                                <Route path="/" element={<MainLayout />}>
                                    {/*Adding the index property seems to be used to load that page by default*/}
                                    <Route index element={<HomePage />} />
                                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                                </Route>

                                {/*
                                Under Construction Routes
                                I just got creative here and added a different message depending on the page that is
                                under construction. Edited the routes file as well.
                                */}
                                <Route path={ROUTES.CONSTRUCTION} element={<MainLayout />}>

                                    <Route path={ROUTES.CONS_GAMES} element={
                                        <UnderConstruction estimatedCompletion={"Before December 10th"}></UnderConstruction>}>
                                    </Route>
                                    <Route path={ROUTES.CONS_BLOG} element={
                                        <UnderConstruction estimatedCompletion={"Before April 1st"}></UnderConstruction>}>
                                    </Route>
                                    <Route path={ROUTES.CONS_DISCUSS} element={
                                        <UnderConstruction estimatedCompletion={"2026 possibly"}></UnderConstruction>}>
                                    </Route>
                                    <Route path={ROUTES.CONS_COURSES} element={
                                        <UnderConstruction estimatedCompletion={"Really really soon"}></UnderConstruction>}>
                                    </Route>
                                    <Route path={ROUTES.CONS_COMPETE} element={
                                        <UnderConstruction estimatedCompletion={"2026 possibly"}></UnderConstruction>}>
                                    </Route>

                                </Route>

                                {/* Admin routes */}
                                <Route path={ROUTES.ADMIN_DASHBOARD} element={
                                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                                        <MainLayout />
                                    </ProtectedRoute>
                                }>
                                    {/* Admin routes go here */}
                                </Route>

                                {/* Teacher routes */}
                                <Route path={ROUTES.TEACHER_DASHBOARD} element={
                                    <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                                        <MainLayout />
                                    </ProtectedRoute>
                                }>
                                    <Route index element={<TeacherDashboard />} />
                                    {/* Other teacher routes go here */}
                                </Route>

                                {/* Student routes */}
                                <Route path={ROUTES.STUDENT_DASHBOARD} element={
                                    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                                        <MainLayout />
                                    </ProtectedRoute>
                                }>
                                    <Route index element={<StudentDashboard />} />
                                    {/* Other student routes go here */}
                                </Route>

                                {/*
                                Session routes
                                NOTE: We are not using any of this since we need to find out how to actually
                                make it work.
                                */}
                                <Route path="/session/:sessionId/prep" element={
                                    <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.TEACHER]}>
                                        <MainLayout />
                                    </ProtectedRoute>
                                }>
                                    <Route index element={<SessionPrep />} />
                                </Route>

                                <Route path="/classroom/:sessionId" element={
                                    <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.TEACHER]}>
                                        <MainLayout />
                                    </ProtectedRoute>
                                }>
                                    <Route index element={<Classroom />} />
                                </Route>

                                {/*
                                Integrate EduTeachers routes
                                Bingo! This would essentially load the EduTeachers App from this app.
                                Is this a good way of doing this?
                                */}
                                <Route path="/*" element={<EduTeachersRoutes />} />

                                {/* 404 Not Found route */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </Router>
                </TeachersProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;