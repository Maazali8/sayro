import React, { useState, useRef, useCallback } from 'react';
import { Mic2, Play, Pause, Download, RotateCcw, Volume2 } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/Button';
import { TextArea } from '../components/Input';
import Slider from '../components/Slider';
import { ttsService, POLLY_VOICES } from '../services/ttsService';
import { useToast } from '../contexts/ToastContext';
import './Dashboard.css';

const VOICES = [
    { id: 'aria', label: 'Aria', desc: POLLY_VOICES.aria.desc },
    { id: 'james', label: 'James', desc: POLLY_VOICES.james.desc },
    { id: 'luna', label: 'Luna', desc: POLLY_VOICES.luna.desc },
    { id: 'ethan', label: 'Ethan', desc: POLLY_VOICES.ethan.desc },
    { id: 'nova', label: 'Nova', desc: POLLY_VOICES.nova.desc },
    { id: 'ryan', label: 'Ryan', desc: POLLY_VOICES.ryan.desc },
];

const LANGUAGES = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'zh-CN', label: 'Chinese (Mandarin)' },
    { value: 'ar-SA', label: 'Arabic' },
    { value: 'pt-BR', label: 'Portuguese' },
    { value: 'hi-IN', label: 'Hindi' },
];

const MAX_CHARS = 3000; // Puter.js / AWS Polly limit

const fmtTime = (secs) => {
    if (!secs || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const Dashboard = () => {
    const { addToast } = useToast();
    const audioRef = useRef(null);

    const [text, setText] = useState('');
    const [voice, setVoice] = useState('aria');
    const [language, setLanguage] = useState('en-US');
    const [speed, setSpeed] = useState(1.0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);       // 0–100
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // ── Generate ───────────────────────────────────────────────────────────────
    const handleGenerate = async () => {
        if (!text.trim()) { addToast('Please enter some text first.', 'error'); return; }
        if (text.length > MAX_CHARS) { addToast(`Text exceeds ${MAX_CHARS} characters.`, 'error'); return; }

        setLoading(true);
        setResult(null);
        setPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);

        try {
            const data = await ttsService.generate(text, voice, language, speed);
            setResult(data);
            addToast('Audio generated! 🎵 Click Play to listen.', 'success');
        } catch (err) {
            console.error(err);
            addToast('Generation failed. Make sure you are signed into Puter.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ── Audio event handlers ───────────────────────────────────────────────────
    const handleTimeUpdate = useCallback(() => {
        const el = audioRef.current;
        if (!el) return;
        setCurrentTime(el.currentTime);
        if (el.duration && isFinite(el.duration)) {
            setProgress((el.currentTime / el.duration) * 100);
        }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        const el = audioRef.current;
        if (el && isFinite(el.duration)) {
            setDuration(el.duration);
        }
    }, []);

    const handleEnded = useCallback(() => {
        setPlaying(false);
        setProgress(100);
    }, []);

    // ── Play / Pause ───────────────────────────────────────────────────────────
    const handlePlayPause = () => {
        const el = audioRef.current;
        if (!el) return;
        if (playing) {
            el.pause();
            setPlaying(false);
        } else {
            el.play();
            setPlaying(true);
        }
    };

    // ── Seek via progress bar click ────────────────────────────────────────────
    const handleSeek = (e) => {
        const el = audioRef.current;
        if (!el || !el.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        el.currentTime = ratio * el.duration;
    };

    // ── Download ───────────────────────────────────────────────────────────────
    const handleDownload = () => {
        if (!result?.url) return;
        const a = document.createElement('a');
        a.href = result.url;
        a.download = `voicegen-${result.id}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // ── Reset ──────────────────────────────────────────────────────────────────
    const handleReset = () => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
        setResult(null);
        setPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
        setText('');
    };

    return (
        <AppLayout>
            <div className="dashboard-page animate-fade">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Text to Speech</h1>
                        <p className="dashboard-subtitle">Transform your text into natural-sounding audio</p>
                    </div>
                    <div className="dashboard-header-actions">
                        <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleReset}>Reset</Button>
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* Left: Input */}
                    <div className="tts-input-panel glass">
                        <TextArea
                            label="Your Text"
                            placeholder="Type or paste your text here... (up to 3,000 characters)"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            count={text.length}
                            maxCount={MAX_CHARS}
                            className="tts-textarea-group"
                            style={{ minHeight: '220px' }}
                        />

                        <div className="tts-options">
                            {/* Voice selector */}
                            <div className="input-group">
                                <label className="input-label">AI Voice</label>
                                <div className="voice-grid">
                                    {VOICES.map((v) => (
                                        <button
                                            key={v.id}
                                            className={`voice-card ${voice === v.id ? 'selected' : ''}`}
                                            onClick={() => setVoice(v.id)}
                                        >
                                            <div className="voice-avatar">
                                                <Volume2 size={14} />
                                            </div>
                                            <div className="voice-info">
                                                <span className="voice-name">{v.label}</span>
                                                <span className="voice-desc">{v.desc}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Language */}
                            <div className="input-group">
                                <label className="input-label">Language</label>
                                <select
                                    className="select-field"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    {LANGUAGES.map((l) => (
                                        <option key={l.value} value={l.value}>{l.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Speed (visual only — AWS Polly neural doesn't support rate via Puter.js) */}
                            <Slider
                                label="Speed"
                                min={0.5}
                                max={2.0}
                                step={0.1}
                                value={speed}
                                onChange={setSpeed}
                                minLabel="Slow"
                                maxLabel="Fast"
                                formatValue={(v) => `${v.toFixed(1)}x`}
                            />
                        </div>

                        <Button
                            variant="primary"
                            size="lg"
                            className="btn-full generate-btn"
                            icon={Mic2}
                            isLoading={loading}
                            onClick={handleGenerate}
                            disabled={!text.trim() || text.length > MAX_CHARS}
                        >
                            {loading ? 'Generating…' : 'Generate Audio'}
                        </Button>
                    </div>

                    {/* Right: Output */}
                    <div className="tts-output-panel">
                        {result ? (
                            <div className="audio-result glass animate-fade">
                                {/* Hidden audio element — real blob URL from Puter.js */}
                                <audio
                                    ref={audioRef}
                                    src={result.url}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onEnded={handleEnded}
                                    preload="metadata"
                                    style={{ display: 'none' }}
                                />

                                <div className="audio-result-header">
                                    <div className="audio-waveform-mini">
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={`mini-bar${playing ? ' active' : ''}`}
                                                style={{ animationDelay: `${i * 0.07}s` }}
                                            />
                                        ))}
                                    </div>
                                    <div className="audio-meta">
                                        <span className="audio-voice">{VOICES.find(v => v.id === result.voice)?.label || result.voice}</span>
                                        <span className="audio-dot">·</span>
                                        <span className="audio-duration">{result.duration}</span>
                                        <span className="audio-dot">·</span>
                                        <span className="audio-date">{result.date}</span>
                                    </div>
                                </div>

                                <p className="audio-text-preview">
                                    "{result.text.length > 120 ? result.text.slice(0, 120) + '…' : result.text}"
                                </p>

                                <div className="audio-controls">
                                    {/* Play / Pause */}
                                    <button
                                        className="audio-play-btn"
                                        onClick={handlePlayPause}
                                        aria-label={playing ? 'Pause' : 'Play'}
                                    >
                                        {playing ? <Pause size={22} /> : <Play size={22} />}
                                    </button>

                                    {/* Seekable progress bar + time */}
                                    <div
                                        className="audio-progress-bar"
                                        onClick={handleSeek}
                                        style={{ cursor: 'pointer' }}
                                        title="Click to seek"
                                    >
                                        <div
                                            className="audio-progress-fill"
                                            style={{ width: `${progress}%`, transition: playing ? 'width 0.25s linear' : 'none' }}
                                        />
                                    </div>

                                    {/* Time display */}
                                    <span className="audio-time">
                                        {fmtTime(currentTime)}{duration > 0 ? ` / ${fmtTime(duration)}` : ''}
                                    </span>

                                    {/* Download button */}
                                    <button
                                        className="audio-download-btn"
                                        onClick={handleDownload}
                                        aria-label="Download"
                                        title="Download MP3"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="audio-placeholder glass">
                                <div className="placeholder-waveform" aria-hidden="true">
                                    {Array.from({ length: 22 }).map((_, i) => <span key={i} className="ph-bar" />)}
                                </div>
                                <p className="placeholder-text">Your generated audio will appear here</p>
                                <p className="placeholder-hint">Enter some text and click "Generate Audio" to start</p>
                            </div>
                        )}

                        {/* Usage stats */}
                        <div className="usage-card glass">
                            <h3 className="usage-title">This Month's Usage</h3>
                            <div className="usage-bar-wrap">
                                <div className="usage-bar-label">
                                    <span>Characters used</span>
                                    <span>2,340 / 10,000</span>
                                </div>
                                <div className="usage-bar-track">
                                    <div className="usage-bar-fill" style={{ width: '23.4%' }} />
                                </div>
                            </div>
                            <p className="usage-upgrade">
                                <a href="/pricing">Upgrade to Pro</a> for 500K chars/month
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
