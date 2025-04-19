// src/pages/LoginPage.js
import React, { useState } from 'react';
import API from '../services/api'; // Ensure API service is correctly configured
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Import Link and useLocation
import './LoginPage.css'; // Ensure this CSS file is created/updated

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const navigate = useNavigate();
    const location = useLocation(); // Get location to handle redirects

    // Determine where to redirect after login
    const getRedirectPath = (role) => {
        const from = location.state?.from; // Get path user tried to access before login
        if (from) {
            // Avoid redirect loops if 'from' was the login/register page itself
             if (from !== '/login' && from !== '/register') {
                 return from;
             }
        }
        // Default redirection based on role
        return role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/products'; // Default to products or dashboard
    };


    const submit = async e => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Start loading

        try {
            // Simulate network delay (optional, for testing UI)
            // await new Promise(resolve => setTimeout(resolve, 1000));

            const res = await API.post('/auth/login', form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
             // Store username for potential display/use elsewhere
            localStorage.setItem('username', form.username); // Or get from res.data if available

            // Redirect based on role and previous location
            const redirectPath = getRedirectPath(res.data.role);
            navigate(redirectPath, { replace: true }); // Use replace to avoid login page in history

        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please check your username and password.';
            if (err.response?.status === 400 || err.response?.status === 401 || err.response?.status === 403) {
                 setError(message);
            } else {
                console.error("Login Error:", err); // Log unexpected errors
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const onChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Optional: Add Logo */}
                {/* <div className="login-logo"> Your Logo Here </div> */}

                <form onSubmit={submit} className="login-form" noValidate>
                    <h2>Welcome Back!</h2>
                    <p className="form-description">Log in to continue.</p>

                    {/* General Error Message */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Username Field */}
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username" // Added id for label association
                            name="username"
                            type="text"
                            placeholder="Enter your username" // Updated placeholder
                            value={form.username}
                            onChange={onChange}
                            required
                            disabled={isLoading} // Disable during loading
                            autoComplete='username'
                        />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password" // Added id
                            name="password"
                            type="password"
                            placeholder="Enter your password" // Updated placeholder
                            value={form.password}
                            onChange={onChange}
                            required
                            disabled={isLoading} // Disable during loading
                            autoComplete='current-password'
                        />
                    </div>

                     {/* Optional: Extra options like Remember Me / Forgot Password */}
                    <div className="extra-options">
                       {/* <label className="remember-me">
                            <input type="checkbox" name="remember" /> Remember Me
                        </label> */}
                        {/* <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link> */}
                    </div>


                    {/* Submit Button */}
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </button>

                    {/* Link to Register Page */}
                    <p className="register-link">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}