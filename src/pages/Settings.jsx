import React, { useState } from 'react';
import { User, Lock, Sliders, Save, Sun, Moon } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import './Settings.css';

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
];

const VOICES = ['Aria', 'James', 'Luna', 'Ethan', 'Nova', 'Ryan'];
const LANGUAGES = ['English (US)', 'English (UK)', 'Spanish', 'French', 'German', 'Japanese'];

const Settings = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState('profile');
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [savingPrefs, setSavingPrefs] = useState(false);

    const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
    const [profileErrors, setProfileErrors] = useState({});

    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const [passErrors, setPassErrors] = useState({});

    const [prefs, setPrefs] = useState({ voice: 'Aria', language: 'English (US)', autoDownload: false, emailNotifications: true });

    const handleProfileSave = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!profile.name.trim()) errs.name = 'Name is required';
        if (!profile.email.trim()) errs.email = 'Email is required';
        if (Object.keys(errs).length) { setProfileErrors(errs); return; }
        setSavingProfile(true);
        await new Promise((r) => setTimeout(r, 1000));
        addToast('Profile updated successfully!', 'success');
        setSavingProfile(false);
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!passwords.current) errs.current = 'Current password is required';
        if (!passwords.next || passwords.next.length < 8) errs.next = 'New password must be at least 8 characters';
        if (passwords.confirm !== passwords.next) errs.confirm = 'Passwords do not match';
        if (Object.keys(errs).length) { setPassErrors(errs); return; }
        setSavingPassword(true);
        await new Promise((r) => setTimeout(r, 1000));
        addToast('Password changed successfully!', 'success');
        setPasswords({ current: '', next: '', confirm: '' });
        setSavingPassword(false);
    };

    const handlePrefsSave = async (e) => {
        e.preventDefault();
        setSavingPrefs(true);
        await new Promise((r) => setTimeout(r, 800));
        addToast('Preferences saved!', 'success');
        setSavingPrefs(false);
    };

    return (
        <AppLayout>
            <div className="settings-page animate-fade">
                <div className="settings-header">
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your account and preferences</p>
                </div>

                <div className="settings-layout">
                    {/* Tab nav */}
                    <div className="settings-tabs glass">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                className={`settings-tab ${activeTab === id ? 'active' : ''}`}
                                onClick={() => setActiveTab(id)}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div className="settings-content glass">
                        {/* Profile tab */}
                        {activeTab === 'profile' && (
                            <form className="settings-form" onSubmit={handleProfileSave} noValidate>
                                <div className="settings-section-title">Profile Information</div>

                                <div className="profile-avatar-section">
                                    <div className="profile-avatar-large">
                                        {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                                    </div>
                                    <div>
                                        <p className="profile-avatar-name">{profile.name || 'Your Name'}</p>
                                        <p className="profile-avatar-plan">Free Plan</p>
                                        <Button type="button" variant="ghost" size="sm" style={{ marginTop: '0.5rem' }}>Change Photo</Button>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={(e) => { setProfile(p => ({ ...p, name: e.target.value })); setProfileErrors(e => ({ ...e, name: '' })); }}
                                        error={profileErrors.name}
                                        placeholder="Your full name"
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={(e) => { setProfile(p => ({ ...p, email: e.target.value })); setProfileErrors(e => ({ ...e, email: '' })); }}
                                        error={profileErrors.email}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className="settings-form-footer">
                                    <Button type="submit" variant="primary" icon={Save} isLoading={savingProfile}>Save Profile</Button>
                                </div>
                            </form>
                        )}

                        {/* Password tab */}
                        {activeTab === 'password' && (
                            <form className="settings-form" onSubmit={handlePasswordSave} noValidate>
                                <div className="settings-section-title">Change Password</div>
                                <Input
                                    label="Current Password"
                                    type="password"
                                    name="current"
                                    value={passwords.current}
                                    onChange={(e) => { setPasswords(p => ({ ...p, current: e.target.value })); setPassErrors(e2 => ({ ...e2, current: '' })); }}
                                    error={passErrors.current}
                                    placeholder="Enter current password"
                                />
                                <Input
                                    label="New Password"
                                    type="password"
                                    name="next"
                                    value={passwords.next}
                                    onChange={(e) => { setPasswords(p => ({ ...p, next: e.target.value })); setPassErrors(e2 => ({ ...e2, next: '' })); }}
                                    error={passErrors.next}
                                    placeholder="At least 8 characters"
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    name="confirm"
                                    value={passwords.confirm}
                                    onChange={(e) => { setPasswords(p => ({ ...p, confirm: e.target.value })); setPassErrors(e2 => ({ ...e2, confirm: '' })); }}
                                    error={passErrors.confirm}
                                    placeholder="Re-enter new password"
                                />
                                <div className="settings-form-footer">
                                    <Button type="submit" variant="primary" icon={Save} isLoading={savingPassword}>Change Password</Button>
                                </div>
                            </form>
                        )}

                        {/* Preferences tab */}
                        {activeTab === 'preferences' && (
                            <form className="settings-form" onSubmit={handlePrefsSave} noValidate>
                                <div className="settings-section-title">Preferences</div>

                                {/* Theme */}
                                <div className="pref-row">
                                    <div className="pref-info">
                                        <span className="pref-label">Theme</span>
                                        <span className="pref-desc">Toggle between dark and light mode</span>
                                    </div>
                                    <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
                                        {theme === 'dark' ? <><Sun size={16} /> Light Mode</> : <><Moon size={16} /> Dark Mode</>}
                                    </button>
                                </div>

                                {/* Default Voice */}
                                <div className="input-group">
                                    <label className="input-label">Default Voice</label>
                                    <select
                                        className="select-field"
                                        value={prefs.voice}
                                        onChange={(e) => setPrefs(p => ({ ...p, voice: e.target.value }))}
                                    >
                                        {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>

                                {/* Default Language */}
                                <div className="input-group">
                                    <label className="input-label">Default Language</label>
                                    <select
                                        className="select-field"
                                        value={prefs.language}
                                        onChange={(e) => setPrefs(p => ({ ...p, language: e.target.value }))}
                                    >
                                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>

                                {/* Toggles */}
                                <div className="pref-row">
                                    <div className="pref-info">
                                        <span className="pref-label">Auto-download audio</span>
                                        <span className="pref-desc">Automatically download after generation</span>
                                    </div>
                                    <label className="toggle-label">
                                        <input
                                            type="checkbox"
                                            checked={prefs.autoDownload}
                                            onChange={(e) => setPrefs(p => ({ ...p, autoDownload: e.target.checked }))}
                                        />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>

                                <div className="pref-row">
                                    <div className="pref-info">
                                        <span className="pref-label">Email notifications</span>
                                        <span className="pref-desc">Receive tips and product updates by email</span>
                                    </div>
                                    <label className="toggle-label">
                                        <input
                                            type="checkbox"
                                            checked={prefs.emailNotifications}
                                            onChange={(e) => setPrefs(p => ({ ...p, emailNotifications: e.target.checked }))}
                                        />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>

                                <div className="settings-form-footer">
                                    <Button type="submit" variant="primary" icon={Save} isLoading={savingPrefs}>Save Preferences</Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Settings;
