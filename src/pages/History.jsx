import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, Trash2, Search, Filter, Clock, Mic2 } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { ttsService } from '../services/ttsService';
import { useToast } from '../contexts/ToastContext';
import './History.css';

const History = () => {
    const { addToast } = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterVoice, setFilterVoice] = useState('all');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await ttsService.getHistory();
                setItems(data);
            } catch {
                addToast('Failed to load history.', 'error');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const voices = ['all', ...new Set(items.map((i) => i.voice))];

    const filtered = items.filter((item) => {
        const matchSearch = item.text.toLowerCase().includes(search.toLowerCase());
        const matchVoice = filterVoice === 'all' || item.voice === filterVoice;
        return matchSearch && matchVoice;
    });

    const handlePlay = (item) => {
        if (!item.url) {
            addToast('No audio available for this entry.', 'error');
            return;
        }
        if (playingId === item.id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                // Stop any currently playing audio first
                audioRef.current.pause();
                audioRef.current.src = item.url;
                audioRef.current.play();
            }
            setPlayingId(item.id);
        }
    };

    const handleDownload = (item) => {
        if (!item.url) return;
        const a = document.createElement('a');
        a.href = item.url;
        a.download = `voicegen-${item.id}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await ttsService.deleteHistory(deleteTarget.id);
            setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
            addToast('Recording deleted.', 'success');
            setDeleteTarget(null);
        } catch {
            addToast('Failed to delete. Try again.', 'error');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <AppLayout>
            <div className="history-page animate-fade">
                <div className="history-header">
                    <div>
                        <h1 className="page-title">History</h1>
                        <p className="page-subtitle">{items.length} recordings in your library</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="history-filters glass">
                    <div className="search-wrap">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search recordings..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-wrap">
                        <Filter size={15} className="filter-icon" />
                        <select
                            className="select-field filter-select"
                            value={filterVoice}
                            onChange={(e) => setFilterVoice(e.target.value)}
                        >
                            {voices.map((v) => (
                                <option key={v} value={v}>{v === 'all' ? 'All voices' : v}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="history-loading">
                        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius)' }} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="history-empty glass">
                        <Mic2 size={40} style={{ color: 'var(--muted)', opacity: 0.4 }} />
                        <p>No recordings found</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Try adjusting your search or generate some audio on the Dashboard</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {filtered.map((item) => (
                            <div key={item.id} className="history-item glass">
                                <div className="history-item-text">
                                    <p className="history-text-preview">{item.text}</p>
                                    <div className="history-meta">
                                        <span className="history-voice-badge">{item.voice}</span>
                                        <span className="history-meta-dot">·</span>
                                        <Clock size={12} />
                                        <span>{item.duration}</span>
                                        <span className="history-meta-dot">·</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                                <div className="history-actions">
                                    <button
                                        className={`history-action-btn ${playingId === item.id ? 'playing' : ''}${!item.url ? ' disabled' : ''}`}
                                        onClick={() => handlePlay(item)}
                                        title={item.url ? (playingId === item.id ? 'Pause' : 'Play') : 'No audio available'}
                                        disabled={!item.url}
                                    >
                                        {playingId === item.id ? <Pause size={16} /> : <Play size={16} />}
                                    </button>
                                    <button
                                        className={`history-action-btn${!item.url ? ' disabled' : ''}`}
                                        onClick={() => handleDownload(item)}
                                        title={item.url ? 'Download MP3' : 'No audio available'}
                                        disabled={!item.url}
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button
                                        className="history-action-btn danger"
                                        onClick={() => setDeleteTarget(item)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hidden audio */}
                <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

                {/* Delete confirmation modal */}
                <Modal
                    isOpen={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    title="Delete Recording"
                    footer={
                        <>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                            <Button variant="danger" size="sm" isLoading={deleting} onClick={confirmDelete}>Delete</Button>
                        </>
                    }
                >
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Are you sure you want to delete this recording?<br />
                        <strong style={{ color: 'var(--text)' }}>"{deleteTarget?.text?.slice?.(0, 60)}..."</strong>
                        <br /><br />
                        This action cannot be undone.
                    </p>
                </Modal>
            </div>
        </AppLayout>
    );
};

export default History;
