const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
    login: async (email, password) => {
        // Simulated API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: '1',
                    name: 'Maaz Ali',
                    email: email,
                    token: 'mock-jwt-token',
                });
            }, 1000);
        });
    },

    signup: async (name, email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: '1',
                    name: name,
                    email: email,
                    token: 'mock-jwt-token',
                });
            }, 1000);
        });
    },

    logout: () => {
        // Conceptually clear cookies/tokens
        return Promise.resolve();
    }
};
