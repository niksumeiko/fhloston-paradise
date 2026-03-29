import { describe, expect, it } from 'vitest';
import { validateFormInput } from '../LoginPageService.ts';

describe('LoginPageService', () => {
    describe('#validateFormInput', () => {
        it('returns valid for correct email and password', () => {
            const result = validateFormInput('test@example.com', 'password123');

            expect(result).toEqual({
                isFormInputValid: true,
                errors: {},
            });
        });

        it('returns an error for invalid email', () => {
            const result = validateFormInput('invalid-email', 'password123');

            expect(result).toEqual({
                isFormInputValid: false,
                errors: { email: 'Please enter a valid email' },
            });
        });

        it('returns an error for short password', () => {
            const result = validateFormInput('test@example.com', '123');

            expect(result).toEqual({
                isFormInputValid: false,
                errors: { password: 'Password must be at least 6 characters' },
            });
        });

        it('returns errors for both fields when both are invalid', () => {
            const result = validateFormInput('bad', '123');

            expect(result).toEqual({
                isFormInputValid: false,
                errors: {
                    email: 'Please enter a valid email',
                    password: 'Password must be at least 6 characters',
                },
            });
        });
    });
});
