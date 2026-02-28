import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, History, Settings, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getInitials = (name) =>
        name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/history', icon: History, label: 'History' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="sidebar-mobile-btn"
                onClick={() => setMobileOpen(true)}
                style={{
                    display: 'none',
                    position: 'fixed',
                    top: '78px',
                    left: '1rem',
                    zIndex: 101,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    color: 'var(--text)',
                }}
            >
                <Menu size={20} />
            </button>

            {/* Overlay */}
            <div
                className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
                <nav className="sidebar-nav">
                    <span className="sidebar-section-label">Main</span>
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`sidebar-link ${isActive(to) ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <Icon size={17} className="sidebar-icon" />
                            {label}
                        </Link>
                    ))}

                    <span className="sidebar-section-label">Account</span>
                    <button className="sidebar-link" onClick={handleLogout}>
                        <LogOut size={17} className="sidebar-icon" />
                        Logout
                    </button>
                </nav>

                {/* User info */}
                <div className="sidebar-user">
                    <div className="sidebar-user-info">
                        <div className="sidebar-avatar">{getInitials(user?.name)}</div>
                        <div className="sidebar-user-meta">
                            <div className="sidebar-user-name">{user?.name || 'User'}</div>
                            <div className="sidebar-user-plan">Free Plan</div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
