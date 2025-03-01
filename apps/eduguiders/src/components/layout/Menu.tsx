// src/components/layout/Menu.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import '../../styles/layout/menu.css';

interface MenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const Menu = ({ isOpen, onClose }: MenuProps) => {
    const { user, isAuthenticated, logout } = useAuth();

    // Handle Escape key press to close menu
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscKey);

        // Prevent scrolling when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            window.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Handle logout
    const handleLogout = () => {
        logout();
        onClose();
    };

    // Render role-specific menu items
    const renderRoleBasedItems = () => {
        if (!isAuthenticated || !user) return null;


        switch (user.role) {

            case UserRole.ADMIN:
                return (

                    <div className="role-menu">
                        <h3>Admin</h3>
                        <ul>
                            <li><Link to="/admin" onClick={onClose}>Dashboard</Link></li>
                            <li><Link to="/admin/users" onClick={onClose}>Manage Users</Link></li>
                            <li><Link to="/admin/content" onClick={onClose}>Manage Content</Link></li>
                            <li><Link to="/admin/settings" onClick={onClose}>Site Settings</Link></li>
                        </ul>
                    </div>
                );
            case UserRole.TEACHER:
                return (
                    <div className="role-menu">
                        <h3>Teacher</h3>
                        <ul>
                            <li><Link to="/teacher" onClick={onClose}>Dashboard</Link></li>
                            <li><Link to="/teacher/profile" onClick={onClose}>My Profile</Link></li>
                            <li><Link to="/teacher/schedule" onClick={onClose}>My Schedule</Link></li>
                            <li><Link to="/teacher/students" onClick={onClose}>My Students</Link></li>
                            <li><Link to="/teacher/content" onClick={onClose}>My Content</Link></li>
                        </ul>
                    </div>
                );
            case UserRole.STUDENT:
                return (
                    <div className="role-menu">
                        <h3>Student</h3>
                        <ul>
                            <li><Link to="/student" onClick={onClose}>Dashboard</Link></li>
                            <li><Link to="/student/profile" onClick={onClose}>My Profile</Link></li>
                            <li><Link to="/student/classes" onClick={onClose}>My Classes</Link></li>
                            <li><Link to="/student/teachers" onClick={onClose}>My Teachers</Link></li>
                            <li><Link to="/student/progress" onClick={onClose}>My Progress</Link></li>
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Backdrop for closing the menu when clicking outside */}
            {isOpen && (
                <div className="menu-backdrop" onClick={onClose} />
            )}

            {/* Menu content */}
            <div className={`menu ${isOpen ? 'is-active' : ''}`}>
                <div className="menu-inner">
                    <div className="menu-header">
                        <h2>Navigation</h2>
                        <button
                            className="close-button"
                            onClick={onClose}
                            aria-label="Close menu"
                        >
                            ×
                        </button>
                    </div>

                    <div className="menu-content">
                        {/* Main navigation links */}
                        <div className="main-links">
                            <ul>
                                <li><Link to="/" onClick={onClose}>Home</Link></li>
                                <li><Link to="/teachers" onClick={onClose}>Teachers</Link></li>
                                <li><Link to="/articles" onClick={onClose}>Journal</Link></li>
                                <li><Link to="/games" onClick={onClose}>Games</Link></li>
                                <li><Link to="/courses" onClick={onClose}>Courses</Link></li>
                                <li><Link to="/competitions" onClick={onClose}>Competitions</Link></li>
                            </ul>
                        </div>

                        {/* Role-specific navigation */}
                        {renderRoleBasedItems()}

                        {/* Authentication actions */}
                        <div className="auth-actions">
                            {isAuthenticated ? (
                                <button className="logout-button" onClick={handleLogout}>
                                    Log Out
                                </button>
                            ) : (
                                <div className="login-actions">
                                    <Link to="/login" className="login-button" onClick={onClose}>
                                        Log In
                                    </Link>
                                    <Link to="/register" className="register-button" onClick={onClose}>
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Menu;