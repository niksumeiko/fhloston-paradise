import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CardLayout,
    UserCard,
    UserPicture,
    UserDescription,
    Button,
} from '../../design-system';
import { useLogin } from '../auth/useLogin';

export function DashboardPage() {
    const navigate = useNavigate();
    const { getAuth, logout } = useLogin();
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
