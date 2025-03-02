// src/components/layout/MainLayout.tsx
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/layout/mainLayout.css';

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="site-wrapper">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;