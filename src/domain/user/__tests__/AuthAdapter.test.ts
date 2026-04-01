import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { login } from '../AuthAdapter';

const server = setupServer();

beforeAll(() => server.listen());
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

            expect(login('korben@fhloston.com', 'wrongpassword')).rejects.toThrow(
                'Invalid credentials',
            );
        });

        it('throws error on network failure', async () => {
            server.use(
                http.post('http://localhost:3001/api/login', () => {
                    return HttpResponse.error();
                }),
            );

            expect(login('korben@fhloston.com', 'xyzxyz')).rejects.toThrow();
        });
    });
});
