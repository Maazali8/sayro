import React from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Twitter, Github, Linkedin, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <div className="footer-logo-icon">
                                <Mic2 size={16} />
                            </div>
                            <span className="footer-logo-text">VoiceGen AI</span>
                        </Link>
                        <p className="footer-tagline">
                            Transform your text into natural-sounding speech with cutting-edge AI technology.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-icon" aria-label="Twitter"><Twitter size={16} /></a>
                            <a href="#" className="social-icon" aria-label="GitHub"><Github size={16} /></a>
                            <a href="#" className="social-icon" aria-label="LinkedIn"><Linkedin size={16} /></a>
                            <a href="#" className="social-icon" aria-label="YouTube"><Youtube size={16} /></a>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="footer-col">
                        <h4>Product</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/pricing">Pricing</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><a href="#">API Docs</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                            <li><a href="#">GDPR</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© 2026 VoiceGen AI. All rights reserved.</span>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
