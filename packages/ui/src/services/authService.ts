// packages/ui/src/services/authService.ts
// Enhanced authentication service with proper token handling

import { User, UserRole } from '../contexts/AuthContext';
import { mockApi } from './api';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

// Default token expiration time (24 hours)
const DEFAULT_TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

/**
 * Get the stored authentication token
 * @returns Token string or null if not found
 */
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the token expiry timestamp
 * @returns Expiry timestamp or null if not found
 */
export const getTokenExpiry = (): number | null => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
};

/**
 * Check if the authentication token is valid
 * @returns Boolean indicating if the token is valid
 */
export const isTokenValid = (): boolean => {
    const token = getToken();
    const expiry = getTokenExpiry();

    if (!token || !expiry) {
        return false;
    }

    return Date.now() < expiry;
};

/**
 * Store authentication data in local storage
 * @param token - Authentication token
 * @param user - User object
 * @param expiresIn - Token expiration time in milliseconds (default: 24 hours)
 */
export const setAuthData = (
    token: string,
    user: User,
    expiresIn: number = DEFAULT_TOKEN_EXPIRY
): void => {
    const expiryTime = Date.now() + expiresIn;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Clear authentication data from local storage
 */
export const clearAuthData = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Get the current user from local storage
 * @returns User object or null if not found
 */
export const getCurrentUser = (): User | null => {
    const userData = localStorage.getItem(USER_KEY);

    if (!userData) {
        return null;
    }

    try {
        return JSON.parse(userData) as User;
    } catch (error) {
        console.error('Failed to parse stored user:', error);
        return null;
    }
};

/**
 * Log in a user
 * @param email - User email
 * @param password - User password
 * @returns Promise resolving to authentication result
 */
export const login = async (
    email: string,
    password: string
): Promise<{ success: boolean; user?: User; token?: string }> => {
    try {
        // In a real app, this would be an API call
        // For now, we'll use our mock API
        const response = await mockApi.login(email, password);

        if (response.data.user && response.data.token) {
            setAuthData(response.data.token, response.data.user);
            return {
                success: true,
                user: response.data.user,
                token: response.data.token
            };
        }

        return { success: false };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false };
    }
};

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise resolving to registration result
 */
export const register = async (
    userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: UserRole;
    }
): Promise<{ success: boolean; user?: User; token?: string }> => {
    try {
        // In a real app, this would be an API call
        // For now, we'll use our mock API
        const response = await mockApi.register(userData);

        if (response.data.user && response.data.token) {
            setAuthData(response.data.token, response.data.user);
            return {
                success: true,
                user: response.data.user,
                token: response.data.token
            };
        }

        return { success: false };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false };
    }
};

/**
 * Log out the current user
 */
export const logout = (): void => {
    clearAuthData();
};

/**
 * Check if the current user has the specified role(s)
 * @param roles - Role or array of roles to check
 * @returns Boolean indicating if the user has the role(s)
 */
export const hasRole = (roles: UserRole | UserRole[]): boolean => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return false;
    }

    if (Array.isArray(roles)) {
        return roles.includes(currentUser.role);
    }

    return currentUser.role === roles;
};

/**
 * Refresh the authentication token
 * @returns Promise resolving to refresh result
 */
export const refreshToken = async (): Promise<boolean> => {
    // In a real app, this would call a token refresh API endpoint
    // For the mock implementation, we'll just extend the expiry time

    const user = getCurrentUser();
    const token = getToken();

    if (!user || !token) {
        return false;
    }

    setAuthData(token, user);
    return true;
};

// Auto refresh token setup
let refreshTokenInterval: NodeJS.Timeout | null = null;

/**
 * Setup automatic token refresh
 * @param refreshInterval - Refresh interval in milliseconds (default: 15 minutes)
 */
export const setupTokenRefresh = (refreshInterval = 15 * 60 * 1000): void => {
    if (refreshTokenInterval) {
        clearInterval(refreshTokenInterval);
    }

    refreshTokenInterval = setInterval(async () => {
        if (isTokenValid()) {
            const expiry = getTokenExpiry();
            if (expiry && expiry - Date.now() < refreshInterval) {
                await refreshToken();
            }
        } else {
            if (refreshTokenInterval) {
                clearInterval(refreshTokenInterval);
                refreshTokenInterval = null;
            }
        }
    }, refreshInterval / 3);
};

// Export default object for convenience
export default {
    getToken,
    isTokenValid,
    getCurrentUser,
    login,
    register,
    logout,
    hasRole,
    refreshToken,
    setupTokenRefresh
};