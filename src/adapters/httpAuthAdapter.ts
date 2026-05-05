import type { Auth, AuthAdapter } from '../features/auth/AuthProvider';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const httpAuthAdapter: AuthAdapter = {
    async authenticate(email, password) {
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                return new Error(error.message);
            }

            const { token, user } = await response.json();
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return { token, user };
        } catch (err) {
            return new Error(err instanceof Error ? err.message : 'Something went wrong');
        }
    },
    getAuth(): Auth | null {
        const token = localStorage.getItem(TOKEN_KEY);
        const userJson = localStorage.getItem(USER_KEY);

        if (!token || !userJson) {
            return null;
        }

        return { token, user: JSON.parse(userJson) };
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};
