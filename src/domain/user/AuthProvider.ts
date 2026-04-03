import type { AuthResponse } from './AuthAdapter';
import { createGenericContext } from '../../common/context';

export type AuthAdapter = {
    getAuth(): AuthResponse | null;
    login(email: string, password: string): Promise<AuthResponse>;
    logout(): void;
};

export const { useContext, createContextProvider: createAuthProvider } =
    createGenericContext<AuthAdapter>();

export const useAuth = () => {
    return useContext().value;
};
