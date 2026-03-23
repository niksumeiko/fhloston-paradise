import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, clearAuth } from '../auth/AuthService';

export function DashboardPage() {
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        if (!auth) {
            navigate('/login');
        }
    }, [auth, navigate]);

    if (!auth) {
        return null;
    }

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-sm space-y-6 rounded bg-white p-8 text-center shadow">
                <img
                    src={auth.user.picture}
                    alt={auth.user.email}
                    className="mx-auto h-32 w-32 rounded-full shadow-md"
                />
                <h1 className="text-xl font-semibold">
                    Welcome, {auth.user.name} &lt;{auth.user.email}&gt;
                </h1>
                <button
                    onClick={handleLogout}
                    className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
