import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getAuth, login, logout } from '../AuthAdapter';

class StorageImpl {
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

globalThis.localStorage = new StorageImpl() as unknown as Storage;

const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => globalThis.localStorage.clear());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AuthAdapter', () => {
    describe('login', () => {
        it('returns token and user on successful login', async () => {
            server.use(
                http.post('http://localhost:3001/api/login', () => {
                    return HttpResponse.json({
                        token: 'fhloston-token',
                        user: {
                            id: 1,
                            name: 'Korben Dallas',
                            email: 'korben@fhloston.com',
                            picture: '/korben.jpg',
                        },
                    });
                }),
            );

            const result = await login('korben@fhloston.com', 'xyzxyz');

            expect(result).toEqual({
                token: 'fhloston-token',
                user: {
                    id: 1,
                    name: 'Korben Dallas',
                    email: 'korben@fhloston.com',
                    picture: '/korben.jpg',
                },
            });
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

            return expect(login('korben@fhloston.com', 'wrongpassword')).rejects.toThrow(
                'Invalid credentials',
            );
        });

        it('throws error on network failure', async () => {
            server.use(
                http.post('http://localhost:3001/api/login', () => {
                    return HttpResponse.error();
                }),
            );

            return expect(login('korben@fhloston.com', 'xyzxyz')).rejects.toThrow();
        });
    });

    describe('getAuth', () => {
        it('returns null when no auth in storage', () => {
            expect(getAuth()).toBeNull();
        });

        it('returns token and user when auth is in storage', () => {
            const token = 'fhloston-token';
            const user = {
                id: 1,
                name: 'Korben Dallas',
                email: 'korben@fhloston.com',
                picture: '/korben.jpg',
            };
            globalThis.localStorage.setItem('token', token);
            globalThis.localStorage.setItem('user', JSON.stringify(user));

            expect(getAuth()).toEqual({ token: token, user: user });
        });
    });

    describe('logout', () => {
        it('removes token and user from storage', () => {
            globalThis.localStorage.setItem('token', 'fhloston-token');
            globalThis.localStorage.setItem(
                'user',
                JSON.stringify({
                    id: 1,
                    name: 'Korben Dallas',
                    email: 'korben@fhloston.com',
                    picture: '/korben.jpg',
                }),
            );

            logout();

            expect(globalThis.localStorage.getItem('token')).toBeNull();
            expect(globalThis.localStorage.getItem('user')).toBeNull();
        });
    });
});
