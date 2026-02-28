const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userService = {
    getProfile: async () => {
        return Promise.resolve({
            name: 'Maaz Ali',
            email: 'maaz@example.com',
            preferences: {
                defaultVoice: 'Aria',
                theme: 'dark'
            }
        });
    },

    updateProfile: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(data), 500);
        });
    },

    changePassword: async (current, newPass) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 1000);
        });
    }
};
