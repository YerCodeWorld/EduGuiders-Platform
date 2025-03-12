// src/components/home/Statistics.tsx
import { useState, useEffect, useRef } from 'react';
import '../../styles/home/statistics.css';

interface StatItem {
    id: string;
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    icon: string;
}

const Statistics = () => {
    // Track whether counting animation has started
    const [animationStarted, setAnimationStarted] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Statistics data
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stats: StatItem[] = [
        {
            id: 'teachers',
            label: 'Expert Teachers',
            value: 0,
            prefix: '+',
            duration: 2000,
            icon: 'teacher-icon',
        },
        {
            id: 'students',
            label: 'Active Students',
            value: 0,
            prefix: '+',
            duration: 2500,
            icon: 'student-icon',
        },
        {
            id: 'courses',
            label: 'Courses',
            value: 0,
            duration: 1800,
            icon: 'course-icon',
        },
        {
            id: 'countries',
            label: 'Countries',
            value: 0,
            duration: 1500,
            icon: 'globe-icon',
        },
        {
            id: 'satisfaction',
            label: 'Satisfaction Rate',
            value: 0,
            suffix: '%',
            duration: 2200,
            icon: 'star-icon',
        },
        {
            id: 'classes',
            label: 'Classes Completed',
            value: 0,
            prefix: '+',
            duration: 2800,
            icon: 'class-icon',
        },
    ];

    // State for tracking counted values during animation
    const [countedValues, setCountedValues] = useState<Record<string, number>>(
        stats.reduce((acc, stat) => ({ ...acc, [stat.id]: 0 }), {})
    );

    // Intersection Observer to trigger counting animation when section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {

                if (entries[0]) {
                    if (entries[0].isIntersecting && !animationStarted) {
                        setAnimationStarted(true);
                    }
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [animationStarted]);

    // Counting animation effect
    useEffect(() => {
        if (!animationStarted) return;

        // For each stat, animate the count from 0 to the target value
        const animators = stats.map((stat) => {
            // Calculate the increment value based on duration and desired smoothness
            const fps = 30;
            const totalFrames = (stat.duration || 2000) / (1000 / fps);
            const incrementValue = stat.value / totalFrames;

            let frame = 0;
            let currentValue = 0;

            const animator = setInterval(() => {
                frame++;
                currentValue = Math.min(stat.value, Math.floor(incrementValue * frame));

                setCountedValues((prev) => ({
                    ...prev,
                    [stat.id]: currentValue,
                }));

                if (currentValue >= stat.value) {
                    clearInterval(animator);
                }
            }, 1000 / fps);

            return animator;
        });

        // Cleanup on unmount
        return () => {
            animators.forEach((animator) => clearInterval(animator));
        };
    }, [animationStarted, stats]);

    return (
        <section className="statistics-section" ref={sectionRef}>
            <div className="statistics-header">
                <h2>Our Impact by the Numbers</h2>
                <p>Growing stronger every day with educators and learners from around the world</p>
            </div>

            <div className="statistics-grid">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        className={`statistic-card ${animationStarted ? 'animated' : ''}`}
                        style={{ animationDelay: `${stats.indexOf(stat) * 0.1}s` }}
                    >
                        <div className={`stat-icon ${stat.icon}`} aria-hidden="true"></div>
                        <div className="stat-content">
                            <div className="stat-value">
                                <span className="prefix">{stat.prefix || ''}</span>
                                <span className="number">
                  {animationStarted
                      ? countedValues[stat.id].toLocaleString()
                      : '0'}
                </span>
                                <span className="suffix">{stat.suffix || ''}</span>
                            </div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Statistics;