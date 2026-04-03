import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../domain/user/AuthProvider';

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { getAuth } = useAuth();
    const auth = getAuth();

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
