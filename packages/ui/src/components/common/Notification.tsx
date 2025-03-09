// packages/ui/src/components/common/Notification.tsx
import React, { useState, useEffect } from 'react';
import '../../styles/common/notification.css';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationProps {
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number; // in milliseconds, 0 for persistent
    onClose?: () => void;
    autoClose?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
                                                       type,
                                                       title,
                                                       message,
                                                       duration = 5000,
                                                       onClose,
                                                       autoClose = true
                                                   }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (autoClose && duration > 0) {
            timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, duration);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [autoClose, duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    // Icon mapping based on notification type
    const iconMap = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };

    return (
        <div className={`notification notification-${type}`}>
            <div className="notification-icon">
                <i className={`fas fa-${iconMap[type]}`}></i>
            </div>

            <div className="notification-content">
                {title && <h4 className="notification-title">{title}</h4>}
                <p className="notification-message">{message}</p>
            </div>

            <button className="notification-close" onClick={handleClose}>
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

export default Notification;