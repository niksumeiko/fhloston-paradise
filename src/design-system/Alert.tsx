import { type ReactNode } from 'react';

interface AlertProps {
    variant: 'error';
    children: ReactNode;
}

const styles = {
    error: 'text-sm text-red-600',
};

export function Alert({ variant, children }: AlertProps) {
    return (
        <p data-cy="alert" className={styles[variant]}>
            {children}
        </p>
    );
}
