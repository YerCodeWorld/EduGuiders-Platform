// src/components/features/teachers/TeacherCard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
// Did we need User.Role in here?
import { useAuth } from '../../../../../../packages/ui/src/contexts/AuthContext';
import { getInitials } from '../../../methods.ts';
import '../../../styles/features/teachers/teacherCard.css';

export interface Teacher {
    id: string;
    name: string;
    profileImage: string;
    coverImage: string;
    description: string;
    subjects: string[];
    rating: number;
    reviewCount: number;
    hourlyRate: number;
    currency: string;
    stats: {
        students: number;
        courses: number;
        experience: number; // in years
    };
    availability?: {
        nextAvailable: string; // ISO date string
        availableDays: string[]; // e.g. ["Monday", "Wednesday", "Friday"]
    };
    badges?: string[]; // e.g. ["Certified", "Top Rated", "Featured"]
}

interface TeacherCardProps {
    teacher: Teacher;
    featured?: boolean;
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    // Again, did we need the user?
    const { isAuthenticated } = useAuth();

    // Generate star rating display
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="star full">★</span>);
        }

        // Add half star if needed
        if (hasHalfStar) {
            stars.push(<span key="half" className="star half">★</span>);
        }

        // Add empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
        }

        return stars;
    };

    // Format currency
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format date to relative time (e.g., "Tomorrow", "In 3 days", etc.)
    const formatAvailability = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(date.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Tomorrow';
        } else if (diffDays < 7) {
            return `In ${diffDays} days`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    // Handle booking button click
    const handleBookClick = () => {
        // If not authenticated, this would trigger a login prompt
        // For now, we'll just log to console
        if (!isAuthenticated) {
            console.log('User needs to log in to book');
            // In a real app, you might redirect to login or show a modal
            return;
        }

        console.log(`Booking session with ${teacher.name}`);
        // In a real app, this would navigate to a booking form or modal
    };

    return (
        <div
            className={"teacher-card"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Cover image */}
            <div
                className="teacher-cover"
                style={{ background: `var(--primary)` }}
            >

            </div>

            {/* Teacher info */}
            <div className="teacher-info">
                <div className="teacher-profile">
                    <div className="profile-image">
                        <img src={teacher.profileImage} alt={getInitials(teacher.name)} />
                    </div>
                    <h3 className="teacher-name">{teacher.name}</h3>

                    <div className="teacher-rating">
                        <div className="stars">{renderStars(teacher.rating)}</div>
                        <span className="review-count">({teacher.reviewCount})</span>
                    </div>

                    <div className="teacher-subjects">
                        {teacher.subjects.map((subject, index) => (
                            <span key={index} className="subject-tag">
                {subject}
              </span>
                        ))}
                    </div>
                </div>

                <p className="teacher-description">{teacher.description}</p>

                <div className="teacher-stats">
                    <div className="stat">
                        <span className="stat-value">{teacher.stats.students}</span>
                        <span className="stat-label">Students</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{teacher.stats.courses}</span>
                        <span className="stat-label">Courses</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{teacher.stats.experience}+</span>
                        <span className="stat-label">Years</span>
                    </div>
                </div>

                {teacher.availability && (
                    <div className="teacher-availability">
            <span className="next-available">
              Next available: {formatAvailability(teacher.availability.nextAvailable)}
            </span>
                        <div className="available-days">
                            {teacher.availability.availableDays.map((day, index) => (
                                <span key={index} className="day">{day.slice(0, 3)}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="teacher-actions">
                    <div className="hourly-rate">
                        <span className="rate">{formatCurrency(teacher.hourlyRate, teacher.currency)}</span>
                        <span className="per-hour">per hour</span>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="book-button"
                            onClick={handleBookClick}
                        >
                            Book Session
                        </button>

                        <Link
                            to={`/teachers/${teacher.id}`}
                            className="profile-button"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick actions that appear on hover */}
            <div className={`quick-actions ${isHovered ? 'visible' : ''}`}>
                <button className="action-button message" title="Message Teacher">
                    <span className="action-icon">✉</span>
                </button>
                <button className="action-button save" title="Save to Favorites">
                    <span className="action-icon">❤</span>
                </button>
                <button className="action-button share" title="Share">
                    <span className="action-icon">↗</span>
                </button>
            </div>
        </div>
    );
};

export default TeacherCard;