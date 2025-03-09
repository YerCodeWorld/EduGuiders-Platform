// src/components/TeacherCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Teacher } from '@/types';
import '../styles/components/teacherCard.css';

export interface TeacherCardProps {
    teacher: Teacher;
    featured?: boolean;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, featured = false }) => {
    const [showActions, setShowActions] = useState(false);

    // Render star rating based on rating value
    const renderStars = (rating: number = 0) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
        }

        // Add half star if needed
        if (hasHalfStar) {
            stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
        }

        // Add empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
        }

        return stars;
    };

    return (
        <div
            className={`teacher-card ${featured ? 'featured' : ''}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Cover image or background */}
            <div
                className="teacher-cover"
                style={{ backgroundImage: `url(${teacher.landscapePicture})` }}
            >
                {/* Badges if any */}
                <div className="teacher-badges">
                    {teacher.rating && teacher.rating >= 4.8 && (
                        <span className="badge top-rated">Top Rated</span>
                    )}
                    {featured && (
                        <span className="badge featured">Featured</span>
                    )}
                </div>
            </div>

            {/* Teacher information */}
            <div className="teacher-info">
                <div className="teacher-profile">
                    <div className="profile-image">
                        {teacher.profilePicture ? (
                            <img src={teacher.profilePicture} alt={teacher.name} />
                        ) : (
                            <div className="profile-initials">{teacher.name}</div>
                        )}
                    </div>

                    <h3 className="teacher-name">{teacher.name}</h3>

                    {/* Star rating */}
                    {teacher.rating && (
                        <div className="teacher-rating">
                            <div className="stars">
                                {renderStars(teacher.rating)}
                            </div>
                            <span className="review-count">
                ({teacher.reviewCount || 0} reviews)
              </span>
                        </div>
                    )}
                </div>

                {/* Subject tags */}
                <div className="teacher-subjects">
                    {teacher.bio.expertiseAreas.slice(0, 3).map((area, index) => (
                        <span key={index} className="subject-tag">
              {area.name}
            </span>
                    ))}
                </div>

                {/* Short description */}
                <p className="teacher-description">
                    {teacher.title}
                </p>

                {/* Stats if available */}
                {teacher.reviewCount && (
                    <div className="teacher-stats">
                        <div className="stat">
                            <span className="stat-value">{teacher.reviewCount}</span>
                            <span className="stat-label">Students</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{teacher.posts.length}</span>
                            <span className="stat-label">Resources</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{teacher.rating ? teacher.rating.toFixed(1) : 'N/A'}</span>
                            <span className="stat-label">Rating</span>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="action-buttons">
                    <Link
                        to={`/teachers/${teacher.id}`}
                        className="profile-button"
                    >
                        View Profile
                    </Link>
                    <Link
                        to={`/teachers/${teacher.id}?action=book`}
                        className="book-button"
                    >
                        Book Session
                    </Link>
                </div>
            </div>

            {/* Quick action buttons (visible on hover) */}
            <div className={`quick-actions ${showActions ? 'visible' : ''}`}>
                <button className="action-button message" title="Message">
                    <i className="fas fa-comment action-icon"></i>
                </button>
                <button className="action-button save" title="Save">
                    <i className="fas fa-heart action-icon"></i>
                </button>
                <button className="action-button share" title="Share">
                    <i className="fas fa-share action-icon"></i>
                </button>
            </div>
        </div>
    );
};