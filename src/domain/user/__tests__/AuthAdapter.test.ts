import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getAuth, login, logout } from '../AuthAdapter';

class FakeStorage {
    private store: Record<string, string> = {};

    clear() {
        this.store = {};
    }
    getItem(key: string) {
        return this.store[key] ?? null;
    }
    setItem(key: string, value: string) {
        this.store[key] = value;
    }
    removeItem(key: string) {
        delete this.store[key];
    }
}

globalThis.localStorage = new FakeStorage() as unknown as Storage;

const loginResponse = {
    token: 'fhloston-token',
    user: {
        id: 1,
        name: 'Korben Dallas',
        email: 'korben@fhloston.com',
        picture: '/korben.jpg',
    },
};

const successHandler = http.post('http://localhost:3001/api/login', () => {
    return HttpResponse.json(loginResponse);
});

const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => globalThis.localStorage.clear());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AuthAdapter', () => {
    describe('login', () => {
        it('returns token and user on successful login', async () => {
            server.use(successHandler);

            const result = await login('korben@fhloston.com', 'multipass');

            expect(result).toEqual(loginResponse);
        });

        it('persists auth so getAuth retrieves it', async () => {
            server.use(successHandler);

            await login('korben@fhloston.com', 'multipass');

            expect(getAuth()).toEqual(loginResponse);
        });

        it('throws error on 401 unauthorized', async () => {
            server.use(
                http.post('http://localhost:3001/api/login', () => {
                    return HttpResponse.json(
                        { message: 'Invalid credentials' },
                        { status: 401 },
                    );
                }),
            );

            await expect(login('korben@fhloston.com', 'wrong')).rejects.toThrow(
                'Invalid credentials',
            );
        });

        it('throws error on network failure', async () => {
            server.use(
                http.post('http://localhost:3001/api/login', () => {
                    return HttpResponse.error();
                }),
            );

            await expect(login('korben@fhloston.com', 'multipass')).rejects.toThrow();
        });
    });

    describe('getAuth', () => {
        it('returns null when not logged in', () => {
            expect(getAuth()).toBeNull();
        });
    });

    describe('logout', () => {
        it('clears auth so getAuth returns null', async () => {
            server.use(successHandler);
            await login('korben@fhloston.com', 'multipass');

            logout();

            expect(getAuth()).toBeNull();
        });
    });
});
