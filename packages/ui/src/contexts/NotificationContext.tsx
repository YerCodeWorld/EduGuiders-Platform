// packages/ui/src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Notification, { NotificationType } from '../components/common/Notification';

interface NotificationItem {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number;
    autoClose?: boolean;
}

interface NotificationContextProps {
    notifications: NotificationItem[];
    addNotification: (notification: Omit<NotificationItem, 'id'>) => string;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const addNotification = (notification: Omit<NotificationItem, 'id'>): string => {
        const id = uuidv4();
        setNotifications(prev => [...prev, { ...notification, id }]);
        return id;
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
                clearAllNotifications
            }}
        >
            {children}
            <div className="notifications-container">
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        type={notification.type}
                        title={notification.title}
                        message={notification.message}
                        duration={notification.duration}
                        autoClose={notification.autoClose}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }

    return context;
};

// Convenience methods
export const useNotify = () => {
    const { addNotification } = useNotification();

    return {
        success: (message: string, title?: string, options = {}) =>
            addNotification({ type: 'success', message, title, ...options }),

        info: (message: string, title?: string, options = {}) =>
            addNotification({ type: 'info', message, title, ...options }),

        warning: (message: string, title?: string, options = {}) =>
            addNotification({ type: 'warning', message, title, ...options }),

        error: (message: string, title?: string, options = {}) =>
            addNotification({ type: 'error', message, title, ...options })
    };
};