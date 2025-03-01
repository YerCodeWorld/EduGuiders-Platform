// src/pages/HomePage.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import CarouselBanner from '../components/home/CarouselBanner';
import Tiles from '../components/home/Tiles';
import Testimonials from '../components/home/Testimonials';
import Statistics from '../components/home/Statistics';
import TeacherCard, { Teacher } from '../components/features/teachers/TeacherCard';
import '../styles/pages/homePage.css';

// Featured teachers for homepage display
const FEATURED_TEACHERS: Teacher[] = [
    {
        id: 't1',
        name: 'Sofia Rodriguez',
        profileImage: '/assets/teachers/sofia.jpg',
        coverImage: '/assets/covers/mathematics.jpg',
        description: 'Mathematics expert specializing in calculus and advanced algebra.',
        subjects: ['Mathematics', 'Calculus'],
        rating: 4.9,
        reviewCount: 128,
        hourlyRate: 45,
        currency: 'USD',
        stats: {
            students: 427,
            courses: 8,
            experience: 12
        },
        badges: ['Top Rated']
    },
    {
        id: 't3',
        name: 'Yahir Beras',
        profileImage: '/assets/teachers/yahir.jpg',
        coverImage: '/assets/covers/literature.jpg',
        description: 'Literature and creative writing professor with published works.',
        subjects: ['Literature', 'Creative Writing'],
        rating: 5.0,
        reviewCount: 143,
        hourlyRate: 40,
        currency: 'USD',
        stats: {
            students: 510,
            courses: 12,
            experience: 15
        },
        badges: ['Featured']
    },
    {
        id: 't5',
        name: 'Marcus Williams',
        profileImage: '/assets/teachers/marcus.jpg',
        coverImage: '/assets/covers/music.jpg',
        description: 'Professional musician teaching piano and music theory.',
        subjects: ['Music', 'Piano'],
        rating: 4.9,
        reviewCount: 156,
        hourlyRate: 55,
        currency: 'USD',
        stats: {
            students: 389,
            courses: 9,
            experience: 18
        },
        badges: ['Professional Artist']
    }
];

const HomePage = () => {
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        // Set page title
        document.title = 'Guiders Door | Find Your Perfect Teacher';
    }, []);

    return (
        <div className="home-page">
            {/* Main banner carousel */}
            <CarouselBanner />

            {/* Personalized welcome for logged-in users */}
            {isAuthenticated && user && (
                <section className="welcome-section">
                    <div className="welcome-container">
                        <h2>Welcome back, {user.name}!</h2>
                        <div className="quick-actions">
                            <Link
                                to={`/${user.role.toLowerCase()}`}
                                className="dashboard-link"
                            >
                                Go to Dashboard
                            </Link>

                            {user.role === UserRole.STUDENT && (
                                <Link to="/upcoming-classes" className="classes-link">
                                    View Upcoming Classes
                                </Link>
                            )}

                            {user.role === UserRole.TEACHER && (
                                <Link to="/teacher/schedule" className="schedule-link">
                                    Manage Your Schedule
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Main content tiles */}
            <Tiles />

            {/* Featured teachers section */}
            <section className="featured-teachers">
                <div className="section-header">
                    <h2>Meet Our Featured EduGuiders</h2>
                    <p>Highly-rated educators ready to help you achieve your learning goals</p>
                </div>

                <div className="featured-grid">
                    {FEATURED_TEACHERS.map(teacher => (
                        <TeacherCard key={teacher.id} teacher={teacher} featured={true} />
                    ))}
                </div>

                <div className="view-all-container">
                    <Link to="/teachers" className="view-all-button">
                        View All Teachers
                    </Link>
                </div>
            </section>

            {/* Platform statistics */}
            <Statistics />

            {/* Testimonials and reviews */}
            <Testimonials />

            {/* Call to action section */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2>Ready to Become an EduExplorer?</h2>
                    <p>Join thousands of students who have found their perfect teacher match</p>

                    <div className="cta-buttons">
                        {isAuthenticated ? (
                            <Link to="/teachers" className="primary-button">
                                Find a Teacher
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="primary-button">
                                    Sign Up Free
                                </Link>
                                <Link to="/login" className="secondary-button">
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;