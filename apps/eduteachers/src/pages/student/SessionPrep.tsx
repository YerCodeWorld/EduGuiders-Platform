// src/pages/SessionPrep.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@repo/ui/contexts/AuthContext';
import { useTeachers } from '../../contexts';
// import { useNotify } from '../../../packages/ui/src/contexts/NotificationContext';
import { formatDate, formatTime } from "@repo/ui/exports.ts";
import { ROUTES } from "@repo/ui/routes/index.ts";
import '../styles/pages/sessionPrep.css';

interface Material {
    id: string;
    name: string;
    type: string;
    url?: string;
    uploadedBy: 'teacher' | 'student';
    uploadedAt: string;
}

interface SessionPreparationData {
    id: string;
    teacherId: string;
    teacherName: string;
    teacherAvatar: string;
    studentId: string;
    studentName: string;
    subject: string;
    topic: string;
    date: string;
    startTime: string;
    endTime: string;
    meetingLink: string;
    description: string;
    objectives: string[];
    prerequisites: string[];
    materials: Material[];
    checklistItems: {
        id: string;
        text: string;
        checked: boolean;
    }[];
}

const SessionPrep = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const { user } = useAuth();
    const { teachers } = useTeachers();
    // const notify = useNotify();
    const navigate = useNavigate();

    const [sessionData, setSessionData] = useState<SessionPreparationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [readyToJoin, setReadyToJoin] = useState(false);

    // Check if all required checklist items are completed
    useEffect(() => {
        if (sessionData) {
            const requiredItems = sessionData.checklistItems;
            const allChecked = requiredItems.every(item => item.checked);
            setReadyToJoin(allChecked);
        }
    }, [sessionData]);

    // Fetch session data
    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                setIsLoading(true);

                // In a real app, this would be an API call
                // For now, we'll mock some data based on the session ID

                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock session data
                const mockSessionData: SessionPreparationData = {
                    id: sessionId || 'session-1',
                    teacherId: teachers[0]?.id || 'teacher-1',
                    teacherName: teachers[0]?.name || 'Yahir Beras',
                    teacherAvatar: teachers[0]?.profilePicture || '/api/placeholder/60/60',
                    studentId: user?.id || 'student-1',
                    studentName: user?.name || 'Student',
                    subject: 'Mathematics',
                    topic: 'Advanced Algebra: Quadratic Equations',
                    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                    startTime: '10:00',
                    endTime: '11:30',
                    meetingLink: 'https://meet.example.com/session-1234',
                    description: 'In this session, we will cover advanced techniques for solving quadratic equations, including completing the square, using the quadratic formula, and applications in real-world problems.',
                    objectives: [
                        'Understand and apply the quadratic formula',
                        'Complete the square to solve quadratic equations',
                        'Apply quadratic equations to solve word problems',
                        'Analyze the discriminant to determine the nature of roots'
                    ],
                    prerequisites: [
                        'Basic algebra knowledge',
                        'Understanding of linear equations',
                        'Familiarity with algebraic expressions'
                    ],
                    materials: [
                        {
                            id: 'mat-1',
                            name: 'Quadratic Equations Worksheet',
                            type: 'pdf',
                            url: '#',
                            uploadedBy: 'teacher',
                            uploadedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
                        },
                        {
                            id: 'mat-2',
                            name: 'Quadratic Formula Cheat Sheet',
                            type: 'pdf',
                            url: '#',
                            uploadedBy: 'teacher',
                            uploadedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
                        }
                    ],
                    checklistItems: [
                        {
                            id: 'check-1',
                            text: 'Review prerequisite materials',
                            checked: false
                        },
                        {
                            id: 'check-2',
                            text: 'Complete pre-session worksheet',
                            checked: false
                        },
                        {
                            id: 'check-3',
                            text: 'Prepare questions for the teacher',
                            checked: false
                        },
                        {
                            id: 'check-4',
                            text: 'Test audio and video',
                            checked: false
                        }
                    ]
                };

                setSessionData(mockSessionData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching session data:', error);
                // notify.error('Failed to load session preparation data');
                setIsLoading(false);
            }
        };

        if (sessionId) {
            fetchSessionData();
        }
    }, [sessionId, user, teachers]);

    // Update document title
    useEffect(() => {
        if (sessionData) {
            document.title = `Prepare for ${sessionData.topic} | EduTeachers`;
        } else {
            document.title = 'Session Preparation | EduTeachers';
        }
    }, [sessionData]);

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploadingFile(true);

        // In a real app, this would upload the file to a server
        // For now, we'll just simulate a delay
        setTimeout(() => {
            // Add the new file to materials
            if (sessionData) {
                const newMaterial: Material = {
                    id: `mat-${Date.now()}`,
                    name: files[0].name,
                    type: files[0].type.split('/')[1] || 'file',
                    uploadedBy: 'student',
                    uploadedAt: new Date().toISOString()
                };

                setSessionData({
                    ...sessionData,
                    materials: [...sessionData.materials, newMaterial]
                });
            }

            setUploadingFile(false);
            // notify.success('File uploaded successfully');

            // Clear the file input
            event.target.value = '';
        }, 1500);
    };

    // Handle checklist item toggle
    const handleChecklistToggle = (itemId: string) => {
        if (sessionData) {
            const updatedChecklist = sessionData.checklistItems.map(item => {
                if (item.id === itemId) {
                    return { ...item, checked: !item.checked };
                }
                return item;
            });

            setSessionData({
                ...sessionData,
                checklistItems: updatedChecklist
            });
        }
    };

    // Format session time
    const getSessionTimeInfo = () => {
        if (!sessionData) return '';

        const formattedDate = formatDate(sessionData.date);
        const formattedStartTime = formatTime(sessionData.startTime);
        const formattedEndTime = formatTime(sessionData.endTime);

        return `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;
    };

    // Join session
    const handleJoinSession = () => {
        if (sessionData && sessionData.meetingLink) {
            window.open(sessionData.meetingLink, '_blank');
        }
    };

    if (isLoading) {
        return (
            <div className="session-prep-loading">
                <div className="spinner"></div>
                <p>Loading session preparation...</p>
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="session-not-found">
                <h2>Session Not Found</h2>
                <p>The session you're looking for doesn't exist or has been removed.</p>
                <button className="btn-primary" onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="session-prep-container">
            <div className="session-prep-header">
                <div className="back-navigation">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <i className="fas fa-arrow-left"></i> Back
                    </button>
                </div>

                <h1>Prepare for Your Session</h1>
                <p className="session-topic">{sessionData.subject}: {sessionData.topic}</p>

                <div className="session-meta">
                    <div className="session-time">
                        <i className="fas fa-clock"></i>
                        <span>{getSessionTimeInfo()}</span>
                    </div>

                    <div className="session-teacher">
                        <i className="fas fa-chalkboard-teacher"></i>
                        <span>With {sessionData.teacherName}</span>
                    </div>
                </div>
            </div>

            <div className="session-prep-content">
                <div className="session-prep-main">
                    {/* Session description */}
                    <section className="prep-card session-description">
                        <h2>Session Overview</h2>
                        <p>{sessionData.description}</p>

                        <div className="session-objectives">
                            <h3>Learning Objectives</h3>
                            <ul>
                                {sessionData.objectives.map((objective, index) => (
                                    <li key={index}>{objective}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="session-prerequisites">
                            <h3>Prerequisites</h3>
                            <ul>
                                {sessionData.prerequisites.map((prerequisite, index) => (
                                    <li key={index}>{prerequisite}</li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Session materials */}
                    <section className="prep-card session-materials">
                        <h2>Session Materials</h2>

                        <div className="materials-list">
                            {sessionData.materials.length === 0 ? (
                                <p className="no-materials">No materials have been shared yet.</p>
                            ) : (
                                sessionData.materials.map((material) => (
                                    <div
                                        key={material.id}
                                        className={`material-item ${material.uploadedBy === 'teacher' ? 'teacher-material' : 'student-material'}`}
                                    >
                                        <div className="material-icon">
                                            <i className={`fas fa-${getFileIcon(material.type)}`}></i>
                                        </div>

                                        <div className="material-info">
                                            <div className="material-name">{material.name}</div>
                                            <div className="material-meta">
                        <span className="uploader">
                          {material.uploadedBy === 'teacher' ? 'Shared by teacher' : 'Uploaded by you'}
                        </span>
                                                <span className="uploaded-date">
                          {formatRelativeTime(material.uploadedAt)}
                        </span>
                                            </div>
                                        </div>

                                        <a href={material.url || '#'} className="material-download" download>
                                            <i className="fas fa-download"></i>
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="upload-section">
                            <h3>Upload Materials</h3>
                            <p>Share your work or additional resources with your teacher.</p>

                            <label className="file-upload-button">
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    disabled={uploadingFile}
                                />
                                <i className="fas fa-upload"></i>
                                {uploadingFile ? 'Uploading...' : 'Upload File'}
                            </label>
                        </div>
                    </section>
                </div>

                <div className="session-prep-sidebar">
                    {/* Join session card */}
                    <section className="prep-card join-session">
                        <h2>Join Session</h2>

                        <div className="join-time-remaining">
                            <div className="time-icon">
                                <i className="fas fa-hourglass-half"></i>
                            </div>
                            <div className="time-info">
                                <div className="time-label">Time until session</div>
                                <div className="time-value">
                                    {getTimeUntilSession(sessionData.date, sessionData.startTime)}
                                </div>
                            </div>
                        </div>

                        <button
                            className="join-meeting-button"
                            disabled={!readyToJoin}
                            onClick={handleJoinSession}
                        >
                            <i className="fas fa-video"></i>
                            Join Video Meeting
                        </button>

                        {!readyToJoin && (
                            <div className="join-notice">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>Complete all checklist items below to join</span>
                            </div>
                        )}

                        <div className="meeting-details">
                            <div className="meeting-link-label">Meeting Link:</div>
                            <div className="meeting-link-value">
                                <a
                                    href={sessionData.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {sessionData.meetingLink}
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Preparation checklist */}
                    <section className="prep-card prep-checklist">
                        <h2>Preparation Checklist</h2>
                        <p>Please complete these items before joining the session:</p>

                        <div className="checklist-items">
                            {sessionData.checklistItems.map((item) => (
                                <div key={item.id} className="checklist-item">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => handleChecklistToggle(item.id)}
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-text">{item.text}</span>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="checklist-progress">
                            <div className="progress-label">
                                Preparation progress: {getChecklistProgress(sessionData.checklistItems)}%
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${getChecklistProgress(sessionData.checklistItems)}%` }}
                                ></div>
                            </div>
                        </div>
                    </section>

                    {/* Need help section */}
                    <section className="prep-card need-help">
                        <h2>Need Help?</h2>
                        <p>If you're having technical difficulties or questions about the session:</p>

                        <div className="help-options">
                            <a href={`/messages/teacher/${sessionData.teacherId}`} className="help-option">
                                <i className="fas fa-comment-alt"></i>
                                <span>Message Teacher</span>
                            </a>

                            <a href="/help" className="help-option">
                                <i className="fas fa-question-circle"></i>
                                <span>Technical Support</span>
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

