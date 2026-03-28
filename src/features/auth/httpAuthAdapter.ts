import type { AuthAdapter } from './AuthContext';

export const httpAuthAdapter: AuthAdapter = {
    async login(email, password) {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const { token, user } = await response.json();
        return { token, user };
    },
};
