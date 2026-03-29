import { type ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    id?: string;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
}

const styles = {
    primary:
        'w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700',
    secondary: 'rounded bg-gray-200 px-4 py-2 hover:bg-gray-300',
};

export function Button({
    children,
    id,
    type = 'button',
    variant = 'primary',
    onClick,
}: ButtonProps) {
    return (
        <button id={id} type={type} onClick={onClick} className={styles[variant]}>
            {children}
        </button>
    );
}
