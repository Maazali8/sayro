import { useState, useRef, useEffect, useCallback } from 'react';

// Singleton to manage current playing audio across the app
let currentPlayingAudio = null;

export const useAudio = () => {
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const blobUrls = useRef(new Set());

    const stopAll = useCallback(() => {
        if (currentPlayingAudio && currentPlayingAudio !== audioRef.current) {
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;
        }
    }, []);

    const play = useCallback((url) => {
        stopAll();

        if (audioRef.current.src !== url) {
            audioRef.current.src = url;
        }

        audioRef.current.play();
        currentPlayingAudio = audioRef.current;
        setIsPlaying(true);
    }, [stopAll]);

    const pause = useCallback(() => {
        audioRef.current.pause();
        setIsPlaying(false);
    }, []);

    const toggle = useCallback((url) => {
        if (isPlaying) {
            pause();
        } else {
            play(url);
        }
    }, [isPlaying, pause, play]);

    const createAudioUrl = useCallback((blob) => {
        const url = URL.createObjectURL(blob);
        blobUrls.current.add(url);
        return url;
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);

            // Cleanup blob URLs to prevent memory leaks
            blobUrls.current.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    return {
        isPlaying,
        progress,
        duration,
        play,
        pause,
        toggle,
        createAudioUrl,
        seek: (val) => {
            const time = (val / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
            setProgress(val);
        }
    };
};
