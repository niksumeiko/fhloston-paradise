import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useLogin } from './useLogin';

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { getAuth } = useLogin();
    const auth = getAuth();

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
