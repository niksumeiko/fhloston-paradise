import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    CardLayout,
    UserCard,
    UserDescription,
    UserPicture,
} from '../../design-system';
import { useAuth } from '../../domain/user/AuthProvider.ts';

export function DashboardPage() {
    const navigate = useNavigate();
    const { getAuth, logout } = useAuth();
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
        logout();
        navigate('/login');
    };

    return (
        <CardLayout>
            <UserCard>
                <UserPicture src={auth.user.picture} alt={auth.user.name} />
                <UserDescription>
                    Welcome, {auth.user.name} &lt;{auth.user.email}&gt;
                </UserDescription>
            </UserCard>
            <Button variant="secondary" onClick={handleLogout}>
                Logout
            </Button>
        </CardLayout>
    );
}
