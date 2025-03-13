// src/components/home/CarouselBanner.tsx
import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import river from '../../assets/images/river.jpg';
import park from '../../assets/images/park.jpg';
import nature from '../../assets/images/nature.jpg';
import '../../styles/home/carouselBanner.css';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    backgroundImage: string;
    buttonText: string;
    buttonLink: string;
    image: string;
}

interface CarouselBannerProps {
    children?: ReactNode;
}

const CarouselBanner = ({ children }: CarouselBannerProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Sample slides data - in a real app, this would come from a CMS or API
    const slides: Slide[] = [
        {
            id: 1,
            title: 'Welcome To EduGuiders',
            subtitle: 'Get to manage your dreamed skill with wonderful instructors and resources',
            backgroundImage: '/assets/images/banner1.jpg',
            buttonText: 'Get Started',
            buttonLink: '#explore',
            image: park
        },
        {
            id: 2,
            title: 'Find Your EduGuider',
            subtitle: 'Connect with expert educators who can help you achieve your learning goals',
            backgroundImage: '/assets/images/banner2.jpg',
            buttonText: 'Browse Teachers',
            buttonLink: '/teachers',
            image: nature
        },
        {
            id: 3,
            title: 'Learn At Your Own Pace',
            subtitle: 'Flexible scheduling and personalized learning paths for every student',
            backgroundImage: '/assets/images/banner3.jpg',
            buttonText: 'Explore Courses',
            buttonLink: '/cons/courses',
            image: park
        },
        {
            id: 3,
            title: 'Do not take our words',
            subtitle: 'See what our users have to say instead',
            backgroundImage: '/assets/images/banner3.jpg',
            buttonText: 'See Testimonies',
            buttonLink: '#testimonies',
            image: river
        },
    ];

    const sections: string[] = [
        "#explore",
        "#testimonies"
    ]

    // Navigation functions
    const goToNextSlide = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

        // Reset transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    }, [isTransitioning, slides.length]);

    const goToPrevSlide = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

        // Reset transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    }, [isTransitioning, slides.length]);

    const goToSlide = (index: number) => {
        if (isTransitioning || index === currentSlide) return;

        setIsTransitioning(true);
        setCurrentSlide(index);

        // Reset transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    };

    const handleScroll = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, element: string) => {
        event.preventDefault();
        const section = document.getElementById(element.slice(1));
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    }

    // Autoplay functionality
    useEffect(() => {
        const interval = setInterval(() => {
            goToNextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [goToNextSlide]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrevSlide();
            } else if (e.key === 'ArrowRight') {
                goToNextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNextSlide, goToPrevSlide]);

    return (
        <section
            className="carousel-banner"
            aria-roledescription="carousel"
            aria-label="Featured content"
        >`
            <div className="slides-container">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide ${index === currentSlide ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                        aria-hidden={index !== currentSlide}
                    >
                        <div className="slide-content">
                            <h1>{slide.title}</h1>
                            <p>{slide.subtitle}</p>
                            { sections.includes(slide.buttonLink) ?
                                <a href={slide.buttonLink} className="cta-button"
                                   onClick= {(event) => handleScroll(event, slide.buttonLink) }>{slide.buttonText}
                                </a>
                                :
                                <Link to={slide.buttonLink} className="cta-button">
                                    {slide.buttonText}
                                </Link>
                            }

                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation controls */}
            <div className="carousel-controls">
                <button
                    className="nav-arrow prev"
                    onClick={goToPrevSlide}
                    aria-label="Previous slide"
                >
                    <span aria-hidden="true">‹</span>
                </button>

                <div className="slide-indicators">
                    {slides.map((slide, index) => (
                        <button
                            key={`indicator-${slide.id}`}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === currentSlide}
                        />
                    ))}
                </div>

                <button
                    className="nav-arrow next"
                    onClick={goToNextSlide}
                    aria-label="Next slide"
                >
                    <span aria-hidden="true">›</span>
                </button>
            </div>

            {/* Welcome message or other children */}
            {children && (
                <div className="carousel-footer">
                    <div className="carousel-footer-content">
                        {children}
                    </div>
                </div>
            )}
        </section>
    );
};

export default CarouselBanner;