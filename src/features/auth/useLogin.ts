import { Auth, useAuthAdapter } from './AuthProvider';

interface LoginResult {
    data: Auth | null;
    error: string | null;
}

export function useLogin() {
    const adapter = useAuthAdapter();

    async function login(email: string, password: string): Promise<LoginResult> {
        const result = await adapter.authenticate(email, password);

        if (result instanceof Error) {
            return { data: null, error: result.message };
        }

        return { data: result, error: null };
    }

    function getAuth() {
        return adapter.getAuth();
    }

    function logout() {
        adapter.logout();
    }

    return { login, getAuth, logout };
}
