import { type ReactNode } from 'react';

interface AlertProps {
    variant: 'error';
    id?: string;
    children: ReactNode;
}

const styles = {
    error: 'text-sm text-red-600',
};

export function Alert({id, variant, children }: AlertProps) {
    return <p id={`${id}-alert`} className={styles[variant]}>{children}</p>;
}