// Helper function to determine file icon
const getFileIcon = (fileType: string): string => {
    switch (fileType.toLowerCase()) {
        case 'pdf':
            return 'file-pdf';
        case 'doc':
        case 'docx':
            return 'file-word';
        case 'xls':
        case 'xlsx':
            return 'file-excel';
        case 'ppt':
        case 'pptx':
            return 'file-powerpoint';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'file-image';
        case 'mp4':
        case 'mov':
        case 'avi':
            return 'file-video';
        case 'mp3':
        case 'wav':
            return 'file-audio';
        default:
            return 'file-alt';
    }
};

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
};

// Helper function to get time until session
const getTimeUntilSession = (dateString: string, timeString: string): string => {
    const sessionDate = new Date(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffTime = sessionDate.getTime() - now.getTime();

    if (diffTime < 0) {
        if (Math.abs(diffTime) < 1000 * 60 * 60) {
            return 'In progress';
        }
        return 'Past';
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}, ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`;
    } else if (diffHours > 0) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}, ${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'}`;
    } else {
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'}`;
    }
};

// Helper function to calculate checklist progress
const getChecklistProgress = (items: Array<{ checked: boolean }>): number => {
    if (items.length === 0) return 0;

    const checkedCount = items.filter(item => item.checked).length;
    return Math.round((checkedCount / items.length) * 100);
};

export default SessionPrep;