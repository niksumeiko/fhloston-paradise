import { createContext, useContext } from 'react';

export interface User {
    id: number;
    name: string;
    email: string;
    picture: string;
}

// The port — defines what auth can do, not how
export interface AuthAdapter {
    login(email: string, password: string): Promise<{ token: string; user: User }>;
}

const AuthContext = createContext<AuthAdapter | null>(null);

export function AuthProvider({
    adapter,
    children,
}: {
    adapter: AuthAdapter;
    children: React.ReactNode;
}) {
    return (
        <AuthContext.Provider value={adapter}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthAdapter(): AuthAdapter {
    const adapter = useContext(AuthContext);
    if (!adapter) throw new Error('useAuthAdapter must be used within an AuthProvider');
    return adapter;
}
