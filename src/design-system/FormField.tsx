import { type ReactNode } from 'react';
import { Alert } from './Alert';

interface FormFieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
    console.log(error)
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
                {label}
            </label>
            {children}
            {error && <Alert variant="error">{error}</Alert>}
        </div>
    );
}
