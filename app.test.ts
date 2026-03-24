import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './app';

const boardingSecret = 'fhloston-paradise-secret';

async function attemptBoarding(email: string, password: string) {
    return request(app).post('/api/login').send({ email, password });
}

describe('The boarding gate', () => {
    it('rejects passengers with unknown credentials', async () => {
        const response = await attemptBoarding('zorg@fhloston.com', 'destroyall');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid email or password' });
    });

    it('rejects a known passenger with wrong password', async () => {
        const response = await attemptBoarding('korben@fhloston.com', 'wrongpassword');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid email or password' });
    });

    it.each([
        {
            name: 'Korben Dallas',
            email: 'korben@fhloston.com',
            password: 'multipass',
            expectedUser: { id: 1, name: 'Korben Dallas', email: 'korben@fhloston.com', picture: '/images/korben.png' },
        },
        {
            name: 'Leeloo',
            email: 'leeloo@fhloston.com',
            password: 'leeloo123',
            expectedUser: { id: 2, name: 'Leeloo', email: 'leeloo@fhloston.com', picture: '/images/leeloo.png' },
        },
        {
            name: 'Ruby Rhod',
            email: 'ruby@fhloston.com',
            password: 'greenrocks',
            expectedUser: { id: 3, name: 'Ruby Rhod', email: 'ruby@fhloston.com', picture: '/images/ruby.png' },
        },
    ])('grants $name access with valid credentials', async ({ email, password, expectedUser }) => {
        const response = await attemptBoarding(email, password);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            token: expect.any(String),
            user: expectedUser,
        });
    });

    it('provides a boarding token containing the passenger identity', async () => {
        const response = await attemptBoarding('korben@fhloston.com', 'multipass');

        const payload = jwt.verify(response.body.token, boardingSecret);

        expect(payload).toEqual(
            expect.objectContaining({ id: 1, email: 'korben@fhloston.com' }),
        );
    });

    it('never exposes passenger password in the response', async () => {
        const response = await attemptBoarding('korben@fhloston.com', 'multipass');

        expect(response.body.user).not.toHaveProperty('password');
    });
});
