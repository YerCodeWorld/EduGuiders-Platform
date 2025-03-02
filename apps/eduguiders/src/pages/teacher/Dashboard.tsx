// src/pages/teacher/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/teacher/dashboard.css';

// Interface for upcoming session
interface UpcomingSession {
    id: string;
    studentName: string;
    studentAvatar: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'pending' | 'cancelled';
}

// Interface for student
interface Student {
    id: string;
    name: string;
    avatar: string;
    lastSession: string;
    totalSessions: number;
    subjects: string[];
}

// Interface for earnings data
interface EarningsData {
    period: string;
    amount: number;
    sessionCount: number;
    pendingAmount: number;
}

// Dashboard component
const TeacherDashboard = () => {
    const { user } = useAuth();
    const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
    const [recentStudents, setRecentStudents] = useState<Student[]>([]);
    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [statistics, setStatistics] = useState({
        totalStudents: 0,
        totalSessions: 0,
        completionRate: 0,
        averageRating: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // In a real app, these would be API calls
                // For now, we'll simulate the data

                // Fetch upcoming sessions
                await new Promise(resolve => setTimeout(resolve, 800));
                setUpcomingSessions([
                    {
                        id: 's1',
                        studentName: 'Alex Johnson',
                        studentAvatar: '/assets/students/alex.jpg',
                        subject: 'Advanced Algebra',
                        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                        startTime: '10:00 AM',
                        endTime: '11:30 AM',
                        status: 'scheduled',
                    },
                    {
                        id: 's2',
                        studentName: 'Maria Garcia',
                        studentAvatar: '/assets/students/maria.jpg',
                        subject: 'Calculus I',
                        date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
                        startTime: '2:00 PM',
                        endTime: '3:00 PM',
                        status: 'scheduled',
                    },
                    {
                        id: 's3',
                        studentName: 'Thomas Lee',
                        studentAvatar: '/assets/students/thomas.jpg',
                        subject: 'Statistics',
                        date: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
                        startTime: '4:30 PM',
                        endTime: '6:00 PM',
                        status: 'pending',
                    },
                ]);

                // Fetch recent students
                setRecentStudents([
                    {
                        id: 'st1',
                        name: 'Alex Johnson',
                        avatar: '/assets/students/alex.jpg',
                        lastSession: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                        totalSessions: 8,
                        subjects: ['Advanced Algebra', 'Calculus I'],
                    },
                    {
                        id: 'st2',
                        name: 'Maria Garcia',
                        avatar: '/assets/students/maria.jpg',
                        lastSession: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
                        totalSessions: 5,
                        subjects: ['Calculus I'],
                    },
                    {
                        id: 'st3',
                        name: 'Thomas Lee',
                        avatar: '/assets/students/thomas.jpg',
                        lastSession: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
                        totalSessions: 2,
                        subjects: ['Statistics'],
                    },
                    {
                        id: 'st4',
                        name: 'Sarah Williams',
                        avatar: '/assets/students/sarah.jpg',
                        lastSession: new Date(Date.now() - 2592000000).toISOString(), // 1 month ago
                        totalSessions: 12,
                        subjects: ['Advanced Algebra', 'Calculus II'],
                    },
                ]);

                // Fetch earnings data
                setEarnings({
                    period: 'This Month',
                    amount: 1250,
                    sessionCount: 25,
                    pendingAmount: 350,
                });

                // Fetch statistics
                setStatistics({
                    totalStudents: 24,
                    totalSessions: 156,
                    completionRate: 97,
                    averageRating: 4.8,
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);

        if (dateOnly.getTime() === today.getTime()) {
            return 'Today';
        } else if (dateOnly.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
        }
    };

    // Format relative time
    const formatRelativeTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }
    };

    return (
        <div className="teacher-dashboard">
            {isLoading ? (
                <div className="dashboard-loading">
                    <div className="spinner"></div>
                    <p>Loading your dashboard...</p>
                </div>
            ) : (
                <>
                    {/* Welcome header */}
                    <div className="dashboard-header">
                        <h1>Welcome, {user?.name}!</h1>
                        <p className="header-subtitle">
                            Here's an overview of your teaching activities
                        </p>
                    </div>

                    {/* Quick stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon students-icon"></div>
                            <div className="stat-content">
                                <h3>Total Students</h3>
                                <p className="stat-value">{statistics.totalStudents}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon sessions-icon"></div>
                            <div className="stat-content">
                                <h3>Total Sessions</h3>
                                <p className="stat-value">{statistics.totalSessions}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon completion-icon"></div>
                            <div className="stat-content">
                                <h3>Completion Rate</h3>
                                <p className="stat-value">{statistics.completionRate}%</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon rating-icon"></div>
                            <div className="stat-content">
                                <h3>Average Rating</h3>
                                <p className="stat-value">{statistics.averageRating}/5.0</p>
                            </div>
                        </div>
                    </div>

                    {/* Main dashboard content */}
                    <div className="dashboard-main">
                        {/* Left section */}
                        <div className="dashboard-section">
                            {/* Upcoming sessions */}
                            <div className="dashboard-card upcoming-sessions">
                                <div className="card-header">
                                    <h2>Upcoming Sessions</h2>
                                    <Link to="/teacher/schedule" className="view-all">
                                        View All
                                    </Link>
                                </div>

                                {upcomingSessions.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No upcoming sessions scheduled</p>
                                        <Link to="/teacher/availability" className="action-button">
                                            Update Availability
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="sessions-list">
                                        {upcomingSessions.map((session) => (
                                            <div key={session.id} className="session-item">
                                                <div className="session-info">
                                                    <div className="session-meta">
                            <span className="session-day">
                              {formatDate(session.date)}
                            </span>
                                                        <span className="session-time">
                              {session.startTime} - {session.endTime}
                            </span>
                                                    </div>

                                                    <div className="session-subject">
                                                        {session.subject}
                                                    </div>

                                                    <div className="session-student">
                                                        <img
                                                            src={session.studentAvatar}
                                                            alt={session.studentName}
                                                            className="student-avatar"
                                                        />
                                                        <span>{session.studentName}</span>
                                                    </div>
                                                </div>

                                                <div className="session-status">
                          <span className={`status-badge ${session.status}`}>
                            {session.status === 'scheduled'
                                ? 'Confirmed'
                                : session.status === 'pending'
                                    ? 'Pending'
                                    : 'Cancelled'}
                          </span>

                                                    <div className="session-actions">
                                                        <button className="session-action enter">
                                                            Enter
                                                        </button>
                                                        <button className="session-action details">
                                                            Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Earnings overview */}
                            {earnings && (
                                <div className="dashboard-card earnings">
                                    <div className="card-header">
                                        <h2>Earnings Overview</h2>
                                        <Link to="/teacher/earnings" className="view-all">
                                            Details
                                        </Link>
                                    </div>

                                    <div className="earnings-content">
                                        <div className="earnings-period">
                                            <span className="period-label">{earnings.period}</span>
                                            <span className="period-amount">
                        ${earnings.amount.toLocaleString()}
                      </span>
                                            <span className="period-sessions">
                        {earnings.sessionCount} sessions
                      </span>
                                        </div>

                                        <div className="earnings-pending">
                                            <div className="pending-header">
                                                <h3>Pending Payments</h3>
                                                <span className="pending-amount">
                          ${earnings.pendingAmount.toLocaleString()}
                        </span>
                                            </div>

                                            <div className="progress-bar">
                                                <div
                                                    className="progress"
                                                    style={{
                                                        width: `${(earnings.amount / (earnings.amount + earnings.pendingAmount)) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <Link to="/teacher/earnings" className="earnings-button">
                                            View Earnings History
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right section */}
                        <div className="dashboard-section">
                            {/* Recent students */}
                            <div className="dashboard-card recent-students">
                                <div className="card-header">
                                    <h2>Recent Students</h2>
                                    <Link to="/teacher/students" className="view-all">
                                        View All
                                    </Link>
                                </div>

                                {recentStudents.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No students yet</p>
                                    </div>
                                ) : (
                                    <div className="students-list">
                                        {recentStudents.map((student) => (
                                            <div key={student.id} className="student-item">
                                                <div className="student-info">
                                                    <img
                                                        src={student.avatar}
                                                        alt={student.name}
                                                        className="student-avatar"
                                                    />

                                                    <div className="student-details">
                                                        <span className="student-name">{student.name}</span>
                                                        <span className="student-meta">
                              {student.totalSessions} {student.totalSessions === 1 ? 'session' : 'sessions'} · Last: {formatRelativeTime(student.lastSession)}
                            </span>
                                                    </div>
                                                </div>

                                                <div className="student-subjects">
                                                    {student.subjects.map((subject, index) => (
                                                        <span key={index} className="subject-tag">
                              {subject}
                            </span>
                                                    ))}
                                                </div>

                                                <div className="student-actions">
                                                    <button className="student-action message">
                                                        Message
                                                    </button>
                                                    <button className="student-action schedule">
                                                        Schedule
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick actions */}
                            <div className="dashboard-card quick-actions">
                                <h2>Quick Actions</h2>

                                <div className="actions-grid">
                                    <Link to="/teacher/schedule" className="action-card">
                                        <div className="action-icon schedule-icon"></div>
                                        <span className="action-label">Manage Schedule</span>
                                    </Link>

                                    <Link to="/teacher/content" className="action-card">
                                        <div className="action-icon content-icon"></div>
                                        <span className="action-label">Add Content</span>
                                    </Link>

                                    <Link to="/teacher/profile" className="action-card">
                                        <div className="action-icon profile-icon"></div>
                                        <span className="action-label">Edit Profile</span>
                                    </Link>

                                    <Link to="/teacher/support" className="action-card">
                                        <div className="action-icon support-icon"></div>
                                        <span className="action-label">Support</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeacherDashboard;