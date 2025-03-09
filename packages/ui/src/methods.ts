// packages/ui/src/methods.ts
// Common utility functions

/**
 * Gets initials from a person's name (e.g., "John Doe" -> "JD")
 */
export const getInitials = (text: string | undefined): string => {
    if (!text) return '';

    return text
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
};

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format time from 24-hour to 12-hour format
 */
export const formatTime = (timeString: string): string => {
    const [hour, minute] = timeString.split(':');
    // @ts-ignore
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${hour12}:${minute} ${ampm}`;
};

/**
 * Calculate how many days until the given date
 */
export const getDaysUntil = (dateString: string): string => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `in ${diffDays} days`;
};

/**
 * Get CSS class for status badges
 */
export const getStatusBadgeClass = (status: string): string => {
    switch (status) {
        case 'pending':
            return 'status-pending';
        case 'confirmed':
            return 'status-confirmed';
        case 'rejected':
            return 'status-rejected';
        case 'completed':
            return 'status-completed';
        default:
            return '';
    }
};

/**
 * Sort dates in ascending or descending order
 */
export const sortDates = (dates: string[], ascending = true): string[] => {
    return [...dates].sort((a, b) => {
        const dateA = new Date(a).getTime();
        const dateB = new Date(b).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
    });
};

/**
 * Group an array of objects by a specific key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
        const keyValue = String(item[key]);
        if (!result[keyValue]) {
            result[keyValue] = [];
        }
        result[keyValue].push(item);
        return result;
    }, {} as Record<string, T[]>);
};

/**
 * Gets a URL parameter by name
 */
export const getUrlParam = (name: string): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
};

/**
 * Get a random number within a range
 */
export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1 )) + min;
}