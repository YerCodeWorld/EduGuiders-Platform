// src/components/student/UpcomingClassCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatTime, getStatusBadgeClass } from '../../../../../packages/ui/src/methods.ts';
import { generateSessionPrepRoute } from '../../../../../packages/ui/src/routes/index.ts';
import '../../styles/components/student/UpcomingClassCard.css';

interface Material {
    id: string;
    name: string;
    type: string;
}

interface ClassData {
    id: string;
    teacherId: string;
    teacherName: string;
    teacherAvatar: string;
    subject: string;
    topic: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    meetingLink?: string;
    materials: Material[];
}

interface UpcomingClassCardProps {
    classData: ClassData;
    onPrepareClick?: () => void;
}

const UpcomingClassCard: React.FC<UpcomingClassCardProps> = ({
                                                                 classData,
                                                                 onPrepareClick
                                                             }) => {
    // Format the date for display
    const formattedDate = formatDate(classData.date);

    // Format start and end times
    const formattedStartTime = formatTime(classData.startTime);
    const formattedEndTime = formatTime(classData.endTime);

    // Get time until class in human-readable format
    const getTimeUntil = () => {
        const classDate = new Date(classData.date);
        const now = new Date();

        // Set the time for the class date
        const [hours, minutes] = classData.startTime.split(':').map(Number);
        classDate.setHours(hours, minutes, 0, 0);

        const diffTime = classDate.getTime() - now.getTime();

        // Return different messages based on the time difference
        if (diffTime < 0) {
            return 'Past';
        }

        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
        } else if (diffHours > 0) {
            return `in ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`;
        } else {
            return `in ${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'}`;
        }
    };

    // Determine if this class is urgent (less than 24 hours away)
    const isUrgent = () => {
        const classDate = new Date(classData.date);
        const now = new Date();

        // Set the time for the class date
        const [hours, minutes] = classData.startTime.split(':').map(Number);
        classDate.setHours(hours, minutes, 0, 0);

        const diffTime = classDate.getTime() - now.getTime();
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

        return diffHours < 24 && diffHours > 0;
    };

    return (
        <div className={`upcoming-class-card ${isUrgent() ? 'urgent' : ''}`}>
            <div className="class-info">
                <div className="class-date-time">
                    <div className="class-date">{formattedDate}</div>
                    <div className="class-time">
                        {formattedStartTime} - {formattedEndTime}
                    </div>
                    <div className="time-until">{getTimeUntil()}</div>
                </div>

                <div className="class-details">
                    <div className="class-subject">{classData.subject}</div>
                    <div className="class-topic">{classData.topic}</div>

                    <div className="class-teacher">
                        <img
                            src={classData.teacherAvatar}
                            alt={classData.teacherName}
                            className="teacher-avatar"
                        />
                        <span className="teacher-name">{classData.teacherName}</span>
                    </div>
                </div>
            </div>

            <div className="class-status-actions">
                <div className={`class-status ${classData.status}`}>
                    {classData.status === 'confirmed' && (
                        <span className="status-badge confirmed">Confirmed</span>
                    )}
                    {classData.status === 'pending' && (
                        <span className="status-badge pending">Pending</span>
                    )}
                    {classData.status === 'cancelled' && (
                        <span className="status-badge cancelled">Cancelled</span>
                    )}
                    {classData.status === 'completed' && (
                        <span className="status-badge completed">Completed</span>
                    )}
                </div>

                <div className="class-actions">
                    {classData.status === 'confirmed' && (
                        <>
                            <Link
                                to={generateSessionPrepRoute(classData.id)}
                                className="prepare-button"
                                onClick={onPrepareClick}
                            >
                                <i className="fas fa-clipboard-check"></i>
                                Prepare
                            </Link>

                            {isUrgent() && classData.meetingLink && (
                                <a
                                    href={classData.meetingLink}
                                    className="join-button"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fas fa-video"></i>
                                    Join
                                </a>
                            )}
                        </>
                    )}

                    {classData.status === 'pending' && (
                        <span className="waiting-message">
              <i className="fas fa-clock"></i>
              Awaiting confirmation
            </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpcomingClassCard;