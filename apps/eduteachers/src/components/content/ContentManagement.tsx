// src/pages/content/ContentManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '@repo/ui/contexts/AuthContext';
import { useTeachers } from '../../contexts';
import { Post } from '@/types';
import ContentEditor from './ContentEditor.tsx';
import '../../styles/pages/contentManagement.css';

const ContentManagement: React.FC = () => {
    const { user } = useAuth();
    const { getTeacher, deletePost } = useTeachers();
    // const navigate = useNavigate(); <- We are not using this yet

    // Component state
    const [teacherPosts, setTeacherPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterType, setFilterType] = useState<'all' | 'article' | 'video'>('all');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // Load teacher's posts
    useEffect(() => {
        const fetchTeacherPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!user?.id) {
                    console.log(Error('User not authenticated'));
                    return;
                }

                const teacher = getTeacher(user.id);
                if (!teacher) {
                    console.log(Error('Teacher profile not found'));
                    return;
                }

                setTeacherPosts(teacher.posts || []);
            } catch (err) {
                console.error('Error loading teacher posts:', err);
                setError('Failed to load your content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherPosts();
    }, [user, getTeacher]);

    // Calculate filtered posts based on search and filter criteria
    const filteredPosts = teacherPosts.filter(post => {
        const matchesSearch = (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.snippet.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const matchesType = filterType === 'all' || post.type === filterType;

        return matchesSearch && matchesType;
    });

    // Sort posts by date (newest first)
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Open editor for creating a new post
    const handleCreateNew = () => {
        setSelectedPost(undefined);
        setIsEditorOpen(true);
    };

    // Open editor for editing an existing post
    const handleEdit = (post: Post) => {
        setSelectedPost(post);
        setIsEditorOpen(true);
    };

    // Show delete confirmation dialog
    const handleDeleteClick = (postId: string) => {
        setShowDeleteConfirm(postId);
    };

    // Handle actual deletion
    const handleConfirmDelete = async (postId: string) => {
        try {
            if (!user?.id) return;

            const success = await deletePost(user.id, postId);

            if (success) {
                // Update local state to reflect deletion
                setTeacherPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            setError('Failed to delete content. Please try again.');
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    // Handle editor close
    const handleEditorClose = useCallback(() => {
        setIsEditorOpen(false);
        setSelectedPost(undefined);
    }, []);

    // Handle editor save
    const handleEditorSave = useCallback(async () => {
        // After successful save, refresh the teacher data
        try {
            if (!user?.id) return;

            const teacher = getTeacher(user.id);
            if (teacher) {
                setTeacherPosts(teacher.posts || []);
            }

            setIsEditorOpen(false);
            setSelectedPost(undefined);
        } catch (err) {
            console.error('Error refreshing content:', err);
        }
    }, [user, getTeacher]);

    // Format date for display
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // If editor is open, show only the editor
    if (isEditorOpen) {
        return (
            <div className="content-management-page">
                <ContentEditor
                    teacherId={user?.id || ''}
                    post={selectedPost}
                    onCancel={handleEditorClose}
                    onSave={handleEditorSave}
                />
            </div>
        );
    }

    // Main content management view
    return (
        <div className="content-management-page">
            <div className="content-header">
                <h1>My Educational Content</h1>
                <button
                    className="create-content-btn"
                    onClick={handleCreateNew}
                >
                    <i className="fas fa-plus"></i> Create New Content
                </button>
            </div>

            {error && (
                <div className="error-message">{error}</div>
            )}

            <div className="content-filters">
                <div className="search-container">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search your content..."
                        className="search-input"
                    />
                </div>

                <div className="filter-container">
                    <label htmlFor="type-filter">Show:</label>
                    <select
                        id="type-filter"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'article' | 'video')}
                        className="type-filter"
                    >
                        <option value="all">All Content</option>
                        <option value="article">Articles Only</option>
                        <option value="video">Videos Only</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-message">Loading your content...</div>
            ) : sortedPosts.length === 0 ? (
                <div className="empty-content">
                    <div className="empty-icon">
                        <i className="fas fa-file-alt"></i>
                    </div>
                    <h2>No Content Found</h2>
                    {searchTerm || filterType !== 'all' ? (
                        <p>No content matches your search criteria. Try adjusting your filters or creating new content.</p>
                    ) : (
                        <p>You have not created any educational content yet. Click the button above to get started!</p>
                    )}
                </div>
            ) : (
                <div className="content-list">
                    {sortedPosts.map(post => (
                        <div key={post.id} className="content-item">
                            <div className="content-image">
                                <img src={post.image} alt={post.title} />
                                <div className="content-type-badge">
                                    <i className={`fas fa-${post.type === 'EduArticle' ? 'file-alt' : 'video'}`}></i>
                                    {post.type === 'EduArticle' ? 'Article' : 'Video'}
                                </div>
                            </div>

                            <div className="content-details">
                                <h3 className="content-title">{post.title}</h3>
                                <p className="content-date">Published: {formatDate(post.date)}</p>
                                <p className="content-snippet">{post.snippet}</p>
                            </div>

                            <div className="content-actions">
                                <button
                                    className="action-btn view-btn"
                                    onClick={() => window.open(post.link || '#', '_blank')}
                                    title="View content"
                                >
                                    <i className="fas fa-eye"></i>
                                </button>

                                <button
                                    className="action-btn edit-btn"
                                    onClick={() => handleEdit(post)}
                                    title="Edit content"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>

                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => handleDeleteClick(post.id)}
                                    title="Delete content"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>

                                {showDeleteConfirm === post.id && (
                                    <div className="delete-confirmation">
                                        <p>Are you sure you want to delete this content?</p>
                                        <div className="confirmation-actions">
                                            <button
                                                className="confirm-btn"
                                                onClick={() => handleConfirmDelete(post.id)}
                                            >
                                                Yes, Delete
                                            </button>

                                            <button
                                                className="cancel-btn"
                                                onClick={() => setShowDeleteConfirm(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentManagement;