import React, { useState, useRef } from 'react';
import { Mic2, Play, Pause, Download, RotateCcw, Volume2 } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/Button';
import { TextArea } from '../components/Input';
import Slider from '../components/Slider';
import { ttsService } from '../services/ttsService';
import { useToast } from '../contexts/ToastContext';
import './Dashboard.css';

const VOICES = [
    { id: 'aria', label: 'Aria', desc: 'Warm, professional female' },
    { id: 'james', label: 'James', desc: 'Deep, confident male' },
    { id: 'luna', label: 'Luna', desc: 'Soft, calm female' },
    { id: 'ethan', label: 'Ethan', desc: 'Energetic young male' },
    { id: 'nova', label: 'Nova', desc: 'Clear, neutral female' },
    { id: 'ryan', label: 'Ryan', desc: 'Friendly, casual male' },
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

const MAX_CHARS = 5000;

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

    const handleGenerate = async () => {
        if (!text.trim()) { addToast('Please enter some text first.', 'error'); return; }
        if (text.length > MAX_CHARS) { addToast(`Text exceeds ${MAX_CHARS} characters.`, 'error'); return; }

        setLoading(true);
        setResult(null);
        try {
            const data = await ttsService.generate(text, voice, language, speed);
            setResult(data);
            addToast('Audio generated successfully! 🎵', 'success');
        } catch {
            addToast('Generation failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.play();
            setPlaying(true);
        }
    };

    const handleReset = () => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setResult(null);
        setPlaying(false);
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
                            placeholder="Type or paste your text here... (up to 5,000 characters)"
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

                            {/* Speed */}
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
                            {loading ? 'Generating...' : 'Generate Audio'}
                        </Button>
                    </div>

                    {/* Right: Output */}
                    <div className="tts-output-panel">
                        {result ? (
                            <div className="audio-result glass animate-fade">
                                <div className="audio-result-header">
                                    <div className="audio-waveform-mini">{Array.from({ length: 20 }).map((_, i) => <span key={i} className="mini-bar" style={{ animationDelay: `${i * 0.07}s` }} />)}</div>
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

                                <audio
                                    ref={audioRef}
                                    src={result.url}
                                    onEnded={() => setPlaying(false)}
                                    style={{ display: 'none' }}
                                />

                                <div className="audio-controls">
                                    <button className="audio-play-btn" onClick={handlePlayPause} aria-label={playing ? 'Pause' : 'Play'}>
                                        {playing ? <Pause size={22} /> : <Play size={22} />}
                                    </button>
                                    <div className="audio-progress-bar">
                                        <div className="audio-progress-fill" style={{ width: playing ? '50%' : '0%' }} />
                                    </div>
                                    <a href={result.url} download={`voicegen-${result.id}.mp3`} className="audio-download-btn" aria-label="Download">
                                        <Download size={18} />
                                    </a>
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
