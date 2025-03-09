// src/components/features/teachers/TeacherList.tsx
import { useState, useEffect } from 'react';
import TeacherCard, { Teacher } from './TeacherCard';
import TeacherFilters from './TeacherFilters';
import '../../../styles/features/teachers/teacherList.css';

// Mock teacher data - in a real app this would come from an API
const MOCK_TEACHERS: Teacher[] = [
    {
        id: 't1',
        name: 'Sofia Rodriguez',
        profileImage: '/assets/teachers/sofia.jpg',
        coverImage: '/assets/covers/mathematics.jpg',
        description: 'Mathematics expert specializing in calculus and advanced algebra, with a passion for making complex concepts accessible to all students.',
        subjects: ['Mathematics', 'Calculus', 'Statistics'],
        rating: 4.9,
        reviewCount: 128,
        hourlyRate: 45,
        currency: 'USD',
        stats: {
            students: 427,
            courses: 8,
            experience: 12
        },
        availability: {
            nextAvailable: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            availableDays: ['Monday', 'Wednesday', 'Friday']
        },
        badges: ['Top Rated', 'Certified']
    },
    {
        id: 't2',
        name: 'David Chen',
        profileImage: '/assets/teachers/david.jpg',
        coverImage: '/assets/covers/programming.jpg',
        description: 'Computer science instructor with industry experience at top tech companies, teaching programming fundamentals and advanced algorithms.',
        subjects: ['Computer Science', 'Python', 'Data Structures'],
        rating: 4.7,
        reviewCount: 95,
        hourlyRate: 50,
        currency: 'USD',
        stats: {
            students: 312,
            courses: 6,
            experience: 8
        },
        availability: {
            nextAvailable: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
            availableDays: ['Tuesday', 'Thursday', 'Saturday']
        },
        badges: ['Industry Expert']
    },
    {
        id: 't3',
        name: 'Yahir Beras',
        profileImage: '/assets/teachers/yahir.jpg',
        coverImage: '/assets/covers/literature.jpg',
        description: 'Literature and creative writing professor with published works, helping students develop their analytical and composition skills.',
        subjects: ['Literature', 'Creative Writing', 'Essay Composition'],
        rating: 5.0,
        reviewCount: 143,
        hourlyRate: 40,
        currency: 'USD',
        stats: {
            students: 510,
            courses: 12,
            experience: 15
        },
        availability: {
            nextAvailable: new Date(Date.now() + 43200000).toISOString(), // Later today
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        badges: ['Featured', 'Top Rated']
    },
    {
        id: 't4',
        name: 'Emily Johnson',
        profileImage: '/assets/teachers/emily.jpg',
        coverImage: '/assets/covers/physics.jpg',
        description: 'Physics educator with a focus on making theoretical concepts tangible through practical experiments and real-world applications.',
        subjects: ['Physics', 'Mechanics', 'Electromagnetism'],
        rating: 4.8,
        reviewCount: 87,
        hourlyRate: 48,
        currency: 'USD',
        stats: {
            students: 276,
            courses: 5,
            experience: 7
        },
        availability: {
            nextAvailable: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
            availableDays: ['Wednesday', 'Friday', 'Sunday']
        }
    },
    {
        id: 't5',
        name: 'Marcus Williams',
        profileImage: '/assets/teachers/marcus.jpg',
        coverImage: '/assets/covers/music.jpg',
        description: 'Professional musician and instructor teaching piano, music theory, and composition for beginners to advanced students.',
        subjects: ['Music', 'Piano', 'Music Theory'],
        rating: 4.9,
        reviewCount: 156,
        hourlyRate: 55,
        currency: 'USD',
        stats: {
            students: 389,
            courses: 9,
            experience: 18
        },
        availability: {
            nextAvailable: new Date(Date.now() + 518400000).toISOString(), // 6 days from now
            availableDays: ['Monday', 'Thursday', 'Saturday']
        },
        badges: ['Professional Artist']
    },
    {
        id: 't6',
        name: 'Aisha Khan',
        profileImage: '/assets/teachers/aisha.jpg',
        coverImage: '/assets/covers/chemistry.jpg',
        description: 'Chemistry researcher and educator passionate about breaking down complex scientific concepts into understandable lessons.',
        subjects: ['Chemistry', 'Organic Chemistry', 'Biochemistry'],
        rating: 4.6,
        reviewCount: 72,
        hourlyRate: 42,
        currency: 'USD',
        stats: {
            students: 198,
            courses: 4,
            experience: 5
        },
        availability: {
            nextAvailable: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
            availableDays: ['Tuesday', 'Thursday', 'Friday']
        }
    }
];

// Filter options
interface FilterOptions {
    subject?: string;
    availability?: string;
    minRating?: number;
    maxPrice?: number;
    sortBy: 'recommended' | 'rating' | 'price_low' | 'price_high' | 'availability';
}

const TeacherList = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterOptions>({
        sortBy: 'recommended'
    });

    // Simulate API fetch
    useEffect(() => {
        // In a real app, this would be an API call
        const fetchTeachers = () => {
            setLoading(true);

            // Simulate API delay
            setTimeout(() => {
                setTeachers(MOCK_TEACHERS);
                setFilteredTeachers(MOCK_TEACHERS);
                setLoading(false);
            }, 800);
        };

        fetchTeachers();
    }, []);

    // Apply filters when they change
    useEffect(() => {
        if (teachers.length === 0) return;

        let result = [...teachers];

        // Filter by subject
        if (filters.subject) {
            result = result.filter(teacher =>
                teacher.subjects.some(subject =>
                    subject.toLowerCase().includes(filters.subject!.toLowerCase())
                )
            );
        }

        // Filter by minimum rating
        if (filters.minRating) {
            result = result.filter(teacher => teacher.rating >= filters.minRating!);
        }

        // Filter by maximum price
        if (filters.maxPrice) {
            result = result.filter(teacher => teacher.hourlyRate <= filters.maxPrice!);
        }

        // Filter by availability
        if (filters.availability) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (filters.availability === 'today') {
                result = result.filter(teacher => {
                    if (!teacher.availability) return false;
                    const availableDate = new Date(teacher.availability.nextAvailable);
                    availableDate.setHours(0, 0, 0, 0);
                    return availableDate.getTime() === today.getTime();
                });
            } else if (filters.availability === 'this_week') {
                const endOfWeek = new Date(today);
                endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

                result = result.filter(teacher => {
                    if (!teacher.availability) return false;
                    const availableDate = new Date(teacher.availability.nextAvailable);
                    return availableDate >= today && availableDate <= endOfWeek;
                });
            }
        }

        // Apply sorting
        switch (filters.sortBy) {
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'price_low':
                result.sort((a, b) => a.hourlyRate - b.hourlyRate);
                break;
            case 'price_high':
                result.sort((a, b) => b.hourlyRate - a.hourlyRate);
                break;
            case 'availability':
                result.sort((a, b) => {
                    if (!a.availability) return 1;
                    if (!b.availability) return -1;
                    return new Date(a.availability.nextAvailable).getTime() -
                        new Date(b.availability.nextAvailable).getTime();
                });
                break;
            // For recommended, we might use a more complex algorithm
            // For now, let's prioritize top-rated teachers with badges
            case 'recommended':
            default:
                result.sort((a, b) => {
                    // Score based on ratings, badges, and review count
                    const aScore = a.rating * 10 +
                        (a.badges ? a.badges.length * 5 : 0) +
                        Math.min(a.reviewCount, 100) / 10;
                    const bScore = b.rating * 10 +
                        (b.badges ? b.badges.length * 5 : 0) +
                        Math.min(b.reviewCount, 100) / 10;
                    return bScore - aScore;
                });
                break;
        }

        setFilteredTeachers(result);
    }, [filters, teachers]);

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters
        }));
    };

    return (
        <div className="teacher-list-container">
            <div className="list-header">
                <h2>Find Your Perfect Teacher</h2>
                <p>Browse our qualified instructors and find the right match for your learning goals</p>
            </div>

            <div className="teacher-list-content">
                <aside className="filter-sidebar">
                    <TeacherFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </aside>

                <div className="teacher-results">
                    <div className="results-header">
                        <p className="results-count">
                            Showing {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'}
                        </p>

                        <div className="sort-controls">
                            <label htmlFor="sort-select">Sort by:</label>
                            <select
                                id="sort-select"
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange({
                                    sortBy: e.target.value as FilterOptions['sortBy']
                                })}
                            >
                                <option value="recommended">Recommended</option>
                                <option value="rating">Highest Rated</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="availability">Earliest Available</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Finding the best teachers for you...</p>
                        </div>
                    ) : filteredTeachers.length === 0 ? (
                        <div className="empty-state">
                            <h3>No teachers found</h3>
                            <p>Try adjusting your filters to see more results</p>
                            <button
                                className="reset-filters"
                                onClick={() => setFilters({ sortBy: 'recommended' })}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="teacher-grid">
                            {filteredTeachers.map((teacher, index) => (
                                <TeacherCard
                                    key={teacher.id}
                                    teacher={teacher}
                                    featured={index === 0 && filters.sortBy === 'recommended'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherList;