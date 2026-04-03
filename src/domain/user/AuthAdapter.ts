export interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        picture: string;
    };
}

function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Something went wrong';
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    try {
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
        setAuth(token, user);

        return { token, user };
    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function getAuth(): AuthResponse | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);

    if (!token || !userJson) {
        return null;
    }

    return { token, user: JSON.parse(userJson) };
}

function setAuth(token: string, user: AuthResponse['user']): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}
