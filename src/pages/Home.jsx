import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Mic2, Zap, Globe, Shield, Clock, Headphones, Star, ArrowRight,
    Play, ChevronRight, Users, TrendingUp, Award, BookOpen, Video,
    MessageSquare, Podcast, Radio, Volume2, Sparkles, CheckCircle,
    BarChart3, Cpu, Download, Lock, Layers, Code2
} from 'lucide-react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import PublicLayout from '../layouts/PublicLayout';
import Button from '../components/Button';
import './Home.css';

/* ─── Animation Variants ─────────────────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
    }),
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: (i = 0) => ({
        opacity: 1,
        transition: { duration: 0.5, delay: i * 0.1 }
    }),
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: (i = 0) => ({
        opacity: 1, scale: 1,
        transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
    }),
};

const slideLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const slideRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Animated Section Wrapper ─────────────────────────────────────────────── */
const AnimatedSection = ({ children, className, ...props }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.section
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={className}
            {...props}
        >
            {children}
        </motion.section>
    );
};

/* ─── Waveform ─────────────────────────────────────────────────────────────── */
const Waveform = () => (
    <div className="waveform" aria-hidden="true">
        {Array.from({ length: 32 }).map((_, i) => (
            <motion.span
                key={i}
                className="wave-bar"
                style={{ animationDelay: `${(i * 0.07).toFixed(2)}s` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0.2, 1, 0.2] }}
                transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.07,
                    ease: 'easeInOut',
                }}
            />
        ))}
    </div>
);

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Generate high-quality audio in under 2 seconds with our optimized AI pipeline.' },
    { icon: Globe, title: '50+ Languages', desc: 'Reach a global audience with support for over 50 languages and regional accents.' },
    { icon: Headphones, title: 'Studio Quality', desc: 'Crystal-clear 48kHz audio output that sounds indistinguishable from real humans.' },
    { icon: Shield, title: 'Enterprise Secure', desc: 'Bank-grade encryption keeps your content private and fully GDPR compliant.' },
    { icon: Clock, title: 'Instant History', desc: 'Every generation saved & accessible anytime via your personal voice library.' },
    { icon: Mic2, title: '200+ Voices', desc: 'Choose from 200+ unique AI voices across ages, genders, styles, and emotions.' },
];

const steps = [
    { num: '01', title: 'Type Your Text', desc: 'Paste or type up to 5,000 characters. Supports markdown for natural pauses.' },
    { num: '02', title: 'Choose a Voice', desc: 'Pick from 200+ voices. Tune language, speed, pitch, and emotional tone.' },
    { num: '03', title: 'Generate & Download', desc: 'Click Generate — get studio audio in seconds. Download MP3, WAV, or share via link.' },
];

const testimonials = [
    { name: 'Sarah K.', role: 'Podcast Creator', text: 'VoiceGen AI completely changed how I produce content. The voices sound so natural my audience can\'t tell the difference!', rating: 5 },
    { name: 'Marcus D.', role: 'E-learning Developer', text: 'I produce training courses for Fortune 500 companies. VoiceGen\'s quality and speed make it my go-to tool every single day.', rating: 5 },
    { name: 'Priya M.', role: 'Marketing Director', text: 'The multi-language support is incredible. I\'ve scaled our content to 12 new markets in just one month.', rating: 5 },
    { name: 'James R.', role: 'Audiobook Author', text: 'Narrating my 300-page book used to cost thousands. With VoiceGen, I did it in an afternoon at a fraction of the cost.', rating: 5 },
    { name: 'Aiko T.', role: 'YouTube Creator', text: 'The emotional range of the voices is mind-blowing. Viewers actually write in saying they love my "narrator"!', rating: 5 },
    { name: 'Elena V.', role: 'Game Developer', text: 'We shipped full voiced dialogue for our indie game using VoiceGen. The characters feel alive. Simply amazing.', rating: 5 },
];

const useCases = [
    { icon: Podcast, title: 'Podcasts & Audio', desc: 'Create full podcast episodes, intros, ads, and transitions with pro-quality AI voices. No recording studio needed.' },
    { icon: BookOpen, title: 'E-learning & Courses', desc: 'Build engaging course narrations in multiple languages that keep learners focused and improve retention.' },
    { icon: Video, title: 'Video & YouTube', desc: 'Add compelling voiceovers to videos, documentaries, and YouTube content without hiring a voice actor.' },
    { icon: MessageSquare, title: 'Chatbots & IVR', desc: 'Power your customer service bots and phone systems with warm, natural-sounding AI voices.' },
    { icon: Radio, title: 'Ads & Marketing', desc: 'Produce radio spots, explainer video voiceovers, and sonic branding at scale with consistent quality.' },
    { icon: Code2, title: 'Developers & API', desc: 'Integrate TTS into any app via our REST API. Generate speech programmatically with full control.' },
];

