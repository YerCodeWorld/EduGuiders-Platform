// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/authPages.css';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from location state or default to home
    const from = (location.state as any)?.from?.pathname || '/';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    // Set page title
    useEffect(() => {
        document.title = 'Login | EduGuiders';
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset error state
        setError(null);

        // Validate form
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setIsLoading(true);
            const success = await login(email, password);

            if (success) {
                // If login successful, redirect to intended destination
                navigate(from, { replace: true });
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Demo account login helpers
    const loginAsDemoTeacher = () => {
        setEmail('yahir.beras@example.com');
        setPassword('password');
    };

    const loginAsDemoStudent = () => {
        setEmail('alex.johnson@example.com');
        setPassword('password');
    };

    const loginAsDemoAdmin = () => {
        setEmail('admin@example.com');
        setPassword('password');
    };

    return (
        <div className="auth-page login-page">
            <div className="auth-container">
                <div className="auth-content">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Log in to your account to continue your learning journey</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div className="password-header">
                                <label htmlFor="password">Password</label>
                                <Link to="/forgot-password" className="forgot-password">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group checkbox">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoading}
                                />
                                <span className="checkbox-text">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="auth-separator">
                        <span>or</span>
                    </div>

                    <div className="social-auth">
                        <button className="social-button google" disabled={isLoading}>
                            <span className="social-icon">G</span>
                            <span>Sign in with Google</span>
                        </button>

                        <button className="social-button facebook" disabled={isLoading}>
                            <span className="social-icon">f</span>
                            <span>Sign in with Facebook</span>
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Demo accounts section */}
                    <div className="demo-accounts">
                        <h3>Demo Accounts</h3>
                        <div className="demo-buttons">
                            <button
                                type="button"
                                onClick={loginAsDemoTeacher}
                                className="demo-button teacher"
                                disabled={isLoading}
                            >
                                Teacher
                            </button>
                            <button
                                type="button"
                                onClick={loginAsDemoStudent}
                                className="demo-button student"
                                disabled={isLoading}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={loginAsDemoAdmin}
                                className="demo-button admin"
                                disabled={isLoading}
                            >
                                Admin
                            </button>
                        </div>
                        <p className="demo-note">
                            Click a button to pre-fill credentials, then click "Sign in"
                        </p>
                    </div>
                </div>

                <div className="auth-image">
                    <div className="image-overlay">
                        <div className="overlay-content">
                            <h2>Education opens doors to new possibilities</h2>
                            <p>
                                Connect with expert teachers and unlock your full learning potential
                                on our platform designed for educational success.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;