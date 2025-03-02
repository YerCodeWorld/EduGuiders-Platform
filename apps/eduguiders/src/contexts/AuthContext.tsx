// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define user roles
export enum UserRole {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
    GUEST = 'guest'
}

// User interface
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

// Auth context interface
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasRole: (roles: UserRole | UserRole[]) => boolean;
    loading: boolean;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: async () => false,
    logout: () => {},
    hasRole: () => false,
    loading: true
});

// Mock users for demonstration
const MOCK_USERS = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        role: UserRole.ADMIN,
        avatar: '/avatars/admin.jpg'
    },
    {
        id: '2',
        name: 'Sofia Rodriguez',
        email: 'sofia.rodriguez@example.com',
        password: 'password',
        role: UserRole.TEACHER,
        avatar: '/avatars/teacher1.jpg'
    },
    {
        id: '3',
        name: 'David Chen',
        email: 'david.chen@example.com',
        password: 'password',
        role: UserRole.TEACHER,
        avatar: '/avatars/teacher2.jpg'
    },
    {
        id: '4',
        name: 'Yahir Beras',
        email: 'yahir.beras@example.com',
        password: 'password',
        role: UserRole.TEACHER,
        avatar: '/avatars/teacher3.jpg'
    },
    {
        id: '5',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        password: 'password',
        role: UserRole.STUDENT,
        avatar: '/avatars/student1.jpg'
    },
    {
        id: '6',
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        password: 'password',
        role: UserRole.STUDENT,
        avatar: '/avatars/student2.jpg'
    }
];

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Check if user is authenticated
    const isAuthenticated = user !== null;

    // Login function
    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulating API call
        const foundUser = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
        );

        if (foundUser) {
            // Remove password before storing in state
            const { password, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword as User);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            return true;
        }
        return false;
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Check if user has required role(s)
    const hasRole = (roles: UserRole | UserRole[]) => {
        if (!user) return false;

        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }

        return user.role === roles;
    };

    // Provide auth context
    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            hasRole,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

