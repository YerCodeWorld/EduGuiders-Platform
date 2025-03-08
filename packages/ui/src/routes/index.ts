// packages/ui/src/routes/index.ts
// Centralized routing configuration for consistency across apps

// Route path constants to ensure consistent navigation
export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    CONSTRUCTION: '/cons',
    CONS_GAMES: '/cons/games',
    CONS_BLOG: '/cons/blog',
    CONS_COMPETE: '/cons/compete',
    CONS_DISCUSS: '/cons/discuss',
    CONS_COURSES: '/cons/courses',

    // Teacher related routes
    TEACHERS: '/teachers',
    TEACHER_PROFILE: '/teachers/:id',
    TEACHER_DASHBOARD: '/teacher',
    TEACHER_SCHEDULE: '/teacher/schedule',
    TEACHER_SETTINGS: '/teacher/settings',
    TEACHER_STUDENTS: '/teacher/students',
    TEACHER_EARNINGS: '/teacher/earnings',
    TEACHER_CONTENT: '/teacher/content',

    // Student related routes
    STUDENT_DASHBOARD: '/student',
    STUDENT_CLASSES: '/student/classes',
    STUDENT_PROFILE: '/student/profile',
    STUDENT_FAVORITES: '/student/favorites',
    STUDENT_MESSAGES: '/student/messages',

    // Classroom related routes
    CLASSROOM: '/classroom/:sessionId',
    SESSION_PREP: '/session/:sessionId/prep',

    // Educational content
    COURSES: '/courses',
    COURSE_DETAILS: '/courses/:id',
    ARTICLES: '/articles',
    ARTICLE_DETAILS: '/articles/:id',
    GAMES: '/games',
    GAME_DETAILS: '/games/:id',
    COMPETITIONS: '/competitions',

    // Administrative
    ADMIN_DASHBOARD: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_CONTENT: '/admin/content',
    ADMIN_SETTINGS: '/admin/settings',

    // Utility pages
    HELP: '/help',
    FAQ: '/faq',
    CONTACT: '/contact',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '*'
};

// Route generation helper functions
export const generateTeacherProfileRoute = (teacherId: string): string => {
    return `/teachers/${teacherId}`;
};

export const generateClassroomRoute = (sessionId: string): string => {
    return `/classroom/${sessionId}`;
};

export const generateSessionPrepRoute = (sessionId: string): string => {
    return `/session/${sessionId}/prep`;
};

export const generateCourseRoute = (courseId: string): string => {
    return `/courses/${courseId}`;
};

// Helper to check if a route requires authentication
export const isProtectedRoute = (path: string): boolean => {
    return (
        path.startsWith('/teacher') ||
        path.startsWith('/student') ||
        path.startsWith('/admin') ||
        path.startsWith('/classroom') ||
        path.startsWith('/session')
    );
};