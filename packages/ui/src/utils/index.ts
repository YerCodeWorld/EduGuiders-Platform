// packages/ui/src/utils/index.ts
// Shared utility functions

import { formatDate, formatTime, getInitials } from '../methods';

/**
 * Format a duration in minutes to a human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "1 hour 30 minutes")
 */
export const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
};

/**
 * Format a money amount with currency symbol
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @param minimumFractionDigits - Minimum number of fraction digits (default: 0)
 * @returns Formatted currency string
 */
export const formatCurrency = (
    amount: number,
    currency = 'USD',
    minimumFractionDigits = 0
): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Generate a color based on a string (useful for avatars)
 * @param str - Input string
 * @returns Hex color code
 */
export const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).slice(-2);
    }

    return color;
};

/**
 * Truncate a string to a specified length and add ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length (default: 50)
 * @returns Truncated string
 */
export const truncateString = (str: string, maxLength = 50): string => {
    if (!str || str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
};

/**
 * Calculate the time difference between two dates in a human-readable format
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Human-readable time difference
 */
export const getTimeDifference = (
    startDate: Date | string,
    endDate: Date | string
): string => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const diffInMs = end.getTime() - start.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    return formatDuration(diffInMinutes);
};

/**
 * Calculate session duration from start and end times
 * @param startTime - Start time (format: HH:MM)
 * @param endTime - End time (format: HH:MM)
 * @returns Duration in minutes
 */
export const calculateSessionDuration = (
    startTime: string,
    endTime: string
): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Handle overnight sessions (end time is earlier than start time)
    if (endTotalMinutes < startTotalMinutes) {
        return (24 * 60 - startTotalMinutes) + endTotalMinutes;
    }

    return endTotalMinutes - startTotalMinutes;
};

/**
 * Format a session for display (date + time range)
 * @param date - Session date (ISO string)
 * @param startTime - Start time (format: HH:MM)
 * @param endTime - End time (format: HH:MM)
 * @returns Formatted session time string
 */
export const formatSessionTime = (
    date: string,
    startTime: string,
    endTime: string
): string => {
    const formattedDate = formatDate(date);
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    return `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;
};

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns Boolean indicating if the date is today
 */
export const isToday = (date: Date | string): boolean => {
    const checkDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();

    return (
        checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear()
    );
};

/**
 * Check if a date is in the future
 * @param date - Date to check
 * @returns Boolean indicating if the date is in the future
 */
export const isFutureDate = (date: Date | string): boolean => {
    const checkDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();

    return checkDate.getTime() > now.getTime();
};

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to format
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = targetDate.getTime() - now.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    // Future date
    if (diffInSeconds > 0) {
        if (diffInSeconds < 60) {
            return `in ${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''}`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `in ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `in ${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `in ${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        return `in ${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`;
    }

    // Past date
    const absDiffInSeconds = Math.abs(diffInSeconds);

    if (absDiffInSeconds < 60) {
        return `${absDiffInSeconds} second${absDiffInSeconds !== 1 ? 's' : ''} ago`;
    }

    const absDiffInMinutes = Math.floor(absDiffInSeconds / 60);
    if (absDiffInMinutes < 60) {
        return `${absDiffInMinutes} minute${absDiffInMinutes !== 1 ? 's' : ''} ago`;
    }

    const absDiffInHours = Math.floor(absDiffInMinutes / 60);
    if (absDiffInHours < 24) {
        return `${absDiffInHours} hour${absDiffInHours !== 1 ? 's' : ''} ago`;
    }

    const absDiffInDays = Math.floor(absDiffInHours / 24);
    if (absDiffInDays === 1) {
        return 'Yesterday';
    }

    if (absDiffInDays < 30) {
        return `${absDiffInDays} days ago`;
    }

    const absDiffInMonths = Math.floor(absDiffInDays / 30);
    return `${absDiffInMonths} month${absDiffInMonths !== 1 ? 's' : ''} ago`;
};

/**
 * Get file extension from filename
 * @param filename - Filename to process
 * @returns File extension (e.g., "pdf", "docx")
 */
export const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Get a readable file size string
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Validate an email address format
 * @param email - Email to validate
 * @returns Boolean indicating if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Get URL query parameters as an object
 * @param url - URL to parse
 * @returns Object with query parameters
 */
export const getQueryParams = (url: string): Record<string, string> => {
    const params: Record<string, string> = {};
    const queryString = url.split('?')[1];

    if (queryString) {
        const pairs = queryString.split('&');
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            params[key] = decodeURIComponent(value || '');
        });
    }

    return params;
};

/**
 * Group an array of objects by a specific property
 * @param array - Array of objects to group
 * @param key - Property to group by
 * @returns Grouped object
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
};

/**
 * Sort an array of objects by a specific property
 * @param array - Array of objects to sort
 * @param key - Property to sort by
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns Sorted array
 */
export const sortBy = <T>(
    array: T[],
    key: keyof T,
    direction: 'asc' | 'desc' = 'asc'
): T[] => {
    return [...array].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

/**
 * Debounce a function to limit how often it's called
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;

    return function(...args: Parameters<T>): void {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
};

export {
    formatDate,
    formatTime,
    getInitials
};