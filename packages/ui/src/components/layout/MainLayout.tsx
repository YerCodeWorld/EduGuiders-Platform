// src/components/layout/MainLayout.tsx
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header  from '../layout/Header';
import Footer from '../layout/Footer';
// import { useAuth } from '../../contexts/AuthContext';
import '../../styles/layout/mainLayout.css';

const MainLayout = () => {
    // const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="site-wrapper">
            <Header />
            {/*Lol just by keeping the real name there's going to be some random padding*/}
            <main className="main-cdontent">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;