import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { getAuth, setAuth } from './AuthService';
import { useAuthAdapter } from './AuthContext';
import {
    Alert,
    CardLayout,
    Title,
    FormField,
    TextInput,
    Button,
} from '../../design-system';

export function LoginPage() {
    const navigate = useNavigate();
    const auth = useAuthAdapter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState('');

    if (getAuth()) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFieldErrors({});
        setApiError('');

        const result = z
            .object({
                email: z.string().email('Please enter a valid email'),
                password: z
                    .string()
                    .min(6, 'Password must be at least 6 characters'),
            })
            .safeParse({ email, password });

        if (!result.success) {
            const errors: Record<string, string> = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as string;
                errors[field] = issue.message;
            }
            setFieldErrors(errors);
            return;
        }

        try {
            const { token, user } = await auth.login(email, password);
            setAuth(token, user);
            navigate('/');
        } catch (err) {
            setApiError(
                err instanceof Error ? err.message : 'Something went wrong',
            );
        }
    }

    return (
        <CardLayout>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Title>Authenticate</Title>

                <FormField
                    label="Email"
                    htmlFor="email"
                    error={fieldErrors.email}
                >
                    <TextInput
                        id="email"
                        value={email}
                        onChange={setEmail}
                    />
                </FormField>

                <FormField
                    label="Password"
                    htmlFor="password"
                    error={fieldErrors.password}
                >
                    <TextInput
                        id="password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                    />
                </FormField>

                {apiError && (
                    <Alert variant="error">{apiError}</Alert>
                )}

                <Button type="submit">Login</Button>
            </form>
        </CardLayout>
    );
}