const techSpecs = [
    { icon: Cpu, label: 'AI Model', value: 'VoiceGen v4' },
    { icon: Volume2, label: 'Audio Quality', value: '48kHz / 320kbps' },
    { icon: Globe, label: 'Languages', value: '50+ Supported' },
    { icon: Download, label: 'Export Formats', value: 'MP3, WAV, OGG' },
    { icon: Lock, label: 'Security', value: 'AES-256 + GDPR' },
    { icon: Layers, label: 'API Access', value: 'REST / WebSocket' },
    { icon: BarChart3, label: 'Uptime SLA', value: '99.9% Guaranteed' },
    { icon: Users, label: 'Team Support', value: 'Up to Unlimited' },
];

const faqs = [
    { q: 'How realistic are the AI voices?', a: 'Our latest VoiceGen v4 model produces voices virtually indistinguishable from real humans, with natural breathing, intonation, and emotional expression.' },
    { q: 'Can I use the audio commercially?', a: 'Yes! All plans include full commercial licensing. You own the audio you generate and can use it in any project, product, or publication without attribution.' },
    { q: 'Is there a free plan available?', a: 'Absolutely. Our free plan includes 5,000 characters per month, access to 20+ voices, and MP3 downloads — no credit card required.' },
    { q: 'How does the API work?', a: 'Our REST API lets you call any voice with a POST request containing your text and voice parameters. You receive a direct audio URL or binary stream within ~2 seconds.' },
    { q: 'What languages are supported?', a: 'We support 50+ languages including English, Spanish, French, German, Japanese, Arabic, Hindi, Mandarin, Portuguese, and many more with regional dialect options.' },
    { q: 'Can I clone my own voice?', a: 'Voice cloning is available on our Pro and Enterprise plans. Upload a 60-second sample and our AI will create a near-perfect digital clone of your voice within minutes.' },
];

const logos = ['Google', 'Microsoft', 'Spotify', 'Netflix', 'Shopify', 'Stripe', 'Notion', 'Figma', 'Discord', 'Twitch'];

