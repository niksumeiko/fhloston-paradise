import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { clearAuth } from './AuthService';

function createFakeFetch(responses: Record<string, { status: number; body: object }>) {
    return async (url: string, init?: RequestInit) => {
        const body = JSON.parse(init?.body as string);
        const key = `${body.email}:${body.password}`;
        const response = responses[key] ?? { status: 401, body: { message: 'Invalid email or password' } };

        return {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            json: () => Promise.resolve(response.body),
        };
    };
}

const passengerManifest = {
    'korben@fhloston.com:multipass': {
        status: 200,
        body: {
            token: 'boarding-token-korben',
            user: { id: 1, name: 'Korben Dallas', email: 'korben@fhloston.com', picture: '/images/korben.png' },
        },
    },
    'leeloo@fhloston.com:leeloo123': {
        status: 200,
        body: {
            token: 'boarding-token-leeloo',
            user: { id: 2, name: 'Leeloo', email: 'leeloo@fhloston.com', picture: '/images/leeloo.png' },
        },
    },
    'ruby@fhloston.com:greenrocks': {
        status: 200,
        body: {
            token: 'boarding-token-ruby',
            user: { id: 3, name: 'Ruby Rhod', email: 'ruby@fhloston.com', picture: '/images/ruby.png' },
        },
    },
};

const originalFetch = globalThis.fetch;

function renderLoginPage() {
    return render(
        <MemoryRouter initialEntries={['/login']}>
            <LoginPage />
        </MemoryRouter>,
    );
}

async function submitCredentials(email: string, password: string) {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), email);
    await user.type(screen.getByLabelText('Password'), password);
    await user.click(screen.getByRole('button', { name: 'Login' }));
}

describe('The boarding gate', () => {
    beforeEach(() => {
        clearAuth();
        globalThis.fetch = createFakeFetch(passengerManifest) as typeof fetch;
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    it('rejects passengers with unknown credentials', async () => {
        renderLoginPage();

        await submitCredentials('zorg@fhloston.com', 'destroyall');

        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    it('rejects a known passenger with wrong password', async () => {
        renderLoginPage();

        await submitCredentials('korben@fhloston.com', 'wrongpassword');

        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    it('grants Korben Dallas access with valid credentials', async () => {
        renderLoginPage();

        await submitCredentials('korben@fhloston.com', 'multipass');

        expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
    });

    it('grants Leeloo access with valid credentials', async () => {
        renderLoginPage();

        await submitCredentials('leeloo@fhloston.com', 'leeloo123');

        expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
    });

    it('grants Ruby Rhod access with valid credentials', async () => {
        renderLoginPage();

        await submitCredentials('ruby@fhloston.com', 'greenrocks');

        expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
    });
});
