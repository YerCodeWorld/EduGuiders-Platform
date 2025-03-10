// src/components/home/WelcomeMessage.tsx
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '../../../../../packages/ui/src/contexts/AuthContext';
import '../../styles/home/welcomeMessage.css';

const WelcomeMessage = () => {
    const { user, isAuthenticated } = useAuth();

    console.log('The user that has logged in is: ', user);
    console.log('His role is: ', user?.role);

    if (!isAuthenticated || !user) return null;

    // Determine user's role to show relevant information
    const isTeacher = user.role === UserRole.TEACHER;
    const isStudent = user.role === UserRole.STUDENT;
    const isAdmin = user.role === UserRole.ADMIN;

    // Get current time to personalize greeting
    const currentHour = new Date().getHours();
    let greeting = 'Welcome back';

    if (currentHour < 12) {
        greeting = 'Good morning';
    } else if (currentHour < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    return (
        <div className="welcome-message">
            <div className="welcome-content">
                <div className="welcome-header">
                    <h2>{greeting}, {user.name}!</h2>
                    <p className="user-role">{isTeacher ? 'Teacher' : isStudent ? 'Student' : isAdmin ? 'Administrator' : 'Member'}</p>
                </div>

                <div className="welcome-actions">
                    <Link to={`/${user.role.toLowerCase()}`} className="dashboard-action">
                        <span className="action-icon">
                            <i className="fas fa-tachometer-alt"></i>
                        </span>
                        <span className="action-label">
                            <span className="action-title">Dashboard</span>
                            <span className="action-desc">View your personalized dashboard</span>
                        </span>
                    </Link>

                    {isTeacher && (
                        <>
                            <Link to="/teacher/schedule" className="schedule-action">
                                <span className="action-icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </span>
                                <span className="action-label">
                                    <span className="action-title">Schedule</span>
                                    <span className="action-desc">Manage your teaching schedule</span>
                                </span>
                            </Link>

                            <Link to="/teacher/students" className="students-action">
                                <span className="action-icon">
                                    <i className="fas fa-user-graduate"></i>
                                </span>
                                <span className="action-label">
                                    <span className="action-title">Students</span>
                                    <span className="action-desc">View your current students</span>
                                </span>
                            </Link>
                        </>
                    )}

                    {isStudent && (
                        <>
                            <Link to="/upcoming-classes" className="classes-action">
                                <span className="action-icon">
                                    <i className="fas fa-chalkboard-teacher"></i>
                                </span>
                                <span className="action-label">
                                    <span className="action-title">Classes</span>
                                    <span className="action-desc">View your upcoming classes</span>
                                </span>
                            </Link>

                            <Link to="/my-teachers" className="teachers-action">
                                <span className="action-icon">
                                    <i className="fas fa-star"></i>
                                </span>
                                <span className="action-label">
                                    <span className="action-title">Teachers</span>
                                    <span className="action-desc">View your favorite teachers</span>
                                </span>
                            </Link>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <Link to="/admin/users" className="users-action">
                                <span className="action-icon">
                                    <i className="fas fa-users-cog"></i>
                                </span>
                                <span className="action-label">
                                    <span className="action-title">Users</span>
                                    <span className="action-desc">Manage system users</span>
                                </span>
                            </Link>

                            <Link to="/admin/settings" className="settings-action">
                                <span className="action-icon">
                                    <i className="fas fa-cogs"></i>
                                </span>
                                <span className="action-label">
                                    <span className="action-title">Settings</span>
                                    <span className="action-desc">System configuration</span>
                                </span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WelcomeMessage;