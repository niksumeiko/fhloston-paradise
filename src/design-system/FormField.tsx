import { type ReactNode } from 'react';
import { Alert } from './Alert';

interface FormFieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
                {label}
            </label>
            {children}
            {error && <Alert id={htmlFor} variant="error">{error}</Alert>}
        </div>
    );
}
