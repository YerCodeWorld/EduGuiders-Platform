// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

/**
 * USEROLES
 *
 * ADMIN: Is going to have absolute power, being able to change whatever is necessary to change,
 * even user information like profile picture. This to improve moderation capabilities.
 *
 * TEACHER: Less powerful, only being able to edit its own profile, but having access to teacher's tool.
 *
 * STUDENT: Even less powerful, but having access to student-specific information like student dashboard.
 *
 * GUEST: Uncertain if keeping this or not.
 */

export enum UserRole {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
    GUEST = 'guest'  // Are we really going to implement this?
}

// User interface
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;  // uh... no. Will remove ASAP
    // I guess I can add more properties as desired
}

// Auth context interface
// This is the interface we are going to be using throughout the program to work with user context.
// So far this basic data is what we need, no idea if there could be anything else to add.
interface AuthContextType {
    user: User | null;  // null = Maybe no user?
    // Why? If we have the user, it is authenticated right?
    isAuthenticated: boolean;
    // This is a function to authenticate from email and password. As a promise it either returns success or failure
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;  // Deletes user from local storage, returns none
    // I guess UserRoles makes sense, but why " | UserRoles[]"
    hasRole: (roles: UserRole | UserRole[]) => boolean;
    // What is this for?
    loading: boolean;
}

// Taking the types interface and creating a context with default values
export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: async () => false,
    logout: () => {},
    hasRole: () => false,
    loading: true
});

// Mocking users data for demonstration
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
        name: 'Ashley Laura',
        email: 'ashley.laura@example.com',
        password: 'password',
        role: UserRole.TEACHER,
        avatar: '/avatars/teacher1.jpg'
    },
    {
        id: '3',
        name: 'Ismael Heredia',
        email: 'ismael.heredia@example.com',
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

// Now I need more explanation on this
// Authentication Provider - We are taking a children parameter that if im not mistaken,
// would be taking another element or component as that is what the ReactNode type is for.

// This function contains a function for each of the types in the authentication context, I guess
// that's what a provider is for, adding the logic to some context.
export const AuthProvider = ({ children }: { children: ReactNode }) => {

    // Is the <> the way we set types in these cases?
    // I understand we need to set the user so maybe that's the reason of this useState.
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);  // But I do not know what this is for.

    // Initialize auth state from localStorage on component mount
    useEffect(() => {
        // This will check if we have already ran localStorage.setItem() and if there's a user already
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                // I guess localstorage stores data in another format, so that's probably
                // why we need to convert so JSON here
                const parsedUser = JSON.parse(storedUser);
                // Update the useState with the current user
                setUser(parsedUser);
            } catch (error) {
                // In case parsing fails
                console.error('Failed to parse stored user:', error);
                // But why removing?
                localStorage.removeItem('user');
            }
        }
        setLoading(false);  // Why? What is this for?
    }, []);  // Makes the useEffect to run immediately, if I am not mistaken.

    // Check if user is authenticated
    // Notice how we are using a property defined in the interface
    // Notice how this is the same thing I mentioned. isAuthenticated is the same as having a user.
    // But why do we need a separate variable?
    const isAuthenticated = user !== null;

    // Login promise type
    const login = async (email: string, password: string): Promise<boolean> => {
        // This is the equivalent of making an API call
        const foundUser = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
        );

        if (foundUser) {
            // Remove password before storing in state
            // Is this a way of passing the dictionary without one of the keys?
            // That is, if I wanted to pass the same dictionary without the avatar, I would do:
            // const { password, avatar, ...userNoPassAvatar } = foundUser;
            // In any case that's some interesting syntax. I get that password is never used which is curious.
            const { password, ...userWithoutPassword } = foundUser;
            // Update useState
            setUser(userWithoutPassword as User);
            // Storing. Stringify() is the way localstorage stores its data?
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            return true;
        }
        return false;
    };

    // Logout function | Guessing the logout button will have a binding to this function
    const logout = () => {
        // Clear useState
        setUser(null);
        // Clear userStorage
        localStorage.removeItem('user');
    };

    // Check if user has required role(s)
    // I do not understand any of this and a thorough explanation is required.
    // Like what exactly are we doing?
    const hasRole = (roles: UserRole | UserRole[]) => {
        if (!user) return false;

        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }

        return user.role === roles;
    };

    // Provide auth context
    // Ohhhh so now we are taking the context we created and adding the values we set in the logic of this function.
    // Apparently contexts have a built-in Provider property. That's cool.
    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            hasRole,
            loading
        }}>
            {/*
            And this ReactNode tag allows us to keep building inside this provider!
            Although adding {children} instead of <children> is interesting syntax. Oh Typescript.
            */}
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    // This useAuth functions DOES NOT have any correlation with the authProvider
    // We are throwing this error manually as not being inside the provider is the only case we will have
    // an undefined user.
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
