// src/components/layout/Header.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import Menu from './Menu';
import { getInitials } from "../../methods.ts";
import '../../styles/layout/header.css';
import * as React from "react";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();

    const toggleMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header id="header">
            <div className="header-container">
                <h1 className="site-title">
                    <Link to="/" className="title">EduGuiders</Link>
                </h1>

                <nav className="main-nav">
                    <ul>
                        <li><Link to="/teachers">Teachers</Link></li>
                        <li><Link to="/articles">Journal</Link></li>
                        <li><Link to="/games">Games</Link></li>
                        <li><Link to="/courses">Courses</Link></li>
                        <li><Link to="/competitions">Competitions</Link></li>
                    </ul>
                </nav>

                <div className="header-actions">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <div className="user-info">
                                <img
                                    src={user?.avatar || '/avatars/default.jpg'}
                                    alt={getInitials(user?.name)}
                                    className="user-avatar"
                                />
                                <span className="user-name">{user?.name}</span>
                            </div>
                            <Link to={getUserDashboardLink(user?.role)} className="dashboard-link">
                                Dashboard
                            </Link>
                            <button className="menu-toggle" onClick={toggleMenu}>
                                <span className="menu-icon">☰</span>
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="login-button">Log In</Link>
                            <Link to="/register" className="register-button">Register</Link>
                            <button className="menu-toggle" onClick={toggleMenu}>
                                <span className="menu-icon">☰</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Menu isOpen={menuOpen} onClose={closeMenu} />
        </header>
    );
};

// Helper function to get dashboard link based on user role
function getUserDashboardLink(role?: UserRole): string {
    switch (role) {
        case UserRole.ADMIN:
            return '/admin';
        case UserRole.TEACHER:
            return '/teacher';
        case UserRole.STUDENT:
            return '/student';
        default:
            return '/';
    }
}

export default Header;