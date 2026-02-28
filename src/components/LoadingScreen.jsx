import React, { useEffect, useState, useRef } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState('loading'); // 'loading' | 'complete' | 'exit'
    const [statusText, setStatusText] = useState('Initializing...');
    const rafRef = useRef(null);
    const startTimeRef = useRef(null);
    const TOTAL_DURATION = 2200; // ms for 0→100%

    const STATUS_STEPS = [
        { at: 0, text: 'Initializing...' },
        { at: 20, text: 'Loading assets...' },
        { at: 45, text: 'Setting up voice engine...' },
        { at: 70, text: 'Preparing AI models...' },
        { at: 90, text: 'Almost ready...' },
        { at: 100, text: 'Welcome to VoiceGen AI!' },
    ];

    useEffect(() => {
        // Easing: fast at start & near end, slow in middle — feels natural
        const easeInOutQuart = (t) =>
            t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

        const animate = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const rawT = Math.min(elapsed / TOTAL_DURATION, 1);
            const easedT = easeInOutQuart(rawT);
            const pct = Math.round(easedT * 100);

            setProgress(pct);

            // Update status text
            for (let i = STATUS_STEPS.length - 1; i >= 0; i--) {
                if (pct >= STATUS_STEPS[i].at) {
                    setStatusText(STATUS_STEPS[i].text);
                    break;
                }
            }

            if (rawT < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setProgress(100);
                setStatusText('Welcome to VoiceGen AI!');
                setPhase('complete');
                setTimeout(() => {
                    setPhase('exit');
                    setTimeout(() => onComplete?.(), 600);
                }, 500);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`ls-overlay ${phase === 'exit' ? 'ls-exit' : ''}`}>
            {/* Animated background orbs */}
            <div className="ls-orb ls-orb-1" />
            <div className="ls-orb ls-orb-2" />
            <div className="ls-orb ls-orb-3" />

            {/* Noise grain texture */}
            <div className="ls-grain" />

            <div className="ls-content">
                {/* Logo / brand */}
                <div className="ls-logo">
                    <div className="ls-waveform">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="ls-bar" style={{ '--i': i }} />
                        ))}
                    </div>
                    <span className="ls-brand">VoiceGen AI</span>
                </div>

                {/* Progress track */}
                <div className="ls-progress-wrap">
                    <div className="ls-track">
                        <div
                            className={`ls-fill ${phase === 'complete' ? 'ls-fill-done' : ''}`}
                            style={{ width: `${progress}%` }}
                        />
                        <div
                            className="ls-glow-head"
                            style={{ left: `${progress}%` }}
                        />
                    </div>
                    <div className="ls-progress-labels">
                        <span className="ls-status">{statusText}</span>
                        <span className="ls-pct">{progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
