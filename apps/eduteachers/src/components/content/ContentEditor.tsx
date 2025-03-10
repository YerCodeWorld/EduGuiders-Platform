// src/components/content/ContentEditor.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Post } from '../../types';
import { useTeachers } from '../../contexts';
import '../../styles/pages/contentEditor.css';

interface ContentEditorProps {
    post?: Post; // Undefined for new posts
    teacherId: string;
    onCancel: () => void;
    onSave: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
                                                         post,
                                                         teacherId,
                                                         onCancel,
                                                         onSave
                                                     }) => {
    const { createPost, updatePost } = useTeachers();

    // Form state
    const [title, setTitle] = useState<string>('');
    const [snippet, setSnippet] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [type, setType] = useState<'article' | 'video'>('article');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [link, setLink] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Initialize form with post data if editing
    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setSnippet(post.snippet || '');
            setContent(post.content || '');
            setType(post.type || 'article');
            setImageUrl(post.image || '');
            setLink(post.link || '');
        } else {
            // Default values for new post
            setTitle('');
            setSnippet('');
            setContent('');
            setType('article');
            setImageUrl('/api/placeholder/400/250');
            setLink('');
        }
    }, [post]);

    // Validate form data
    const validateForm = useCallback((): boolean => {
        const errors: string[] = [];

        if (!title.trim()) {
            errors.push('Title is required');
        }

        if (!snippet.trim()) {
            errors.push('Snippet/summary is required');
        }

        if (type === 'article' && !content.trim()) {
            errors.push('Content is required for articles');
        }

        if (type === 'video' && !link.trim()) {
            errors.push('Link is required for videos');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    }, [title, snippet, content, type, link]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        try {
            // Prepare post data
            const postData = {
                title,
                snippet,
                content,
                type,
                image: imageUrl,
                link,
                date: new Date().toISOString() // Use current date for new posts
            };

            let success: boolean;

            if (post) {
                // Update existing post
                success = await updatePost(teacherId, post.id, postData);
            } else {
                // Create new post
                success = await createPost(teacherId, postData);
            }

            if (success) {
                onSave(); // Notify parent component of successful save
            }
        } catch (error) {
            console.error('Error saving post:', error);
            setValidationErrors(['Failed to save post. Please try again.']);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle image upload (simulated)
    const handleImageUpload = () => {
        // In a real app, this would open a file picker and upload to a server
        // For now, we'll use a placeholder image
        const placeholderUrl = `/api/placeholder/400/250?t=${Date.now()}`;
        setImageUrl(placeholderUrl);
    };

    return (
        <div className="content-editor">
            <div className="editor-header">
                <h2>{post ? 'Edit Content' : 'Create New Content'}</h2>
            </div>

            {validationErrors.length > 0 && (
                <div className="validation-errors">
                    <ul>
                        {validationErrors.map((error, index) => (
                            <li key={index} className="error-message">{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="editor-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Content Type</label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as 'article' | 'video')}
                    >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="snippet">Summary</label>
                    <textarea
                        id="snippet"
                        value={snippet}
                        onChange={(e) => setSnippet(e.target.value)}
                        placeholder="Brief summary or preview"
                        rows={2}
                        required
                    />
                </div>

                {type === 'article' && (
                    <div className="form-group">
                        <label htmlFor="content">Article Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter the full article content"
                            rows={10}
                            required
                        />
                    </div>
                )}

                {type === 'video' && (
                    <div className="form-group">
                        <label htmlFor="link">Video Link</label>
                        <input
                            id="link"
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="Enter the video URL (YouTube, Vimeo, etc.)"
                            required
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>Featured Image</label>
                    <div className="image-preview">
                        <img src={imageUrl} alt="Featured image preview" />
                        <button
                            type="button"
                            className="upload-image-btn"
                            onClick={handleImageUpload}
                        >
                            <i className="fas fa-upload"></i> Change Image
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="save-btn"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : post ? 'Update Content' : 'Create Content'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContentEditor;