import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mic2, Sun, Moon, LayoutDashboard, History, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMenuOpen(false);
        navigate('/');
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const getInitials = (name) =>
        name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
                        <div className="navbar-logo-icon">
                            <Mic2 size={18} />
                        </div>
                        <span className="navbar-logo-text">VoiceGen AI</span>
                    </Link>

                    {/* Nav Links */}
                    <ul className="navbar-links">
                        <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
                        <li><Link to="/pricing" className={isActive('/pricing') ? 'active' : ''}>Pricing</Link></li>
                        {user && (
                            <>
                                <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link></li>
                                <li><Link to="/history" className={isActive('/history') ? 'active' : ''}>History</Link></li>
                            </>
                        )}
                    </ul>

                    {/* Right Actions */}
                    <div className="navbar-actions">
                        {/* Theme Toggle */}
                        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {user ? (
                            <div className="navbar-user" ref={dropdownRef} onClick={() => setDropdownOpen((o) => !o)}>
                                <div className="user-avatar">{getInitials(user.name)}</div>
                                <span className="user-name">{user.name}</span>
                                <ChevronDown size={14} style={{ color: 'var(--muted)', marginLeft: '2px' }} />
                                {dropdownOpen && (
                                    <div className="user-dropdown">
                                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                                            <LayoutDashboard size={15} /> Dashboard
                                        </Link>
                                        <Link to="/history" onClick={() => setDropdownOpen(false)}>
                                            <History size={15} /> History
                                        </Link>
                                        <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                                            <Settings size={15} /> Settings
                                        </Link>
                                        <div className="dropdown-divider" />
                                        <button onClick={handleLogout}>
                                            <LogOut size={15} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
                                <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>Get Started</Button>
                            </>
                        )}

                        {/* Hamburger */}
                        <button
                            className={`hamburger ${menuOpen ? 'open' : ''}`}
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Toggle menu"
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
                {user ? (
                    <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        <Link to="/history" onClick={() => setMenuOpen(false)}>History</Link>
                        <Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                        <Link to="/signup" onClick={() => setMenuOpen(false)}>Get Started</Link>
                    </>
                )}
            </div>
        </>
    );
};

export default Navbar;
