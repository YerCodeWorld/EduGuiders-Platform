// src/pages/student/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@repo/ui/contexts/AuthContext';
import { useTeachers } from '../../contexts';
// import { useNotify } from '@repo/ui/contexts/NotificationContext';
// import { formatTime, getDaysUntil, getStatusBadgeClass } from '../../../../packages/ui/src/methods';
import UpcomingClassCard from '../../components/student/UpcomingClassCard';
import LearningProgress from '../../components/student/LearningProgress';
import { TeacherCard } from '../../components/TeacherCard';
import { ROUTES, generateTeacherProfileRoute, generateSessionPrepRoute } from '../../../../../packages/ui/src/routes';
import '../../styles/pages/dashboard.css';

const StudentDashboard = () => {
    const { user } = useAuth();
    const { teachers, getTeacherBookings } = useTeachers();
    // const notify = useNotify();

    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [recentTeachers, setRecentTeachers] = useState([]);
    const [learningStats, setLearningStats] = useState({
        totalSessions: 0,
        completedSessions: 0,
        totalHours: 0,
        subjectsLearned: [],
        currentStreak: 0,
        nextMilestone: 0
    });
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // In a real app, these would be API calls
                // For now, we'll simulate data

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock upcoming classes data
                const mockUpcomingClasses = [
                    {
                        id: 'class1',
                        teacherId: teachers[0]?.id || 'teacher1',
                        teacherName: teachers[0]?.name || 'Yahir Beras',
                        teacherAvatar: teachers[0]?.profilePicture || '/api/placeholder/60/60',
                        subject: 'Mathematics',
                        topic: 'Advanced Algebra',
                        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                        startTime: '10:00',
                        endTime: '11:30',
                        status: 'confirmed',
                        meetingLink: 'https://meet.example.com/session-1234',
                        materials: [
                            { id: 'mat1', name: 'Algebra Practice Problems', type: 'pdf' },
                            { id: 'mat2', name: 'Quadratic Equations Explainer', type: 'video' }
                        ]
                    },
                    {
                        id: 'class2',
                        teacherId: teachers[1]?.id || 'teacher2',
                        teacherName: teachers[1]?.name || 'Sofia Rodriguez',
                        teacherAvatar: teachers[1]?.profilePicture || '/api/placeholder/60/60',
                        subject: 'Language Arts',
                        topic: 'Creative Writing',
                        date: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
                        startTime: '14:00',
                        endTime: '15:30',
                        status: 'confirmed',
                        meetingLink: 'https://meet.example.com/session-5678',
                        materials: [
                            { id: 'mat3', name: 'Narrative Techniques Handbook', type: 'pdf' }
                        ]
                    },
                    {
                        id: 'class3',
                        teacherId: teachers[2]?.id || 'teacher3',
                        teacherName: teachers[2]?.name || 'David Chen',
                        teacherAvatar: teachers[2]?.profilePicture || '/api/placeholder/60/60',
                        subject: 'Science',
                        topic: 'Wave Physics',
                        date: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
                        startTime: '16:00',
                        endTime: '17:00',
                        status: 'pending',
                        meetingLink: null,
                        materials: []
                    }
                ];

                setUpcomingClasses(mockUpcomingClasses);

                // Mock recent teachers data
                setRecentTeachers(teachers.slice(0, 3));

                // Mock learning statistics
                setLearningStats({
                    totalSessions: 24,
                    completedSessions: 21,
                    totalHours: 36.5,
                    subjectsLearned: ['Mathematics', 'Language Arts', 'Science', 'History'],
                    currentStreak: 8,
                    nextMilestone: 10
                });

                // Mock recommended teachers
                setRecommendations(teachers);

                setIsLoading(false);

                // Show welcome notification
                //notify.success(`Welcome back, ${user?.name}!`, 'Your learning journey continues');
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setIsLoading(false);
                //notify.error('Failed to load dashboard data');
            }
        };

        fetchDashboardData();
    }, [user, teachers]);  // Notify as well

    // Set page title
    useEffect(() => {
        document.title = 'Student Dashboard | EduTeachers';
    }, []);

    if (isLoading) {
        return (
            <div className="student-dashboard-loading">
                <div className="spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="student-dashboard">
            {/* Welcome header */}
            <div className="dashboard-header">
                <h1>Welcome, {user?.name}!</h1>
                <p className="header-subtitle">
                    Here's an overview of your learning journey
                </p>

                <div className="header-actions">
                    <Link to={ROUTES.TEACHERS} className="btn-primary">
                        <i className="fas fa-search"></i> Find New Teachers
                    </Link>
                    <Link to={ROUTES.STUDENT_CLASSES} className="btn-secondary">
                        <i className="fas fa-calendar-alt"></i> View All Classes
                    </Link>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Left column: Upcoming classes and progress */}
                <div className="dashboard-column">
                    {/* Upcoming Classes section */}
                    <section className="dashboard-card upcoming-classes">
                        <div className="card-header">
                            <h2>Upcoming Classes</h2>
                            <Link to={ROUTES.STUDENT_CLASSES} className="view-all">
                                View All
                            </Link>
                        </div>

                        <div className="classes-content">
                            {upcomingClasses.length === 0 ? (
                                <div className="empty-state">
                                    <i className="fas fa-calendar-plus empty-icon"></i>
                                    <h3>No upcoming classes scheduled</h3>
                                    <p>Start your learning journey by booking sessions with our expert teachers.</p>
                                    <Link to={ROUTES.TEACHERS} className="btn-primary">Find Teachers</Link>
                                </div>
                            ) : (
                                <div className="classes-list">
                                    {upcomingClasses.map((classItem) => (
                                        <UpcomingClassCard
                                            key={classItem.id}
                                            classData={classItem}
                                            onPrepareClick={() => navigate(generateSessionPrepRoute(classItem.id))}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Learning Progress section */}
                    <section className="dashboard-card learning-progress">
                        <div className="card-header">
                            <h2>Learning Progress</h2>
                            <Link to="/student/progress" className="view-all">
                                Details
                            </Link>
                        </div>

                        <div className="progress-content">
                            <LearningProgress stats={learningStats} />

                            <div className="subjects-learned">
                                <h3>Subjects Explored</h3>
                                <div className="subject-tags">
                                    {learningStats.subjectsLearned.map((subject, index) => (
                                        <span key={index} className="subject-tag">{subject}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right column: Recent teachers and recommendations */}
                <div className="dashboard-column">
                    {/* Recent Teachers section */}
                    <section className="dashboard-card recent-teachers">
                        <div className="card-header">
                            <h2>Your Teachers</h2>
                            <Link to="/student/teachers" className="view-all">
                                View All
                            </Link>
                        </div>

                        <div className="teachers-content">
                            {recentTeachers.length === 0 ? (
                                <div className="empty-state small">
                                    <p>You haven't connected with any teachers yet.</p>
                                    <Link to={ROUTES.TEACHERS} className="btn-primary">Browse Teachers</Link>
                                </div>
                            ) : (
                                <div className="recent-teachers-list">
                                    {recentTeachers.map((teacher) => (
                                        <div key={teacher.id} className="recent-teacher-item">
                                            <div className="teacher-avatar">
                                                <img
                                                    src={teacher.profilePicture || '/api/placeholder/50/50'}
                                                    alt={teacher.name}
                                                />
                                            </div>
                                            <div className="teacher-info">
                                                <h3 className="teacher-name">{teacher.name}</h3>
                                                <p className="teacher-specialty">{teacher.title}</p>
                                            </div>
                                            <div className="teacher-actions">
                                                <Link
                                                    to={generateTeacherProfileRoute(teacher.id)}
                                                    className="view-profile"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`${generateTeacherProfileRoute(teacher.id)}?action=book`}
                                                    className="book-session"
                                                >
                                                    Book
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recommended Teachers section */}
                    <section className="dashboard-card recommendations">
                        <div className="card-header">
                            <h2>Recommended for You</h2>
                            <Link to={ROUTES.TEACHERS} className="view-all">
                                Explore
                            </Link>
                        </div>

                        <div className="recommendation-content">
                            {recommendations.slice(0, 1).map((teacher) => (
                                <TeacherCard key={teacher.id} teacher={teacher} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;