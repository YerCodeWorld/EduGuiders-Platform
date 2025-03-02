// src/services/api.ts
import { UserRole } from '../contexts/AuthContext';

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://api.eduguiders.com/v1';
const API_TIMEOUT = 10000; // 10 seconds

// Request options interface
interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}

// Error handling
class ApiError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data: any = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Main API fetch function with timeout and error handling
 */
export async function fetchApi<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const {
        method = 'GET',
        headers = {},
        body,
        timeout = API_TIMEOUT
    } = options;

    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');

    // Prepare headers
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
    };

    // Add auth token if available
    if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Prepare request options
    const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include', // Include cookies for CORS requests
    };

    // Add request body if provided
    if (body) {
        requestOptions.body = JSON.stringify(body);
    }

    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Add signal to request options
        requestOptions.signal = controller.signal;

        // Make the fetch request
        const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

        // Clear timeout
        clearTimeout(timeoutId);

        // Parse response as JSON
        const data = await response.json();

        // Handle error responses
        if (!response.ok) {
            throw new ApiError(
                data.message || 'An error occurred',
                response.status,
                data
            );
        }

        return data as T;
    } catch (error) {
        // Handle fetch errors, timeout, or custom API errors
        if (error instanceof ApiError) {
            throw error;
        } else if (error instanceof DOMException && error.name === 'AbortError') {
            throw new ApiError('Request timed out', 408);
        } else {
            throw new ApiError(
                (error as Error).message || 'Network error',
                0
            );
        }
    }
}

// For demonstration, we'll provide a mock API implementation
// In a real app, this would be replaced with actual API calls

/**
 * Mock API with simulated delays and responses
 */
export const mockApi = {
    // Simulate API delay
    delay: async (ms: number = 800) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Mock data
    teachers: [
        // Teacher data would be here (same as in TeacherList component)
    ],

    // Mock teacher endpoints
    getTeachers: async () => {
        await mockApi.delay();
        return { data: mockApi.teachers };
    },

    getTeacherById: async (id: string) => {
        await mockApi.delay();
        const teacher = mockApi.teachers.find(t => t.id === id);
        if (!teacher) {
            throw new ApiError('Teacher not found', 404);
        }
        return { data: teacher };
    },

    // Mock auth endpoints
    login: async (email: string, password: string) => {
        await mockApi.delay();

        // Check against mock users (would be in the AuthContext in real code)
        const MOCK_USERS = [
            {
                id: '1',
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password',
                role: UserRole.ADMIN,
            },
            // More mock users here
        ];

        const user = MOCK_USERS.find(u =>
            u.email === email && u.password === password
        );

        if (!user) {
            throw new ApiError('Invalid credentials', 401);
        }

        // Remove password before returning
        const { password: _, ...userWithoutPassword } = user;

        // Create fake token
        const token = `mock-token-${Date.now()}`;

        return {
            data: {
                user: userWithoutPassword,
                token
            }
        };
    },

    register: async (userData: any) => {
        await mockApi.delay(1200);

        // In a real app, we'd validate and save the user
        const newUser = {
            id: `user-${Date.now()}`,
            ...userData,
            role: UserRole.STUDENT // Default role for new users
        };

        // Create fake token
        const token = `mock-token-${Date.now()}`;

        return {
            data: {
                user: newUser,
                token
            }
        };
    }
};

export default {
    fetchApi,
    mockApi
};