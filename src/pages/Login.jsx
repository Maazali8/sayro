import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mic2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button';
import Input from '../components/Input';
import './Auth.css';

const Login = () => {
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
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
            const user = await authService.login(form.email, form.password);
            login(user);
            addToast('Welcome back! 🎉', 'success');
            navigate(from, { replace: true });
        } catch {
            addToast('Login failed. Please check your credentials.', 'error');
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
                        <h2>Transform text into<br />natural speech</h2>
                        <p>Join thousands of creators, podcasters, and businesses using VoiceGen AI.</p>
                    </div>
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
                        <h1 className="auth-form-title">Welcome back</h1>
                        <p className="auth-form-subtitle">Sign in to your account</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
                            <div className="label-row">
                                <label className="input-label">Password</label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>
                            <div className="input-with-icon">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className={`input-field ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
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

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="btn-full"
                            isLoading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="auth-divider"><span>or continue with</span></div>
                    <div className="auth-socials">
                        <button className="social-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M21.805 10.023H12v4.004h5.627c-.252 1.286-1.019 2.376-2.167 3.107v2.59h3.509C20.904 17.967 22 15.126 22 12c0-.663-.07-1.304-.195-1.977z" fill="#4285F4" />
                                <path d="M12 22c2.808 0 5.165-.93 6.882-2.523l-3.508-2.59c-.972.652-2.215 1.035-3.374 1.035-2.596 0-4.795-1.755-5.577-4.114H2.78v2.667A10.002 10.002 0 0012 22z" fill="#34A853" />
                                <path d="M6.423 13.808A5.937 5.937 0 016.105 12c0-.63.111-1.241.318-1.808V7.525H2.78A9.996 9.996 0 002 12c0 1.615.384 3.143 1.055 4.475l3.368-2.667z" fill="#FBBC04" />
                                <path d="M12 6.088c1.461 0 2.773.503 3.804 1.49l2.852-2.851C16.958 3.154 14.604 2 12 2 8.43 2 5.35 4.015 3.78 7.024l3.643 2.783C8.205 7.843 9.918 6.088 12 6.088z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button className="social-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .3a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm3.163 21.783h-.093a.513.513 0 0 1-.382-.14.513.513 0 0 1-.14-.372v-1.406c.006-.467.01-.94.01-1.416 0-.697-.247-1.175-.528-1.421 1.954-.219 3.951-.922 3.951-4.941.005-.948-.33-1.864-.94-2.58a3.432 3.432 0 0 0-.092-2.594s-.787-.25-2.568.961a8.766 8.766 0 0 0-4.6 0c-1.782-1.211-2.569-.961-2.569-.961a3.432 3.432 0 0 0-.091 2.594 3.66 3.66 0 0 0-.942 2.58c0 4.001 1.984 4.723 3.932 4.942-.248.22-.47.54-.547 1.045-.49.222-1.734.598-2.499-.71-.157-.267-.404-.491-.705-.641-.302-.15-.637-.22-.974-.203 0 0-.969.023-.074.546.537.327.957.861 1.206 1.5.242.611.554 1.77 2.174 1.35h.006v.81a.516.516 0 0 1-.148.384.54.54 0 0 1-.401.138h-.086C5.656 20.586 3.4 18.26 2.5 15.256a9.5 9.5 0 1 1 18.994 0c-.9 3.004-3.156 5.33-6.33 6.527z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    <p className="auth-switch">
                        Don't have an account? <Link to="/signup">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
