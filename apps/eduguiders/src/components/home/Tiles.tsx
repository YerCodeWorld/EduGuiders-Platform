// src/components/home/Tiles.tsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import teaching from '../../assets/images/teaching.jpg';
import articles from '../../assets/images/articles.png';
import competition from '../../assets/images/compete.jpg';
import discussion from '../../assets/images/discussion.jpg';
import games from '../../assets/images/games.jpg';
import courses from '../../assets/images/courses.jpg';

import '../../styles/home/tiles.css';

interface TileItem {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    color: string;
}

const Tiles = () => {
    const tilesRef = useRef<HTMLElement>(null);

    // Tile data - in a production app, this would come from an API or CMS
    const tilesData: TileItem[] = [
        {
            id: 'teachers',
            title: 'EduGuiders',
            description: 'Connect with top-rated professional educators',
            image: teaching,
            link: '/teachers',
            color: '#8d82c4',
        },
        {
            id: 'courses',
            title: 'EduCourses',
            description: 'Follow specialized learning paths designed by experts',
            image: courses,
            link: '/cons/courses',
            color: '#ec8d81',
        },
        {
            id: 'articles',
            title: 'EduBLog',
            description: 'Read in-depth articles from educators and experts',
            image: articles,
            link: '/cons/blog',
            color: '#6fc3df',
        },
        {
            id: 'games',
            title: 'EduGames',
            description: 'Make learning fun through educational games',
            image: games,
            link: '/cons/games',
            color: '#e7b788',
        },
        {
            id: 'compete',
            title: 'EduMatch',
            description: 'Challenge yourself in academic competitions',
            image: competition,
            link: '/cons/compete',
            color: '#8ea9e8',
        },
        {
            id: 'discussion',
            title: 'EduChat',
            description: 'Join the community and share your ideas',
            image: discussion,
            link: '/cons/discuss',
            color: '#87c5a4',
        },
    ];

    // Add animation effects when tiles come into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        // Observe all tile articles
        if (tilesRef.current) {
            const tileElements = tilesRef.current.querySelectorAll('.tile-article');
            tileElements.forEach((tile) => {
                observer.observe(tile);
            });
        }

        return () => {
            if (tilesRef.current) {
                const tileElements = tilesRef.current.querySelectorAll('.tile-article');
                tileElements.forEach((tile) => {
                    observer.unobserve(tile);
                });
            }
        };
    }, []);

    return (
        <section id="explore" className="tiles-section" ref={tilesRef}>
            <div className="section-header">
                <h2>Explore Our Platform</h2>
                <p>Discover all the ways EduGuiders can help you learn and grow</p>
            </div>

            <div className="tiles-container">
                {tilesData.map((tile) => (
                    <article
                        key={tile.id}
                        className="tile-article"
                        style={{
                            backgroundImage: `url(${tile.image})`,
                        }}
                        data-color={tile.color}
                    >
                        <span className="tile-background" style={{ backgroundColor: tile.color }}></span>
                        <div className="tile-content">
                            <header>
                                <h3>{tile.title}</h3>
                                <p>{tile.description}</p>
                            </header>
                            <Link to={tile.link} className="tile-link" aria-label={`Learn more about ${tile.title}`}>
                                <span className="link-text">Learn More</span>
                                <span className="link-icon" aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Tiles;