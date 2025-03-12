// src/components/profile/Posts.tsx
import React, { useState, useEffect } from 'react';
import { Post, PostType } from '@/types';
import { useTeachers } from '../../contexts';
import '../../styles/components/profile/posts.css';

interface PostsProps {
    posts: Post[];
    isEditable: boolean;
    teacherId: string;
}

const Posts: React.FC<PostsProps> = ({ posts, isEditable, teacherId }) => {
    const { deletePost } = useTeachers();

    // State for filtering posts
    const [activeFilter, setActiveFilter] = useState<'all' | PostType>('all');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
    const [showAll, setShowAll] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Number of posts to show by default
    const DEFAULT_DISPLAY_COUNT = 3;

    // Update filtered posts when the active filter or posts change
    useEffect(() => {
        const newFilteredPosts = activeFilter === 'all'
            ? posts
            : posts.filter(post => post.type === activeFilter);

        setFilteredPosts(newFilteredPosts);

        // Reset the displayed posts
        setDisplayedPosts(
            newFilteredPosts.length > DEFAULT_DISPLAY_COUNT && !showAll
                ? newFilteredPosts.slice(0, DEFAULT_DISPLAY_COUNT)
                : newFilteredPosts
        );
    }, [activeFilter, posts, showAll]);

    // Handler for filter changes
    const handleFilterChange = (filter: 'all' | PostType) => {
        setActiveFilter(filter);
        setShowAll(false); // Reset showing all posts when changing filters
    };

    // Toggle showing all posts
    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    // Handle delete post button click
    const handleDeleteClick = (postId: string) => {
        setShowDeleteConfirm(postId);
    };

    // Handle confirmed deletion
    const handleConfirmDelete = async (postId: string) => {
        setIsDeleting(true);
        setError(null);

        try {
            const success = await deletePost(teacherId, postId);

            if (success) {
                // The parent component should receive the updated posts list
                // through the TeachersContext and props will update
                setShowDeleteConfirm(null);
            } else {
                setError('Failed to delete post. Please try again.');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            setError('An error occurred while deleting the post.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Cancel delete
    const handleCancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    // Format post date for display
    const formatPostDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Navigate to content management page
    const navigateToContentManager = () => {
        window.location.href = '/teacher/content';
    };

    if (posts.length === 0) {
        return (
            <section id="posts" className="posts-section">
                <div className="container">
                    <div className="posts-header">
                        <h2>Educational Resources</h2>
                        {isEditable && (
                            <button
                                className="edit-posts-btn"
                                onClick={navigateToContentManager}
                            >
                                <i className="fas fa-edit"></i> Manage Resources
                            </button>
                        )}
                    </div>

                    <div className="empty-posts">
                        <p>No educational resources have been shared yet.</p>
                        {isEditable && (
                            <button
                                className="create-post-btn"
                                onClick={navigateToContentManager}
                            >
                                <i className="fas fa-plus"></i> Create New Resource
                            </button>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="posts" className="posts-section">
            <div className="container">
                <div className="posts-header">
                    <h2>Educational Resources</h2>
                    {isEditable && (
                        <button
                            className="edit-posts-btn"
                            onClick={navigateToContentManager}
                        >
                            <i className="fas fa-edit"></i> Manage Resources
                        </button>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

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
                            className={`filter-btn ${activeFilter === 'EduVideo' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('EduVideo')}
                        >
                            Videos
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === 'EduArticle' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('EduArticle')}
                        >
                            Articles
                        </button>
                    </div>
                </div>

                <div className="posts-grid">
                    {displayedPosts.length === 0 ? (
                        <p className="no-posts">No resources available for the selected filter.</p>
                    ) : (
                        displayedPosts.map(post => (
                            <article key={post.id} className="post-card" data-type={post.type}>
                                <div className="post-image">
                                    <img src={post.image} alt={post.title} />
                                    <div className="post-type">
                                        <i className={`fas fa-${post.type === 'EduVideo' ? 'play-circle' : 'file-alt'}`}></i>
                                    </div>

                                    {isEditable && (
                                        <div className="post-actions">
                                            <button
                                                className="post-action edit"
                                                onClick={() => navigateToContentManager()}
                                                title="Edit resource"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>

                                            <button
                                                className="post-action delete"
                                                onClick={() => handleDeleteClick(post.id)}
                                                title="Delete resource"
                                                disabled={isDeleting}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>

                                            {showDeleteConfirm === post.id && (
                                                <div className="delete-confirmation">
                                                    <p>Are you sure you want to delete this resource?</p>
                                                    <div className="confirmation-actions">
                                                        <button
                                                            className="confirm-delete"
                                                            onClick={() => handleConfirmDelete(post.id)}
                                                            disabled={isDeleting}
                                                        >
                                                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                                        </button>

                                                        <button
                                                            className="cancel-delete"
                                                            onClick={handleCancelDelete}
                                                            disabled={isDeleting}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="post-content">
                                    <span className="post-date">{formatPostDate(post.date)}</span>
                                    <h3>{post.title}</h3>
                                    <p>{post.snippet}</p>
                                    <a
                                        href={post.link || '#'}
                                        className="post-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {post.type === 'EduVideo' ? 'Watch Video' : 'Read Article'} <i className="fas fa-arrow-right"></i>
                                    </a>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {filteredPosts.length > DEFAULT_DISPLAY_COUNT && (
                    <div className="posts-actions">
                        <button
                            className="btn-secondary view-all-btn"
                            onClick={toggleShowAll}
                        >
                            {showAll ? 'Show Less' : `View All Resources (${filteredPosts.length})`}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Posts;