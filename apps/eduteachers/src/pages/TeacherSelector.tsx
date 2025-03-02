// src/pages/TeacherSelector.tsx
import React, { useState, useEffect } from 'react';
import { useTeachers } from '../contexts/index.ts';
import { TeacherCard } from '../components/TeacherCard';
import TeacherFilters from '../components/TeacherFilters';
import '../styles/pages/teacherSelector.css';

const TeacherSelector: React.FC = () => {
    const { teachers, loading } = useTeachers();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('rating');

    // Filter teachers based on search term and subject filter
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.title.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;

        // Check if any expertise area matches the filter
        const matchesFilter = teacher.bio.expertiseAreas.some(
            area => area.name.toLowerCase().includes(filter.toLowerCase())
        );

        return matchesSearch && matchesFilter;
    });

    // Sort teachers
    const sortedTeachers = [...filteredTeachers].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'reviewCount':
                return (b.reviewCount || 0) - (a.reviewCount || 0);
            case 'nameAsc':
                return a.name.localeCompare(b.name);
            case 'nameDesc':
                return b.name.localeCompare(a.name);
            default:
                return (b.rating || 0) - (a.rating || 0);
        }
    });

    // Get unique subjects for filter dropdown
    const allSubjects = new Set<string>();
    teachers.forEach(teacher => {
        teacher.bio.expertiseAreas.forEach(area => {
            allSubjects.add(area.name);
        });
    });

    // Update document title
    useEffect(() => {
        document.title = 'Find Teachers | EduTeachers';
    }, []);

    // Handle search input change

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };


    // Handle filter change
    const handleFilterChange = (value: string) => {
        setFilter(value);
    };

    // Handle sort change
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    return (
        <div className="teacher-list-container">
            <div className="list-header">
                <h2>Welcome to EduTeachers</h2>
                <p>Browse our expert educators and find the right match for your learning needs</p>
            </div>

            <div className="teacher-list-content">
                {/* Filters sidebar */}
                <TeacherFilters
                    subjects={Array.from(allSubjects)}
                    selectedSubject={filter}
                    onSubjectChange={handleFilterChange}
                />

                {/* Results section */}
                <div className="teacher-results">
                    <div className="results-header">
                        <p className="results-count">
                            {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'} found
                        </p>

                        <div className="sort-controls">
                            <label htmlFor="sort-select">Sort by:</label>
                            <select
                                id="sort-select"
                                value={sortBy}
                                onChange={handleSortChange}
                            >
                                <option value="rating">Highest Rating</option>
                                <option value="reviewCount">Most Reviews</option>
                                <option value="nameAsc">Name (A-Z)</option>
                                <option value="nameDesc">Name (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading teachers...</p>
                        </div>
                    ) : sortedTeachers.length === 0 ? (
                        <div className="empty-state">
                            <h3>No teachers found</h3>
                            <p>Try adjusting your filters or search term</p>
                            <button
                                className="reset-filters"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilter('all');
                                    setSortBy('rating');
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="teacher-grid">
                            {sortedTeachers.map(teacher => (
                                <TeacherCard
                                    key={teacher.id}
                                    teacher={teacher}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherSelector;