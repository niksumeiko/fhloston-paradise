import { useActionState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAuth, setAuth } from './AuthService';
import {
    Alert,
    CardLayout,
    Title,
    FormField,
    TextInput,
    Button,
} from '../../design-system';

import { LoginActionResponse } from '../../types';
import { login } from '../lib/login';

const initialState: LoginActionResponse = {
    success: false,
    message: '',
    token: undefined,
    user: undefined,
    errors: undefined
}
export function LoginPage() {
    const [state, dispatchAction, isPending] = useActionState(login, initialState)
    const navigate = useNavigate();
    const { success, token, user } = state
    useEffect(() => {
        if (success && token && user) {
            console.log(user, 'use effect')
            setAuth(token, user)
            navigate('/')
        }
    }, [success, token, user, navigate])

    if (getAuth()) {
        return <Navigate to="/" replace />;
    }


    return (
        <CardLayout>
            <form action={dispatchAction} className="space-y-6">
                <Title>Authenticate</Title>

                <FormField
                    label="Email"
                    htmlFor="email"
                    error={state?.errors?.email?.[0]}
                >
                    <TextInput
                        id="email"
                        name='email'
                    />
                </FormField>

                <FormField
                    label="Password"
                    htmlFor="password"
                    error={state?.errors?.password?.[0]}
                >
                    <TextInput
                        id="password"
                        type="password"
                        name='password'
                    />
                </FormField>

                {state.message && !state.success && (
                    <Alert variant="error">{state.message}</Alert>
                )}

                <Button type="submit">{isPending ? 'Processing...' : 'Login'}</Button>
            </form>
        </CardLayout>
    );
}
