// src/pages/RegisterPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../contexts/AuthContext';
import { mockApi } from '../services/api';
import '../styles/pages/authPages.css';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    agreeTerms: boolean;
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: UserRole.STUDENT,
        agreeTerms: false,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    // Set page title
    useEffect(() => {
        document.title = 'Register | EduGuiders';
    }, []);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox input
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear error when field is edited
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        // Step 1 validation (basic info)
        if (step === 1) {
            if (!formData.firstName.trim()) {
                newErrors.firstName = 'First name is required';
            }

            if (!formData.lastName.trim()) {
                newErrors.lastName = 'Last name is required';
            }

            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Step 2 validation (password & role)
        if (step === 2) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }

            if (!formData.agreeTerms) {
                newErrors.agreeTerms = 'You must agree to the terms and privacy policy';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Move to next step or submit
    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            if (step === 1) {
                setStep(2);
            } else {
                handleSubmit();
            }
        }
    };

    // Go back to previous step
    const handleBack = () => {
        setStep(1);
    };

    // Submit the form
    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // In a real app, we'd call an API endpoint
            // For now, we'll use our mock API
            const response = await mockApi.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            // Simulate storing the token
            localStorage.setItem('authToken', response.data.token);

            // Redirect to login with success message
            navigate('/login', {
                state: {
                    registrationSuccess: true,
                    email: formData.email
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({
                email: 'Registration failed. Please try again later.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page register-page">
            <div className="auth-container">
                <div className="auth-content">
                    <div className="auth-header">
                        <h1>Create Your Account</h1>
                        <p>
                            {step === 1
                                ? 'Join our community of learners and educators'
                                : 'Set up your account credentials'}
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleNext}>
                        {/* Step indicator */}
                        <div className="step-indicator">
                            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                            <div className="step-line"></div>
                            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                        </div>

                        {/* Step 1: Basic information */}
                        {step === 1 && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Your first name"
                                        disabled={isLoading}
                                        required
                                    />
                                    {errors.firstName && (
                                        <p className="field-error">{errors.firstName}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Your last name"
                                        disabled={isLoading}
                                        required
                                    />
                                    {errors.lastName && (
                                        <p className="field-error">{errors.lastName}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        disabled={isLoading}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="field-error">{errors.email}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role">I want to join as a:</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    >
                                        <option value={UserRole.STUDENT}>Student</option>
                                        <option value={UserRole.TEACHER}>Teacher</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Step 2: Password and terms */}
                        {step === 2 && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        disabled={isLoading}
                                        required
                                    />
                                    {errors.password && (
                                        <p className="field-error">{errors.password}</p>
                                    )}
                                    <p className="password-requirements">
                                        Password must be at least 8 characters
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        disabled={isLoading}
                                        required
                                    />
                                    {errors.confirmPassword && (
                                        <p className="field-error">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="form-group checkbox">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                        <span className="checkbox-text">
                      I agree to the{' '}
                                            <Link to="/terms" className="inline-link">
                        Terms of Service
                      </Link>{' '}
                                            and{' '}
                                            <Link to="/privacy" className="inline-link">
                        Privacy Policy
                      </Link>
                    </span>
                                    </label>
                                    {errors.agreeTerms && (
                                        <p className="field-error">{errors.agreeTerms}</p>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="form-actions">
                            {step === 2 && (
                                <button
                                    type="button"
                                    className="back-button"
                                    onClick={handleBack}
                                    disabled={isLoading}
                                >
                                    Back
                                </button>
                            )}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Creating account...'
                                    : step === 1
                                        ? 'Continue'
                                        : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="auth-separator">
                        <span>or</span>
                    </div>

                    <div className="social-auth">
                        <button className="social-button google" disabled={isLoading}>
                            <span className="social-icon">G</span>
                            <span>Sign up with Google</span>
                        </button>

                        <button className="social-button facebook" disabled={isLoading}>
                            <span className="social-icon">f</span>
                            <span>Sign up with Facebook</span>
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="auth-image registration">
                    <div className="image-overlay">
                        <div className="overlay-content">
                            <h2>Start your learning journey today</h2>
                            <p>
                                Join thousands of students and teachers on our platform
                                and take the next step in your educational growth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;