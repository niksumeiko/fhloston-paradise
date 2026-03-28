import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from './AuthService';

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const auth = getAuth();
    console.log({ auth })

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
