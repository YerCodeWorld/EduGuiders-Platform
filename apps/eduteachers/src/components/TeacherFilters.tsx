// src/components/TeacherFilters.tsx
import React, { useState, useEffect } from 'react';
import '../styles/components/teacherFilters.css';

interface TeacherFiltersProps {
    subjects: string[];
    selectedSubject: string;
    onSubjectChange: (subject: string) => void;
}

const TeacherFilters: React.FC<TeacherFiltersProps> = ({
                                                           subjects,
                                                           selectedSubject,
                                                           onSubjectChange
                                                       }) => {
    const [searchSubject, setSearchSubject] = useState('');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [priceRange, setPriceRange] = useState(100);
    const [availabilityFilter, setAvailabilityFilter] = useState('any');
    const [ratingFilter, setRatingFilter] = useState(0);

    // Filter subjects based on search
    const filteredSubjects = subjects
        .filter(subject =>
            subject.toLowerCase().includes(searchSubject.toLowerCase())
        )
        .sort();

    // Reset all filters
    const handleResetFilters = () => {
        setSearchSubject('');
        onSubjectChange('all');
        setPriceRange(100);
        setAvailabilityFilter('any');
        setRatingFilter(0);
    };

    // Handle mobile filter toggle
    const toggleMobileFilters = () => {
        setMobileFiltersOpen(!mobileFiltersOpen);
    };

    // Handle applying filters on mobile
    const handleApplyFilters = () => {
        setMobileFiltersOpen(false);
        // Apply filters here if needed
    };

    // Close mobile filters if window resizes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && mobileFiltersOpen) {
                setMobileFiltersOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileFiltersOpen]);

    return (
        <div className="teacher-filters">
            {/* Mobile filters header */}
            <div className="mobile-filters-header">
                <button
                    className="toggle-filters-button"
                    onClick={toggleMobileFilters}
                >
                    <i className="fas fa-filter filter-icon"></i>
                    Filters
                    <i className={`fas fa-chevron-${mobileFiltersOpen ? 'up' : 'down'}`}></i>
                </button>
            </div>

            {/* Filters panel (hidden on mobile unless toggled) */}
            <div className={`filters-panel ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
                <div className="panel-header">
                    <h3>Filters</h3>
                    <button
                        className="reset-button"
                        onClick={handleResetFilters}
                    >
                        Reset all
                    </button>
                </div>

                {/* Subject filter */}
                <div className="filter-section">
                    <h4>Subject</h4>
                    <div className="subject-search">
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={searchSubject}
                            onChange={(e) => setSearchSubject(e.target.value)}
                        />
                    </div>
                    <div className="subject-list">
                        <div className="subject-option">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedSubject === 'all'}
                                    onChange={() => onSubjectChange('all')}
                                />
                                <span className="checkbox-text">All Subjects</span>
                            </label>
                        </div>

                        {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subject) => (
                                <div key={subject} className="subject-option">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedSubject === subject}
                                            onChange={() => onSubjectChange(subject)}
                                        />
                                        <span className="checkbox-text">{subject}</span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            <div className="no-subjects">
                                No subjects match your search
                            </div>
                        )}
                    </div>
                </div>

                {/* Availability filter */}
                <div className="filter-section">
                    <h4>Availability</h4>
                    <div className="availability-options">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="availability"
                                value="any"
                                checked={availabilityFilter === 'any'}
                                onChange={() => setAvailabilityFilter('any')}
                            />
                            <span className="radio-text">Any time</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="availability"
                                value="today"
                                checked={availabilityFilter === 'today'}
                                onChange={() => setAvailabilityFilter('today')}
                            />
                            <span className="radio-text">Available today</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="availability"
                                value="this-week"
                                checked={availabilityFilter === 'this-week'}
                                onChange={() => setAvailabilityFilter('this-week')}
                            />
                            <span className="radio-text">Available this week</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="availability"
                                value="weekend"
                                checked={availabilityFilter === 'weekend'}
                                onChange={() => setAvailabilityFilter('weekend')}
                            />
                            <span className="radio-text">Weekend availability</span>
                        </label>
                    </div>
                </div>

                {/* Rating filter */}
                <div className="filter-section">
                    <h4>Rating</h4>
                    <div className="rating-options">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="rating"
                                value="0"
                                checked={ratingFilter === 0}
                                onChange={() => setRatingFilter(0)}
                            />
                            <span className="radio-text">Any rating</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="rating"
                                value="4.5"
                                checked={ratingFilter === 4.5}
                                onChange={() => setRatingFilter(4.5)}
                            />
                            <span className="radio-text">
                <i className="fas fa-star star-icon"></i> 4.5 & up
              </span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="rating"
                                value="4"
                                checked={ratingFilter === 4}
                                onChange={() => setRatingFilter(4)}
                            />
                            <span className="radio-text">
                <i className="fas fa-star star-icon"></i> 4.0 & up
              </span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="rating"
                                value="3.5"
                                checked={ratingFilter === 3.5}
                                onChange={() => setRatingFilter(3.5)}
                            />
                            <span className="radio-text">
                <i className="fas fa-star star-icon"></i> 3.5 & up
              </span>
                        </label>
                    </div>
                </div>

                {/* Price range filter */}
                <div className="filter-section">
                    <h4>Price Range (per hour)</h4>
                    <div className="price-range">
                        <div className="current-price">
                            $0 - ${priceRange}
                        </div>
                        <div className="price-slider">
                            <input
                                type="range"
                                min="20"
                                max="200"
                                step="5"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                            />
                            <div className="price-labels">
                                <span>$20</span>
                                <span>$200+</span>
                            </div>
                        </div>
                        <button
                            className="reset-price"
                            onClick={() => setPriceRange(100)}
                        >
                            Reset price
                        </button>
                    </div>
                </div>

                {/* Mobile apply button */}
                <div className="mobile-apply-filters">
                    <button
                        className="apply-button"
                        onClick={handleApplyFilters}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherFilters;