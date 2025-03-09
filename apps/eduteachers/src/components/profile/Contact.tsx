// src/components/profile/Contact.tsx
import React, { useState } from 'react';
import { ContactInfo } from '@/types';
import { useAuth } from '@repo/ui/contexts/AuthContext';
import '../../styles/components/profile/contact.css';

interface ContactProps {
    contact: ContactInfo;
    teacherId: string;
    teacherName: string;
}

const Contact: React.FC<ContactProps> = ({ contact, teacherName }) => {
    const { user } = useAuth();

    // State for contact form
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // State for chat widget
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'teacher', time: string}>>([
        {
            text: `Hi there! This is ${teacherName}. How can I help you today?`,
            sender: 'teacher',
            time: 'Just now'
        }
    ]);
    const [newMessage, setNewMessage] = useState('');

    // Handle contact form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!name || !email || !subject || !message) {
            return;
        }

        // In a real app, this would send the message to a backend
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
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

    return (
        <section id="contact" className="profile-section">
            <h2>Contact Me</h2>

            <div className="contact-methods">
                <div className="contact-card">
                    <div className="contact-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <h3>Email</h3>
                    <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
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
                        <p><a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
                    </div>
                )}
            </div>

            <div className="contact-form-container">
                <h3>Send a Message</h3>

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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
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