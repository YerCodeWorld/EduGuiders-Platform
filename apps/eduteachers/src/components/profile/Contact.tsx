// src/components/profile/Contact.tsx
import React, { useState, useEffect } from 'react';
import { ContactInfo } from '@/types';
import { useAuth } from '@repo/ui/contexts/AuthContext';
import { useTeachers } from '../../contexts';
import '../../styles/components/profile/contact.css';

interface ContactProps {
    contact: ContactInfo;
    teacherId: string;
    teacherName: string;
    isEditable: boolean;
    isEditing: boolean;
    onEditToggle: () => void;
}

const Contact: React.FC<ContactProps> = ({
                                             contact,
                                             teacherId,
                                             teacherName,
                                             isEditable,
                                             isEditing,
                                             onEditToggle
                                         }) => {
    const { user } = useAuth();
    const { updateTeacherSection } = useTeachers();

    // State for viewing contact information
    const [showContactInfo, setShowContactInfo] = useState<boolean>(false);

    // State for contact form
    const [name, setName] = useState<string>(user?.name || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // State for chat widget
    const [chatOpen, setChatOpen] = useState<boolean>(false);
    const [chatMessages, setChatMessages] = useState<Array<{
        text: string;
        sender: 'user' | 'teacher';
        time: string;
    }>>([
        {
            text: `Hi there! This is ${teacherName}. How can I help you today?`,
            sender: 'teacher',
            time: 'Just now'
        }
    ]);
    const [newMessage, setNewMessage] = useState<string>('');

    // State for editing contact information
    const [editedContact, setEditedContact] = useState<ContactInfo>({
        email: '',
        videoCallAvailable: false,
        chatAvailable: false,
        socialLinks: {}
    });
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Initialize form with user data and edit form with contact data
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }

        if (contact) {
            setEditedContact({
                ...contact,
                socialLinks: contact.socialLinks ? { ...contact.socialLinks } : {}
            });
        }

        if (!isEditing) {
            setValidationErrors([]);
        }
    }, [user, contact, isEditing]);

    // Validate contact information
    const validateContact = (): boolean => {
        const errors: string[] = [];

        if (!editedContact.email.trim()) {
            errors.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(editedContact.email)) {
            errors.push('Please enter a valid email address');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    };

    // Handle saving contact information
    const handleSave = async () => {
        if (!validateContact()) {
            return;
        }

        setIsSaving(true);
        try {
            const success = await updateTeacherSection(teacherId, 'contact', editedContact);

            if (success) {
                onEditToggle(); // Exit edit mode
            }
        } catch (error) {
            console.error('Error saving contact information:', error);
            setValidationErrors(['Failed to save changes. Please try again.']);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle cancel editing
    const handleCancel = () => {
        // Reset to original values
        setEditedContact({
            ...contact,
            socialLinks: contact.socialLinks ? { ...contact.socialLinks } : {}
        });
        setValidationErrors([]);

        // Exit edit mode
        onEditToggle();
    };

    // Handle contact form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!name || !email || !subject || !message) {
            setError('Please fill in all required fields');
            return;
        }

        setError(null);
        setIsLoading(true);

        // In a real app, this would send the message to a backend
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setFormSubmitted(true);

            // Reset form
            setSubject('');
            setMessage('');

            // Hide success message after 5 seconds
            setTimeout(() => {
                setFormSubmitted(false);
            }, 5000);
        }, 1000);
    };

    // Handle sending chat message
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        // Add user message
        const userMessage = {
            text: newMessage,
            sender: 'user' as const,
            time: 'Just now'
        };

        setChatMessages([...chatMessages, userMessage]);
        setNewMessage('');

        // Simulate teacher response after a delay
        setTimeout(() => {
            const teacherResponse = {
                text: "Thanks for your message! I'm currently offline but I'll get back to you as soon as possible.",
                sender: 'teacher' as const,
                time: 'Just now'
            };
            setChatMessages(prevMessages => [...prevMessages, teacherResponse]);
        }, 1000);
    };

    // Toggle chat widget
    const toggleChat = () => {
        setChatOpen(!chatOpen);
    };

    // Handle social link changes
    const handleSocialLinkChange = (platform: keyof typeof editedContact.socialLinks, value: string) => {
        setEditedContact(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value
            }
        }));
    };

    // If editing mode is active
    if (isEditable && isEditing) {
        return (
            <section id="contact" className="profile-section">
                <div className="contact-section-header">
                    <h2>Edit Contact Information</h2>
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

                <div className="contact-edit-form">
                    <div className="form-group">
                        <label htmlFor="contact-email">Email</label>
                        <input
                            id="contact-email"
                            type="email"
                            value={editedContact.email}
                            onChange={(e) => setEditedContact({...editedContact, email: e.target.value})}
                            placeholder="Your professional email"
                            required
                        />
                    </div>

                    <div className="form-group checkbox">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={editedContact.videoCallAvailable}
                                onChange={(e) => setEditedContact({...editedContact, videoCallAvailable: e.target.checked})}
                            />
                            <span className="checkbox-text">Available for video calls</span>
                        </label>
                    </div>

                    <div className="form-group checkbox">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={editedContact.chatAvailable}
                                onChange={(e) => setEditedContact({...editedContact, chatAvailable: e.target.checked})}
                            />
                            <span className="checkbox-text">Available for chat</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact-phone">Phone (Optional)</label>
                        <input
                            id="contact-phone"
                            type="tel"
                            value={editedContact.phone || ''}
                            onChange={(e) => setEditedContact({...editedContact, phone: e.target.value})}
                            placeholder="Your phone number (optional)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact-website">Website (Optional)</label>
                        <input
                            id="contact-website"
                            type="url"
                            value={editedContact.website || ''}
                            onChange={(e) => setEditedContact({...editedContact, website: e.target.value})}
                            placeholder="Your personal website (optional)"
                        />
                    </div>

                    <h3>Social Links (Optional)</h3>

                    <div className="form-group">
                        <label htmlFor="contact-twitter">Twitter</label>
                        <input
                            id="contact-twitter"
                            type="url"
                            value={editedContact.socialLinks?.twitter || ''}
                            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                            placeholder="Your Twitter URL"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact-linkedin">LinkedIn</label>
                        <input
                            id="contact-linkedin"
                            type="url"
                            value={editedContact.socialLinks?.linkedin || ''}
                            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                            placeholder="Your LinkedIn URL"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact-youtube">YouTube</label>
                        <input
                            id="contact-youtube"
                            type="url"
                            value={editedContact.socialLinks?.youtube || ''}
                            onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                            placeholder="Your YouTube URL"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact-instagram">Instagram</label>
                        <input
                            id="contact-instagram"
                            type="url"
                            value={editedContact.socialLinks?.instagram || ''}
                            onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                            placeholder="Your Instagram URL"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            className="cancel-btn"
                            onClick={handleCancel}
                            disabled={isSaving}
                            aria-label="Cancel editing"
                        >
                            Cancel
                        </button>
                        <button
                            className="save-btn"
                            onClick={handleSave}
                            disabled={isSaving}
                            aria-label="Save changes"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Regular view mode
    return (
        <section id="contact" className="profile-section">
            <div className="section-header">
                <h2>Contact Me</h2>
            </div>

            <div className="contact-methods">
                <div className="contact-card">
                    <div className="contact-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <h3>Email</h3>
                    {showContactInfo ? (
                        <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                    ) : (
                        <button
                            className="show-contact-btn"
                            onClick={() => setShowContactInfo(true)}
                        >
                            Show Email
                        </button>
                    )}
                </div>

                {contact.videoCallAvailable && (
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-video"></i>
                        </div>
                        <h3>Video Call</h3>
                        <p>Available by appointment</p>
                        <a href="#availability" className="contact-link">Schedule a call</a>
                    </div>
                )}

                {contact.chatAvailable && (
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-comments"></i>
                        </div>
                        <h3>Chat</h3>
                        <p>Response within 24 hours</p>
                        <button className="chat-button" onClick={toggleChat}>Start Chat</button>
                    </div>
                )}

                {contact.phone && (
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-phone"></i>
                        </div>
                        <h3>Phone</h3>
                        {showContactInfo ? (
                            <p><a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
                        ) : (
                            <button
                                className="show-contact-btn"
                                onClick={() => setShowContactInfo(true)}
                            >
                                Show Phone
                            </button>
                        )}
                    </div>
                )}

                {contact.website && (
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-globe"></i>
                        </div>
                        <h3>Website</h3>
                        <p><a href={contact.website} target="_blank" rel="noopener noreferrer">Visit Website</a></p>
                    </div>
                )}
            </div>

            <div className="contact-form-container">
                <h3>Send a Message</h3>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {formSubmitted ? (
                    <div className="success-message">
                        <div className="success-icon"><i className="fas fa-check-circle"></i></div>
                        <h3>Message Sent!</h3>
                        <p>Your message has been sent successfully. {teacherName} will get back to you soon.</p>
                    </div>
                ) : (
                    <form id="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="contact-name">Full Name</label>
                                <input
                                    type="text"
                                    id="contact-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-email">Email</label>
                                <input
                                    type="email"
                                    id="contact-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-subject">Subject</label>
                            <input
                                type="text"
                                id="contact-subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-message">Message</label>
                            <textarea
                                id="contact-message"
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>

            {/* Chat popup */}
            {chatOpen && (
                <div className="chat-popup">
                    <div className="chat-header">
                        <h3>Chat with {teacherName}</h3>
                        <button className="close-chat" onClick={toggleChat}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="chat-messages">
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.sender === 'user' ? 'sent' : 'received'}`}
                            >
                                <div className="message-content">{msg.text}</div>
                                <div className="message-time">{msg.time}</div>
                            </div>
                        ))}
                    </div>

                    <form className="chat-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="send-message">
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            )}

            {/* Social links */}
            {contact.socialLinks && Object.keys(contact.socialLinks).length > 0 && (
                <div className="social-links-container">
                    <h3>Connect on Social Media</h3>
                    <div className="social-links">
                        {contact.socialLinks.twitter && (
                            <a href={contact.socialLinks.twitter} className="social-link" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter"></i>
                                <span>Twitter</span>
                            </a>
                        )}
                        {contact.socialLinks.linkedin && (
                            <a href={contact.socialLinks.linkedin} className="social-link" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin"></i>
                                <span>LinkedIn</span>
                            </a>
                        )}
                        {contact.socialLinks.youtube && (
                            <a href={contact.socialLinks.youtube} className="social-link" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-youtube"></i>
                                <span>YouTube</span>
                            </a>
                        )}
                        {contact.socialLinks.instagram && (
                            <a href={contact.socialLinks.instagram} className="social-link" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                                <span>Instagram</span>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Contact;