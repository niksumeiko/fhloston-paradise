interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        picture: string;
    };
}

function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Something went wrong';
}

export async function login(
    email: string,
    password: string,
): Promise<AuthResponse> {
    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return response.json();
    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}