/* ─── FAQ Item ─────────────────────────────────────────────────────────────── */
const FaqItem = ({ faq, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            className="faq-item"
            variants={fadeUp}
            custom={index * 0.5}
            onClick={() => setOpen(!open)}
        >
            <div className="faq-question">
                <span>{faq.q}</span>
                <motion.span
                    className="faq-icon"
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                >+</motion.span>
            </div>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <p>{faq.a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ─── Stat Counter ─────────────────────────────────────────────────────────── */
const Counter = ({ value, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const end = numericValue;
        const duration = 1800;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start = Math.min(start + step, end);
            setCount(start);
            if (start >= end) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, numericValue]);

    const display = Number.isInteger(numericValue)
        ? Math.floor(count).toLocaleString()
        : count.toFixed(1);

    return <span ref={ref}>{display}{suffix}</span>;
};

/* ─── Home Page ─────────────────────────────────────────────────────────────── */
const Home = () => {
    const [typedText, setTypedText] = useState('');
    const fullText = 'Turn any text into lifelike speech — instantly.';

    useEffect(() => {
        let i = 0;
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setTypedText(fullText.slice(0, i + 1));
                i++;
                if (i === fullText.length) clearInterval(interval);
            }, 45);
            return () => clearInterval(interval);
        }, 600);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <PublicLayout>
            <div className="home-page">

                {/* ──────────── HERO ──────────── */}
                <section className="hero-section">
                    <div className="hero-bg-orbs" aria-hidden="true">
                        <motion.div className="orb orb-1"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div className="orb orb-2"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        />
                        <motion.div className="orb orb-3"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.22, 0.12] }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        />
                    </div>

                    <div className="page-wrapper">
                        <motion.div className="hero-badge" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                            <Zap size={13} /> AI-Powered Text-to-Speech &nbsp;<ChevronRight size={13} />
                        </motion.div>

                        <motion.h1 className="hero-headline" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                            <span className="gradient-text">Voice Your Ideas</span>
                            <br />with AI Precision
                        </motion.h1>

                        <motion.p className="hero-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                            {typedText}<span className="cursor-blink">|</span>
                        </motion.p>

                        <motion.div className="hero-cta" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                            <Link to="/signup">
                                <Button variant="primary" size="xl" icon={ArrowRight}>Start for Free</Button>
                            </Link>
                            <Link to="/pricing">
                                <Button variant="ghost" size="xl" icon={Play}>View Pricing</Button>
                            </Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
                            <Waveform />
                        </motion.div>

                        <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
                            <div className="stat">
                                <span className="stat-value"><Counter value="10" suffix="M+" /></span>
                                <span className="stat-label">Audio Generated</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat">
                                <span className="stat-value"><Counter value="200" suffix="+" /></span>
                                <span className="stat-label">AI Voices</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat">
                                <span className="stat-value"><Counter value="50" suffix="+" /></span>
                                <span className="stat-label">Languages</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat">
                                <span className="stat-value"><Counter value="99.9" suffix="%" /></span>
                                <span className="stat-label">Uptime SLA</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ──────────── LOGO MARQUEE ──────────── */}
                <section className="logos-section">
                    <div className="page-wrapper">
                        <motion.p
                            className="logos-label"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Trusted by teams at
                        </motion.p>
                    </div>
                    <div className="marquee-wrapper">
                        <div className="marquee-track">
                            {[...logos, ...logos].map((l, i) => (
                                <span key={i} className="marquee-logo">{l}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ──────────── FEATURES ──────────── */}
                <AnimatedSection className="section features-section">
                    <div className="page-wrapper">
                        <motion.div className="text-center" variants={fadeUp} custom={0}>
                            <span className="section-tag">Why VoiceGen AI</span>
                            <h2 className="section-title gradient-text">Everything you need</h2>
                            <p className="section-subtitle">Built for creators, developers, and enterprises alike.</p>
                        </motion.div>
                        <div className="features-grid">
                            {features.map(({ icon: Icon, title, desc }, i) => (
                                <motion.div
                                    className="feature-card glass"
                                    key={title}
                                    variants={scaleIn}
                                    custom={i}
                                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                                >
                                    <motion.div className="feature-icon"
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Icon size={22} />
                                    </motion.div>
                                    <h3 className="feature-title">{title}</h3>
                                    <p className="feature-desc">{desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* ──────────── USE CASES ──────────── */}
                <AnimatedSection className="section usecases-section">
                    <div className="page-wrapper">
                        <motion.div className="text-center" variants={fadeUp} custom={0}>
                            <span className="section-tag">Use Cases</span>
                            <h2 className="section-title">Who is VoiceGen for?</h2>
                            <p className="section-subtitle">From solo creators to enterprise developers — everyone deserves a perfect voice.</p>
                        </motion.div>
                        <div className="usecases-grid">
                            {useCases.map(({ icon: Icon, title, desc }, i) => (
                                <motion.div
                                    className="usecase-card"
                                    key={title}
                                    variants={fadeUp}
                                    custom={i}
                                    whileHover={{ scale: 1.03, borderColor: 'var(--primary)', transition: { duration: 0.2 } }}
                                >
                                    <div className="usecase-icon"><Icon size={24} /></div>
                                    <h3 className="usecase-title">{title}</h3>
                                    <p className="usecase-desc">{desc}</p>
                                    <div className="usecase-arrow"><ArrowRight size={16} /></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* ──────────── HOW IT WORKS ──────────── */}
                <AnimatedSection className="section how-section">
                    <div className="page-wrapper">
                        <motion.div className="text-center" variants={fadeUp} custom={0}>
                            <span className="section-tag">Simple Process</span>
                            <h2 className="section-title">How it works</h2>
                            <p className="section-subtitle">Go from text to studio-quality audio in 3 effortless steps.</p>
                        </motion.div>
                        <div className="steps-grid">
                            {steps.map((step, i) => (
                                <motion.div
                                    className="step-card"
                                    key={step.num}
                                    variants={fadeUp}
                                    custom={i}
                                    whileHover={{ borderColor: 'var(--primary)', y: -4, transition: { duration: 0.2 } }}
                                >
                                    <motion.div
                                        className="step-number"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                                    >
                                        {step.num}
                                    </motion.div>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-desc">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* ──────────── FEATURE HIGHLIGHT (split) ──────────── */}
                <AnimatedSection className="section highlight-section">
                    <div className="page-wrapper highlight-grid">
                        <motion.div className="highlight-text" variants={slideLeft}>
                            <span className="section-tag">Voice Cloning</span>
                            <h2 className="section-title">Sound exactly like <span className="gradient-text">you</span></h2>
                            <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 2rem' }}>
                                Our proprietary voice cloning technology captures the unique acoustic fingerprint of your voice — timbre, inflection, rhythm — and reproduces it with stunning accuracy from just 60 seconds of audio.
                            </p>
                            <ul className="highlight-list">
                                {['60-second voice sample is all it takes', 'Ready to use in under 5 minutes', 'Cloned voice supports all 50+ languages', 'Available on Pro & Enterprise plans'].map((item, i) => (
                                    <motion.li key={i} variants={fadeUp} custom={i + 1}>
                                        <CheckCircle size={16} className="check-icon" />{item}
                                    </motion.li>
                                ))}
                            </ul>
                            <Link to="/signup">
                                <Button variant="primary" size="lg" icon={ArrowRight}>Try Voice Cloning</Button>
                            </Link>
                        </motion.div>
                        <motion.div className="highlight-visual" variants={slideRight}>
                            <div className="voice-card glass">
                                <div className="vc-header">
                                    <div className="vc-avatar">
                                        <Mic2 size={22} />
                                    </div>
                                    <div>
                                        <div className="vc-name">Your Voice Clone</div>
                                        <div className="vc-status">
                                            <span className="vc-dot" /> Active · 50+ languages
                                        </div>
                                    </div>
                                    <div className="vc-badge">Pro</div>
                                </div>
                                <div className="vc-waveform">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <motion.span
                                            key={i}
                                            className="vc-bar"
                                            animate={{ scaleY: [0.3, Math.random() * 0.7 + 0.3, 0.3] }}
                                            transition={{ duration: 1.2 + Math.random(), repeat: Infinity, delay: i * 0.06 }}
                                        />
                                    ))}
                                </div>
                                <div className="vc-footer">
                                    <span className="vc-lang">🇺🇸 English</span>
                                    <span className="vc-lang">🇯🇵 Japanese</span>
                                    <span className="vc-lang">🇧🇷 Portuguese</span>
                                    <span className="vc-lang">+47 more</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </AnimatedSection>

                {/* ──────────── TECH SPECS ──────────── */}
                <AnimatedSection className="section specs-section">
                    <div className="page-wrapper">
                        <motion.div className="text-center" variants={fadeUp} custom={0}>
                            <span className="section-tag">Under the Hood</span>
                            <h2 className="section-title">Built for professionals</h2>
                            <p className="section-subtitle">Enterprise-grade infrastructure powering every voice you hear.</p>
                        </motion.div>
                        <div className="specs-grid">
                            {techSpecs.map(({ icon: Icon, label, value }, i) => (
                                <motion.div className="spec-item" key={label} variants={fadeUp} custom={i}>
                                    <div className="spec-icon"><Icon size={18} /></div>
                                    <span className="spec-label">{label}</span>
                                    <span className="spec-value">{value}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* ──────────── TESTIMONIALS ──────────── */}
                <AnimatedSection className="section testimonials-section">
                    <div className="page-wrapper">
                        <motion.div className="text-center" variants={fadeUp} custom={0}>
                            <span className="section-tag">Loved by creators</span>
                            <h2 className="section-title">What our users say</h2>
                            <p className="section-subtitle">50,000+ creators trust VoiceGen AI every single day.</p>
                        </motion.div>
                        <div className="testimonials-grid">
                            {testimonials.map((t, i) => (
                                <motion.div
                                    className="testimonial-card glass"
                                    key={t.name}
                                    variants={scaleIn}
                                    custom={i}
                                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                >
                                    <div className="testimonial-stars">
                                        {Array.from({ length: t.rating }).map((_, j) => (
                                            <Star key={j} size={15} fill="var(--warning)" stroke="none" />
                                        ))}
                                    </div>
                                    <p className="testimonial-text">"{t.text}"</p>
                                    <div className="testimonial-author">
                                        <div className="testimonial-avatar">
                                            {t.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="testimonial-name">{t.name}</div>
                                            <div className="testimonial-role">{t.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* ──────────── FAQ ──────────── */}
                <AnimatedSection className="section faq-section">
                    <div className="page-wrapper">
                        <motion.div className="text-center" variants={fadeUp} custom={0}>
                            <span className="section-tag">FAQ</span>
                            <h2 className="section-title">Common questions</h2>
                            <p className="section-subtitle">Everything you need to know before you get started.</p>
                        </motion.div>
                        <motion.div className="faq-list" variants={fadeIn} custom={1}>
                            {faqs.map((faq, i) => (
                                <FaqItem key={i} faq={faq} index={i} />
                            ))}
                        </motion.div>
                    </div>
                </AnimatedSection>

                {/* ──────────── CTA BANNER ──────────── */}
                <AnimatedSection className="section cta-section">
                    <div className="page-wrapper">
                        <motion.div className="cta-banner glass" variants={scaleIn} custom={0}>
                            <div className="cta-orbs" aria-hidden="true">
                                <motion.div className="cta-orb cta-orb-1"
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                <motion.div className="cta-orb cta-orb-2"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                />
                            </div>
                            <motion.div variants={fadeUp} custom={1}>
                                <span className="section-tag">Get Started Today</span>
                                <h2 className="cta-title">Ready to transform your content?</h2>
                                <p className="cta-subtitle">Join 50,000+ creators who use VoiceGen AI every day. No credit card required. Cancel anytime.</p>
                                <div className="cta-buttons">
                                    <Link to="/signup">
                                        <Button variant="primary" size="lg" icon={ArrowRight}>Create Free Account</Button>
                                    </Link>
                                    <Link to="/pricing">
                                        <Button variant="secondary" size="lg">View Pricing</Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </AnimatedSection>

            </div>
        </PublicLayout>
    );
};

export default Home;
