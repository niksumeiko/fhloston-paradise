import { User } from "../../types";

export const loginService = async (email: string, password: string): Promise<{ user: User, token: string, success: boolean, message: string }> => {
    const response = await fetch(`http://localhost:3001/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    const { user, token } = await response.json()
    return {
        success: true,
        message: 'Login Successful',
        user, token
    }
}