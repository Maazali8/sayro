/**
 * TTS Service — powered by Puter.js (puter.ai.txt2speech)
 * ─────────────────────────────────────────────────────────
 * Uses AWS Polly (neural engine) via Puter.js, which is free for end-users.
 * Returns a real blob URL so audio can be played in-page AND downloaded.
 *
 * puter.ai.txt2speech(text, options) → Promise<HTMLAudioElement>
 * The element's .src is a blob URL we extract and store for later use.
 */

// ─── LocalStorage key for history ────────────────────────────────────────────
const HISTORY_KEY = 'vgai_history';

// ─── AWS Polly voice map ──────────────────────────────────────────────────────
// Maps our internal voice IDs → real AWS Polly voice names
export const POLLY_VOICES = {
    aria: { polly: 'Joanna', desc: 'Warm, professional female' },
    james: { polly: 'Matthew', desc: 'Deep, confident male' },
    luna: { polly: 'Salli', desc: 'Soft, calm female' },
    ethan: { polly: 'Joey', desc: 'Energetic young male' },
    nova: { polly: 'Kendra', desc: 'Clear, neutral female' },
    ryan: { polly: 'Justin', desc: 'Friendly, casual male' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const loadHistory = () => {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
        return [];
    }
};

const saveHistory = (items) => {
    // Keep only the last 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 50)));
};

const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};

// ─── Core generate using Puter.js ─────────────────────────────────────────────
const generateWithPuter = async (text, voiceId, language, engine = 'neural') => {
    if (!window.puter || !window.puter.ai) {
        throw new Error('Puter.js is not loaded. Please refresh the page.');
    }

    const pollyVoice = POLLY_VOICES[voiceId]?.polly ?? 'Joanna';

    // puter.ai.txt2speech returns an HTMLAudioElement with a blob src
    const audioEl = await window.puter.ai.txt2speech(text, {
        voice: pollyVoice,
        engine: engine,      // 'neural' gives the best quality
        language: language,
    });

    // Extract the blob URL from the returned audio element
    const blobUrl = audioEl.src;
    return { audioEl, blobUrl };
};

// ─── Public service object ────────────────────────────────────────────────────
export const ttsService = {
    /**
     * Generates speech for the given text using Puter.js (AWS Polly neural).
     * Returns a result object with a real blob URL for playback and download.
     *
     * @param {string} text        - Text to synthesize (max 3000 chars)
     * @param {string} voiceId     - Internal voice ID ('aria', 'james', etc.)
     * @param {string} language    - BCP-47 language code e.g. 'en-US'
     * @param {number} speed       - Unused (AWS Polly doesn't support speed via Puter.js directly)
     */
    generate: async (text, voiceId, language, speed) => {
        const { audioEl, blobUrl } = await generateWithPuter(text, voiceId, language);

        // Measure duration by loading the audio element
        const durationSec = await new Promise((resolve) => {
            if (audioEl.duration && isFinite(audioEl.duration)) {
                resolve(audioEl.duration);
                return;
            }
            const onMeta = () => {
                resolve(isFinite(audioEl.duration) ? audioEl.duration : 0);
                audioEl.removeEventListener('loadedmetadata', onMeta);
            };
            audioEl.addEventListener('loadedmetadata', onMeta);
            // 3-second safety timeout
            setTimeout(() => resolve(0), 3000);
        });

        const record = {
            id: Date.now().toString(),
            url: blobUrl,
            text,
            voice: voiceId,
            language,
            duration: formatDuration(durationSec),
            date: new Date().toLocaleDateString(),
        };

        // Persist to local history
        const history = loadHistory();
        saveHistory([record, ...history]);

        return record;
    },

    /**
     * Stop any currently playing audio.
     * (Call audioEl.pause() directly on the component side; this is a no-op kept for API compat.)
     */
    stop: () => { },

    /**
     * Get history from localStorage.
     */
    getHistory: async () => {
        return loadHistory();
    },

    /**
     * Delete a history entry by id.
     */
    deleteHistory: async (id) => {
        const history = loadHistory().filter((h) => h.id !== id);
        saveHistory(history);
    },
};
