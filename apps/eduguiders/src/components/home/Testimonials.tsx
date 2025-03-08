// src/components/home/Testimonials.tsx
import { useState, useEffect, useCallback } from 'react';
import '../../styles/home/testimonials.css';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    avatar: string;
    quote: string;
    affiliation?: string;
}

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Sample testimonials data - would come from an API in a real application
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Sarah J.',
            role: 'EduExplorer',
            avatar: '/assets/avatars/student1.jpg',
            quote: 'Finding the right math teacher changed everything for me. I went from struggling with algebra to acing calculus in just one semester!',
            affiliation: 'Computer Science Major'
        },
        {
            id: 2,
            name: 'Michael T.',
            role: 'EduGuider',
            avatar: '/assets/avatars/teacher1.jpg',
            quote: 'As an educator, I\'ve found an amazing community of students eager to learn. The platform makes scheduling and communication seamless.',
            affiliation: 'Physics Instructor'
        },
        {
            id: 3,
            name: 'Elena R.',
            role: 'Parent',
            avatar: '/assets/avatars/parent1.jpg',
            quote: 'My daughter\'s confidence has skyrocketed since finding her Spanish tutor on this platform. The quality of teachers here is exceptional.',
        },
        {
            id: 4,
            name: 'Dr. James W.',
            role: 'EduGuider',
            avatar: '/assets/avatars/teacher2.jpg',
            quote: 'After 20 years in academia, I wanted to reach more students. This platform has allowed me to connect with learners from around the world.',
            affiliation: 'History Professor'
        },
        {
            id: 5,
            name: 'Aisha K.',
            role: 'EduExplorer',
            avatar: '/assets/avatars/student2.jpg',
            quote: 'The personalized approach to learning has made all the difference. My piano skills have improved dramatically in just a few months.',
            affiliation: 'Music Enthusiast'
        },
    ];

    // Function to go to the next slide
    const goToNext = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setActiveIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );

        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    }, [isTransitioning, testimonials.length]);

    // Function to go to the previous slide
    const goToPrev = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );

        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    }, [isTransitioning, testimonials.length]);

    // Function to go to a specific slide
    const goToSlide = (index: number) => {
        if (isTransitioning || index === activeIndex) return;

        setIsTransitioning(true);
        setActiveIndex(index);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    };

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 8000);

        return () => clearInterval(interval);
    }, [goToNext]);

    return (
        <section id="testimonies" className="testimonials-section">
            <div className="testimonials-header">
                <h2>What Our Community Says</h2>
                <p>Hear from students, teachers, and parents who have found success on our platform</p>
            </div>

            <div className="testimonials-carousel">
                <div className="testimonial-container">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className={`testimonial-card ${index === activeIndex ? 'active' : ''} ${
                                isTransitioning ? 'transitioning' : ''
                            }`}
                        >
                            <div className="testimonial-content">
                                <blockquote>
                                    <p className="quote">{testimonial.quote}</p>
                                </blockquote>
                                <div className="testimonial-author">
                                    <div className="author-avatar">
                                        <img src={testimonial.avatar} alt={testimonial.name} />
                                    </div>
                                    <div className="author-info">
                                        <h3 className="author-name">{testimonial.name}</h3>
                                        <p className="author-role">{testimonial.role}</p>
                                        {testimonial.affiliation && (
                                            <p className="author-affiliation">{testimonial.affiliation}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="testimonial-controls">
                    <button
                        className="control-arrow prev"
                        onClick={goToPrev}
                        aria-label="Previous testimonial"
                    >
                        <span aria-hidden="true">&#8249;</span>
                    </button>

                    <div className="testimonial-indicators">
                        {testimonials.map((_, index) => (
                            <button
                                key={`indicator-${index}`}
                                className={`indicator ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to testimonial ${index + 1}`}
                                aria-current={index === activeIndex}
                            />
                        ))}
                    </div>

                    <button
                        className="control-arrow next"
                        onClick={goToNext}
                        aria-label="Next testimonial"
                    >
                        <span aria-hidden="true">&#8250;</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;