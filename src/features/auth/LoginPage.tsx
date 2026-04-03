import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { validateLoginForm } from './LoginPageService';
import {
    Alert,
    Button,
    CardLayout,
    FormField,
    TextInput,
    Title,
} from '../../design-system';
import { useAuth } from '../../domain/user/AuthProvider';

export function LoginPage() {
    const navigate = useNavigate();
    const { getAuth, login } = useAuth();
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

        const errors = validateLoginForm({ email, password });

        if (errors) {
            setFieldErrors(errors);
            return;
        }

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setApiError((err as Error).message);
        }
    }

    return (
        <CardLayout>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Title>Authenticate</Title>

                <FormField label="Email" htmlFor="email" error={fieldErrors.email}>
                    <TextInput id="email" value={email} onChange={setEmail} />
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

                {apiError && <Alert variant="error">{apiError}</Alert>}

                <Button type="submit">Login</Button>
            </form>
        </CardLayout>
    );
}
