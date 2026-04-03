// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import App from '../../../App';
import { ContextProvider } from '../../../common/context';
import { createAuthProvider } from '../../../domain/user/AuthProvider';
import type { AuthResponse } from '../../../domain/user/AuthAdapter';

const korben: AuthResponse = {
    token: 'fhloston-token',
    user: {
        id: 1,
        name: 'Korben Dallas',
        email: 'korben@fhloston.com',
        picture: '/korben.jpg',
    },
};

function renderApp(fakeAuth: {
    getAuth: () => AuthResponse | null;
    login: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
}, route = '/') {
    return render(
        <ContextProvider providers={[createAuthProvider(fakeAuth)]}>
            <MemoryRouter initialEntries={[route]}>
                <App />
            </MemoryRouter>
        </ContextProvider>,
    );
}

describe('Authentication', () => {
    it('successfully logs in and shows dashboard', async () => {
        let data: AuthResponse | null = null;
        const fakeAuth = {
            getAuth: () => data,
            login: () => {
                data = korben;
                return Promise.resolve(korben);
            },
            logout: () => {},
        };

        renderApp(fakeAuth, '/login');
        const user = userEvent.setup();

        await user.type(screen.getByLabelText('Email'), 'korben@fhloston.com');
        await user.type(screen.getByLabelText('Password'), 'xyzxyz');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(await screen.findByText(/Korben Dallas/)).toBeInTheDocument();
    });

    it('shows error for invalid credentials', async () => {
        const fakeAuth = {
            getAuth: () => null,
            login: () => Promise.reject(new Error('Invalid credentials')),
            logout: () => {},
        };

        renderApp(fakeAuth, '/login');
        const user = userEvent.setup();

        await user.type(screen.getByLabelText('Email'), 'korben@fhloston.com');
        await user.type(screen.getByLabelText('Password'), 'xyzxyz');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
        const fakeAuth = {
            getAuth: () => null,
            login: () => Promise.reject(new Error('should not be called')),
            logout: () => {},
        };

        renderApp(fakeAuth, '/login');
        const user = userEvent.setup();

        await user.type(screen.getByLabelText('Email'), 'korben');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(
            await screen.findByText('Please enter a valid email'),
        ).toBeInTheDocument();
    });

    it('redirects unauthenticated user from dashboard to login', () => {
        const fakeAuth = {
            getAuth: () => null,
            login: () => Promise.reject(new Error('should not be called')),
            logout: () => {},
        };

        renderApp(fakeAuth, '/');

        expect(
            screen.getByRole('heading', { name: 'Authenticate' }),
        ).toBeInTheDocument();
    });

    it('logs out and returns to login page', async () => {
        let data: AuthResponse | null = korben;
        const fakeAuth = {
            getAuth: () => data,
            login: () => Promise.reject(new Error('should not be called')),
            logout: () => {
                data = null;
            },
        };

        renderApp(fakeAuth, '/');
        const user = userEvent.setup();

        expect(screen.getByText(/Korben Dallas/)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Logout' }));

        expect(
            await screen.findByRole('heading', { name: 'Authenticate' }),
        ).toBeInTheDocument();
    });
});
