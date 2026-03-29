const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export interface User {
    id: number;
    name: string;
    email: string;
    picture: string;
}

export interface Auth {
    token: string;
    user: User;
}

export function getAuth(): Auth | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);

    if (!token || !userJson) {
        return null;
    }

    return { token, user: JSON.parse(userJson) };
}

export function setAuth(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}
