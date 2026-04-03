import { z } from 'zod';

const loginFormSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.input<typeof loginFormSchema>;

export function validateLoginForm(
    values: LoginFormValues,
): Record<string, string> | undefined {
    const result = loginFormSchema.safeParse(values);

    if (result.success) {
        return undefined;
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
    }
    return errors;
}
