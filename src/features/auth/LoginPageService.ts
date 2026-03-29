import { User } from './AuthService.ts';
import { z } from 'zod';

export type AuthResult = AuthenticationSuccess | AuthenticationFailure;

type AuthenticationSuccess = { isAuthenticated: true } & ApiAuthSuccess;

type AuthenticationFailure = {
    isAuthenticated: false;
    error: ApiAuthFailureError;
};

type ApiAuthSuccess = {
    isAuthenticated: true;
    token: string;
    user: User;
};

type ApiAuthFailureError = {
    message: string;
};

export const validateFormInput = (email: string, password: string) => {
    const formValidationResult = z
        .object({
            email: z.string().email('Please enter a valid email'),
            password: z.string().min(6, 'Password must be at least 6 characters'),
        })
        .safeParse({ email, password });

    if (!formValidationResult.success) {
        const errors: Record<string, string> = {};
        for (const issue of formValidationResult.error.issues) {
            const field = issue.path[0] as string;
            errors[field] = issue.message;
        }
        return { isFormInputValid: false, errors };
    }

    return { isFormInputValid: true, errors: {} };
};

export const authenticate = async (
    email: string,
    password: string,
): Promise<AuthResult> => {
    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const parsedResponse = await response.json().catch(() => undefined);

        if (!response.ok) {
            return {
                isAuthenticated: false,
                error: parsedResponse ?? {
                    status: response.status,
                    statusText: response.statusText,
                },
            };
        }

        return {
            isAuthenticated: true,
            token: parsedResponse?.token,
            user: parsedResponse?.user,
        };
    } catch (error) {
        return {
            isAuthenticated: false,
            error: {
                message:
                    error instanceof Error
                        ? String(error.message)
                        : 'Something went wrong',
            },
        };
    }
};
