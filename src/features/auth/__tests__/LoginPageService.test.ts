import { describe, expect, test } from 'vitest';
import { validateLoginForm } from '../LoginPageService';

describe('LoginPageService', () => {
    describe('validateLoginForm', () => {
        test('returns error messages for invalid email and password', () => {
            const result = validateLoginForm({
                email: 'invalid-email',
                password: '123',
            });

            expect(result).toEqual({
                email: 'Please enter a valid email',
                password: 'Password must be at least 6 characters',
            });
        });
        test('returns no errors for valid email and password', () => {
            const result = validateLoginForm({
                email: 'valid@example.com',
                password: 'validpassword',
            });

            expect(result).toBeUndefined();
        });
    });
});
