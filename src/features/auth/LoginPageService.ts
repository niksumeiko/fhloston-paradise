import { z } from 'zod';

export function validateLoginForm({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    const result = z
        .object({
            email: z.email('Please enter a valid email'),
            password: z.string().min(6, 'Password must be at least 6 characters'),
        })
        .safeParse({ email, password });

    const errors: Record<string, string> = {};
    if (!result.success) {
        for (const issue of result.error.issues) {
            const field = issue.path[0] as string;
            errors[field] = issue.message;
        }
        return errors;
    }

    return;
}
