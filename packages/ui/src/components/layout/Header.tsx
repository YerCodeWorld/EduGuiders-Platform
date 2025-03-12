// src/components/layout/Header.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import Menu from './Menu';
import { getInitials } from "../../methods";
import '../../styles/layout/header.css';
import * as React from "react";
import img from '../../images/full/blue.png';

// I want to add a text next to the logo that indicates the section we are currently in
// To do that I could either make this a functional component or utilize another strategy
// to achieve it.

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

                <Link to="/" className="title logo-container">
                    <span className="visually-hidden">EduGuiders</span>
                </Link>

                {/*<h1>Home</h1>*/}

                <nav className="main-nav">
                    <ul>
                        {/* Add link to EduTeachers */}
                        <li><Link to="/teachers">Teachers</Link></li>
                        <li><Link to="/cons/blog">Journal</Link></li>
                        <li><Link to="/cons/games">Games</Link></li>
                        <li><Link to="/cons/courses">Courses</Link></li>
                        <li><Link to="/cons/compete">Competitions</Link></li>
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

export default Header;