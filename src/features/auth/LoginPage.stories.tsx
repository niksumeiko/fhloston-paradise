import { AuthProvider, type AuthAdapter, type User } from './AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './LoginPage';

// Story for rejection — adapter runs in the browser, React try/catch handles it
export function LoginPageWithError() {
    const adapter: AuthAdapter = {
        login: async () => {
            throw new Error('Invalid email or password');
        },
    };
    return (
        <MemoryRouter initialEntries={['/login']}>
            <AuthProvider adapter={adapter}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<div>Welcome aboard</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}

// Story for success — user is a plain serialisable prop, adapter is browser-side
export function LoginPageWithSuccess({ user }: { user: User }) {
    const adapter: AuthAdapter = {
        login: async () => ({ token: 'fake-token', user }),
    };
    return (
        <MemoryRouter initialEntries={['/login']}>
            <AuthProvider adapter={adapter}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<div>Welcome aboard</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}
