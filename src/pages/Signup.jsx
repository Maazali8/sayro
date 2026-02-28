import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button';
import Input from '../components/Input';
import './Auth.css';

const Signup = () => {
    const { signup } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
        if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            const user = await authService.signup(form.name, form.email, form.password);
            signup(user);
            addToast('Account created! Welcome to VoiceGen AI 🎉', 'success');
            navigate('/dashboard');
        } catch {
            addToast('Signup failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left panel */}
            <div className="auth-brand-panel">
                <div className="auth-brand-content">
                    <Link to="/" className="auth-logo">
                        <div className="auth-logo-icon"><Mic2 size={20} /></div>
                        <span className="auth-logo-text">VoiceGen AI</span>
                    </Link>
                    <div className="auth-brand-hero">
                        <h2>Start creating your<br />voice content today</h2>
                        <p>Free to start — no credit card required. Upgrade anytime.</p>
                    </div>
                    <ul className="auth-brand-perks">
                        <li>✓ 10,000 characters / month free</li>
                        <li>✓ 20+ voices included</li>
                        <li>✓ No credit card required</li>
                        <li>✓ Download audio files</li>
                    </ul>
                    <div className="auth-brand-orbs" aria-hidden="true">
                        <div className="auth-orb auth-orb-1" />
                        <div className="auth-orb auth-orb-2" />
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-panel">
                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <h1 className="auth-form-title">Create your account</h1>
                        <p className="auth-form-subtitle">Get started for free today</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                            autoComplete="name"
                        />
                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                            autoComplete="email"
                        />
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="input-with-icon">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className={`input-field ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="At least 8 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="input-eye"
                                    onClick={() => setShowPass((p) => !p)}
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <span className="input-error">{errors.password}</span>}
                        </div>
                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirm"
                            id="confirm"
                            placeholder="Re-enter your password"
                            value={form.confirm}
                            onChange={handleChange}
                            error={errors.confirm}
                            autoComplete="new-password"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="btn-full"
                            isLoading={loading}
                        >
                            Create Account
                        </Button>

                        <p className="auth-terms">
                            By creating an account, you agree to our{' '}
                            <a href="#">Terms of Service</a> and{' '}
                            <a href="#">Privacy Policy</a>.
                        </p>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
