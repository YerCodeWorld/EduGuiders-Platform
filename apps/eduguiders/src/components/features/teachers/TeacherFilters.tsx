// src/components/features/teachers/TeacherFilters.tsx
import { useState, useEffect } from 'react';
import '../../../styles/features/teachers/teacherFilters.css';

// Define filter option types
interface FilterOptions {
    subject?: string;
    availability?: string;
    minRating?: number;
    maxPrice?: number;
    sortBy: 'recommended' | 'rating' | 'price_low' | 'price_high' | 'availability';
}

interface TeacherFiltersProps {
    filters: FilterOptions;
    onFilterChange: (filters: Partial<FilterOptions>) => void;
}

// Sample subjects for the filter
const SUBJECTS = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Literature',
    'History',
    'Philosophy',
    'Psychology',
    'Economics',
    'Business',
    'Music',
    'Art',
    'Languages',
    'Physical Education'
];

const TeacherFilters = ({ filters, onFilterChange }: TeacherFiltersProps) => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState('');
    const [filteredSubjects, setFilteredSubjects] = useState(SUBJECTS);

    // Filter subjects when search changes
    useEffect(() => {
        if (!subjectSearch.trim()) {
            setFilteredSubjects(SUBJECTS);
            return;
        }

        const lowercaseSearch = subjectSearch.toLowerCase();
        const filtered = SUBJECTS.filter(subject =>
            subject.toLowerCase().includes(lowercaseSearch)
        );
        setFilteredSubjects(filtered);
    }, [subjectSearch]);

    // Toggle mobile filters visibility
    const toggleMobileFilters = () => {
        setMobileFiltersOpen(prev => !prev);
    };

    // Reset all filters
    const resetFilters = () => {
        onFilterChange({
            subject: undefined,
            availability: undefined,
            minRating: undefined,
            maxPrice: undefined,
            sortBy: 'recommended'
        });
        setSubjectSearch('');
    };

    // Apply current filters and close mobile panel
    const applyFilters = () => {
        setMobileFiltersOpen(false);
    };

    return (
        <div className="teacher-filters">
            {/* Mobile filters toggle */}
            <div className="mobile-filters-header">
                <button
                    className="toggle-filters-button"
                    onClick={toggleMobileFilters}
                    aria-expanded={mobileFiltersOpen}
                >
                    <span className="filter-icon">⚙</span>
                    <span className="filter-text">Filters</span>
                    <span className="filter-arrow">{mobileFiltersOpen ? '▲' : '▼'}</span>
                </button>
            </div>

            {/* Filters panel - desktop always visible, mobile toggleable */}
            <div className={`filters-panel ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
                <div className="panel-header">
                    <h3>Filters</h3>
                    <button className="reset-button" onClick={resetFilters}>
                        Reset All
                    </button>
                </div>

                {/* Subject filter */}
                <div className="filter-section">
                    <h4>Subject</h4>
                    <div className="subject-search">
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                        />
                    </div>

                    <div className="subject-list">
                        {filteredSubjects.map(subject => (
                            <div className="subject-option" key={subject}>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={filters.subject === subject}
                                        onChange={() => onFilterChange({
                                            subject: filters.subject === subject ? undefined : subject
                                        })}
                                    />
                                    <span className="checkbox-text">{subject}</span>
                                </label>
                            </div>
                        ))}

                        {filteredSubjects.length === 0 && (
                            <p className="no-subjects">No subjects match your search</p>
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
                                checked={filters.availability === 'today'}
                                onChange={() => onFilterChange({ availability: 'today' })}
                            />
                            <span className="radio-text">Today</span>
                        </label>

                        <label className="radio-label">
                            <input
                                type="radio"
                                name="availability"
                                checked={filters.availability === 'this_week'}
                                onChange={() => onFilterChange({ availability: 'this_week' })}
                            />
                            <span className="radio-text">This Week</span>
                        </label>

                        <label className="radio-label">
                            <input
                                type="radio"
                                name="availability"
                                checked={!filters.availability}
                                onChange={() => onFilterChange({ availability: undefined })}
                            />
                            <span className="radio-text">Any Time</span>
                        </label>
                    </div>
                </div>

                {/* Teacher Rating filter */}
                <div className="filter-section">
                    <h4>Teacher Rating</h4>
                    <div className="rating-options">
                        {[4, 3, 2, 1].map(rating => (
                            <label className="radio-label" key={rating}>
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={filters.minRating === rating}
                                    onChange={() => onFilterChange({ minRating: rating })}
                                />
                                <span className="radio-text">
                  {rating}+ <span className="star-icon">★</span>
                </span>
                            </label>
                        ))}
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="rating"
                                checked={!filters.minRating}
                                onChange={() => onFilterChange({ minRating: undefined })}
                            />
                            <span className="radio-text">Any Rating</span>
                        </label>
                    </div>
                </div>

                {/* Price filter */}
                <div className="filter-section">
                    <h4>Price Range</h4>
                    <div className="price-range">
                        <div className="price-slider">
                            <input
                                type="range"
                                min="10"
                                max="100"
                                step="5"
                                value={filters.maxPrice || 100}
                                onChange={(e) => onFilterChange({
                                    maxPrice: parseInt(e.target.value)
                                })}
                            />
                            <div className="price-labels">
                                <span>$10</span>
                                <span>$50</span>
                                <span>$100+</span>
                            </div>
                        </div>
                        <div className="current-price">
                            {filters.maxPrice ? (
                                <span>Up to ${filters.maxPrice}/hour</span>
                            ) : (
                                <span>Any price</span>
                            )}
                        </div>
                        {filters.maxPrice && (
                            <button
                                className="reset-price"
                                onClick={() => onFilterChange({ maxPrice: undefined })}
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile-only apply button */}
                <div className="mobile-apply-filters">
                    <button className="apply-button" onClick={applyFilters}>
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherFilters;