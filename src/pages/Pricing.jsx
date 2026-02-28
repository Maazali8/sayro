import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Building2, Sparkles, ArrowRight } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import Button from '../components/Button';
import './Pricing.css';

const plans = [
    {
        id: 'free',
        name: 'Free',
        icon: Sparkles,
        monthlyPrice: 0,
        desc: 'Perfect to get started and explore VoiceGen AI.',
        features: [
            '10,000 chars / month',
            '20 AI voices',
            '5 languages',
            'Standard quality (44kHz)',
            'Download MP3',
            'History (7 days)',
        ],
        missing: ['API access', 'Priority generation', 'Commercial license'],
        cta: 'Get Started Free',
        ctaLink: '/signup',
        variant: 'secondary',
    },
    {
        id: 'pro',
        name: 'Pro',
        icon: Zap,
        monthlyPrice: 19,
        yearlyPrice: 15,
        desc: 'For creators and professionals who need more power.',
        features: [
            '500,000 chars / month',
            '100+ AI voices',
            '30+ languages',
            'Studio quality (48kHz)',
            'Download MP3 & WAV',
            'Unlimited history',
            'API access (1M tokens)',
            'Priority generation',
        ],
        missing: ['Dedicated support', 'Custom voices'],
        cta: 'Start Pro Trial',
        ctaLink: '/signup',
        variant: 'primary',
        highlight: true,
        badge: 'Most Popular',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        icon: Building2,
        monthlyPrice: 79,
        yearlyPrice: 63,
        desc: 'For teams and businesses with advanced needs.',
        features: [
            'Unlimited characters',
            '200+ AI voices',
            '50+ languages',
            'Studio quality (48kHz)',
            'All audio formats',
            'Unlimited history',
            'Unlimited API access',
            'Priority generation',
            'Dedicated support',
            'Custom voices',
            'SSO & SAML',
            'SLA guarantee',
        ],
        missing: [],
        cta: 'Contact Sales',
        ctaLink: '/signup',
        variant: 'secondary',
    },
];

const Pricing = () => {
    const [yearly, setYearly] = useState(false);

    return (
        <PublicLayout>
            <div className="pricing-page">
                <div className="page-wrapper">
                    {/* Header */}
                    <div className="pricing-header text-center">
                        <span className="section-tag">Transparent Pricing</span>
                        <h1 className="section-title gradient-text">Simple, fair pricing</h1>
                        <p className="section-subtitle">No hidden fees. Cancel anytime. Start free.</p>

                        {/* Toggle */}
                        <div className="billing-toggle">
                            <span className={!yearly ? 'active' : ''}>Monthly</span>
                            <button
                                className={`toggle-switch ${yearly ? 'on' : ''}`}
                                onClick={() => setYearly((y) => !y)}
                                aria-label="Toggle billing period"
                            >
                                <span className="toggle-thumb" />
                            </button>
                            <span className={yearly ? 'active' : ''}>
                                Yearly
                                <span className="save-badge">Save 20%</span>
                            </span>
                        </div>
                    </div>

                    {/* Plans grid */}
                    <div className="plans-grid">
                        {plans.map((plan) => {
                            const Icon = plan.icon;
                            const price = plan.monthlyPrice === 0
                                ? 0
                                : yearly && plan.yearlyPrice
                                    ? plan.yearlyPrice
                                    : plan.monthlyPrice;

                            return (
                                <div
                                    key={plan.id}
                                    className={`plan-card glass ${plan.highlight ? 'highlight' : ''}`}
                                >
                                    {plan.badge && (
                                        <div className="plan-badge">{plan.badge}</div>
                                    )}

                                    <div className="plan-header">
                                        <div className={`plan-icon ${plan.highlight ? 'primary' : ''}`}>
                                            <Icon size={20} />
                                        </div>
                                        <h2 className="plan-name">{plan.name}</h2>
                                        <p className="plan-desc">{plan.desc}</p>
                                    </div>

                                    <div className="plan-price">
                                        <span className="price-currency">$</span>
                                        <span className="price-amount">{price}</span>
                                        <span className="price-period">/{yearly && price > 0 ? 'mo, billed yearly' : 'month'}</span>
                                    </div>

                                    <Link to={plan.ctaLink} className="plan-cta-link">
                                        <Button
                                            variant={plan.variant}
                                            size="lg"
                                            className="btn-full"
                                            icon={plan.highlight ? ArrowRight : undefined}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </Link>

                                    <div className="plan-features">
                                        <p className="features-label">Includes:</p>
                                        {plan.features.map((f) => (
                                            <div key={f} className="feature-item">
                                                <Check size={15} className="feature-check" />
                                                <span>{f}</span>
                                            </div>
                                        ))}
                                        {plan.missing?.map((f) => (
                                            <div key={f} className="feature-item missing">
                                                <span className="feature-dash">—</span>
                                                <span>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* FAQ note */}
                    <div className="pricing-footer text-center">
                        <p>All plans include a 14-day free trial. Questions? <a href="#">Talk to sales →</a></p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default Pricing;
