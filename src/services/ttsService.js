const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ttsService = {
    generate: async (text, voice, language, speed) => {
        // Simulated API call that would return a blob
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mocking a successful generation response
                resolve({
                    id: Date.now().toString(),
                    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Mock audio
                    text,
                    voice,
                    language,
                    duration: '0:45',
                    date: new Date().toLocaleDateString(),
                });
            }, 2000);
        });
    },

    getHistory: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '1', text: 'Welcome to VoiceGen AI', voice: 'Aria', date: '2026-02-21', duration: '0:12' },
                    { id: '2', text: 'The future of text to speech is here.', voice: 'James', date: '2026-02-20', duration: '0:08' },
                ]);
            }, 800);
        });
    },

    deleteHistory: async (id) => {
        return Promise.resolve();
    }
};
