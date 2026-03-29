import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAuth, setAuth } from './AuthService';
import {
    Alert,
    Button,
    CardLayout,
    FormField,
    TextInput,
    Title,
} from '../../design-system';
import { authenticate, validateFormInput } from './LoginPageService.ts';

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string | null>(null);

    if (getAuth()) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFieldErrors({});
        setApiError('');

        const { isFormInputValid, errors } = validateFormInput(email, password);
        if (!isFormInputValid) {
            setFieldErrors(errors);
            return;
        }

        authenticate(email, password).then((result) => {
            if (result.isAuthenticated) {
                const { token, user } = result;
                setAuth(token, user);
                navigate('/');
            } else {
                const { error } = result;
                setApiError(error.message);
            }
        });
    };

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

                {apiError && (
                    <Alert id="login" variant="error">
                        {apiError}
                    </Alert>
                )}

                <Button id="login" type="submit">
                    Login
                </Button>
            </form>
        </CardLayout>
    );
}
