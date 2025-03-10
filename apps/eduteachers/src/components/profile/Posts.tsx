// src/components/profile/Posts.tsx
import React, { useState } from 'react';
import { Post, PostType } from '@/types';
import '../../styles/components/profile/posts.css';

interface PostsProps {
    // Uh? Is there the possibility to edit the posts?
    posts: Post[];
    teacherId: string;
    isEditable: boolean | undefined;
}

const Posts: React.FC<PostsProps> = ({ posts, isEditable }) => {
    // State for filtering posts
    const [activeFilter, setActiveFilter] = useState<'all' | PostType>('all');

    // Filter posts based on type
    const filteredPosts = activeFilter === 'all'
        ? posts
        : posts.filter(post => post.type === activeFilter);

    // Handler for filter changes
    const handleFilterChange = (filter: 'all' | PostType) => {
        setActiveFilter(filter);
    };

    // Format post date for display
    const formatPostDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (posts.length === 0) {
        return null; // Don't show section if there are no posts
    }

    return (
        <section id="posts" className="posts-section">
            <div className="container">
                <div className="posts-header">
                    <h2>Educational Resources</h2>
                    {isEditable && (
                        <button className="edit-posts-btn">
                            <i className="fas fa-edit"></i> Edit Resources
                        </button>
                    )}
                </div>

                <div className="section-intro">
                    <p>Explore my latest educational content and resources</p>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === 'video' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('video')}
                        >
                            Videos
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === 'article' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('article')}
                        >
                            Articles
                        </button>
                    </div>
                </div>

                <div className="posts-grid">
                    {filteredPosts.length === 0 ? (
                        <p className="no-posts">No resources available for the selected filter.</p>
                    ) : (
                        filteredPosts.map(post => (
                            <article key={post.id} className="post-card" data-type={post.type}>
                                <div className="post-image">
                                    <img src={post.image} alt={post.title} />
                                    <div className="post-type">
                                        <i className={`fas fa-${post.type === 'video' ? 'play-circle' : 'file-alt'}`}></i>
                                    </div>
                                </div>
                                <div className="post-content">
                                    <span className="post-date">{formatPostDate(post.date)}</span>
                                    <h3>{post.title}</h3>
                                    <p>{post.snippet}</p>
                                    <a href={post.link} className="post-link" target="_blank" rel="noopener noreferrer">
                                        {post.type === 'video' ? 'Watch Video' : 'Read Article'} <i className="fas fa-arrow-right"></i>
                                    </a>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {posts.length > 3 && (
                    <div className="posts-actions">
                        <a href="#" className="btn-secondary">View All Resources</a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Posts;