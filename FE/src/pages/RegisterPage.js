// src/pages/RegisterPage.js
import React, { useState } from 'react';
import API from '../services/api'; // Assuming API service is set up correctly
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './RegisterPage.css'; // Ensure this CSS file is created/updated

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    const onChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Optionally clear the specific field error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const submit = async e => {
        e.preventDefault();
        setErrors({});
        setMessage('');
        setIsLoading(true); // Start loading

        try {
            // Simulate network delay for testing loading state (optional)
            // await new Promise(resolve => setTimeout(resolve, 1500));

            await API.post('/auth/register', form);
            // Optionally show a success message before navigating
            // setMessage('Registration successful! Redirecting to login...');
            // await new Promise(resolve => setTimeout(resolve, 1000)); // Short delay for message visibility
            navigate('/login');
        } catch (err) {
            const resp = err.response;
            if (resp?.status === 400 || resp?.status === 403) {
                // Handle validation errors
                const fieldErrors = {};
                if (Array.isArray(resp.data.errors)) {
                    resp.data.errors.forEach(fe => {
                        // Ensure 'field' and 'defaultMessage' exist
                        if (fe.field && fe.defaultMessage) {
                           fieldErrors[fe.field] = fe.defaultMessage;
                        }
                    });
                }
                setErrors(fieldErrors);

                // Set general message if provided, otherwise a default validation message
                if (resp.data.message) {
                    setMessage(resp.data.message);
                } else if (Object.keys(fieldErrors).length > 0) {
                    setMessage('Please correct the errors below.');
                } else {
                     setMessage('Registration failed due to invalid data. Please check your input.');
                }

            } else if (resp?.status === 409) { // Example: Conflict error (e.g., username/email exists)
                 setMessage(resp.data.message || 'Username or email already exists.');
                 // Optionally highlight specific fields if the backend indicates which one caused the conflict
                 // if (resp.data.field === 'username') setErrors({ username: 'Username already taken.' });
                 // if (resp.data.field === 'email') setErrors({ email: 'Email already registered.' });
            }
            else {
                 console.error("Registration Error:", err); // Log unexpected errors
                setMessage('Registration failed due to a server error. Please try again later.');
            }
        } finally {
            setIsLoading(false); // Stop loading regardless of success or error
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <form onSubmit={submit} className="register-form" noValidate> {/* Added noValidate to rely on custom handling */}
                    <h2>Create Your Account</h2>
                    <p className="form-description">Join us! Fill out the form below to get started.</p>

                    {/* General Message Area */}
                    {message && (
                        <div className={`message ${Object.keys(errors).length > 0 || message.toLowerCase().includes('fail') || message.toLowerCase().includes('error') ? 'error-message' : 'info-message'}`}>
                            {message}
                        </div>
                    )}

                    {/* Username Field */}
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username" // Added id for label association
                            name="username"
                            type="text"
                            placeholder="Choose a unique username" // Added placeholder
                            value={form.username}
                            onChange={onChange}
                            required
                            className={errors.username ? 'input-error' : ''} // Add class if error exists
                            aria-invalid={!!errors.username} // Accessibility
                            aria-describedby={errors.username ? "username-error" : undefined}
                        />
                        {errors.username && (
                            <div id="username-error" className="error-text">{errors.username}</div>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email" // Added id
                            name="email"
                            type="email"
                            placeholder="you@example.com" // Added placeholder
                            value={form.email}
                            onChange={onChange}
                            required
                            className={errors.email ? 'input-error' : ''}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && (
                            <div id="email-error" className="error-text">{errors.email}</div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password" // Added id
                            name="password"
                            type="password"
                            placeholder="Min. 6 characters" // Added placeholder
                            value={form.password}
                            onChange={onChange}
                            minLength={6}
                            required
                            className={errors.password ? 'input-error' : ''}
                            aria-invalid={!!errors.password}
                             aria-describedby={errors.password ? "password-error" : undefined}
                        />
                         {errors.password && (
                            <div id="password-error" className="error-text">{errors.password}</div>
                        )}
                        <small className="password-hint">Password must be at least 6 characters long.</small>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    {/* Link to Login */}
                    <p className="login-link">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}