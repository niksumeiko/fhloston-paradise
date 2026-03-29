import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, clearAuth } from '../auth/AuthService';
import {
    CardLayout,
    UserCard,
    UserPicture,
    UserDescription,
    Button,
} from '../../design-system';

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
        <CardLayout>
            <UserCard>
                <UserPicture
                    src={auth.user.picture}
                    alt={auth.user.name}
                />
                <UserDescription>
                    Welcome, {auth.user.name} &lt;{auth.user.email}&gt;
                </UserDescription>
            </UserCard>
            <Button id="logout" variant="secondary" onClick={handleLogout}>
                Logout
            </Button>
        </CardLayout>
    );
}
