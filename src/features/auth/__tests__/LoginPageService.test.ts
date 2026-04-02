import { describe, expect, it } from 'vitest';
import { validateLoginForm } from '../LoginPageService';

describe('LoginPageService', () => {
    describe('validateLoginForm', () => {
        it('returns undefined for valid credentials', () => {
            const result = validateLoginForm({
                email: 'korben@fhloston.com',
                password: 'xyzxyz',
            });

            expect(result).toBeUndefined();
        });

        it('returns both errors for invalid email and short password', () => {
            const result = validateLoginForm({
                email: 'korben',
                password: 'xyz',
            });

            expect(result).toEqual({
                email: 'Please enter a valid email',
                password: 'Password must be at least 6 characters',
            });
        });
    });
});
