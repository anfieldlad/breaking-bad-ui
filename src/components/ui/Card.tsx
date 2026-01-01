import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'green' | 'blue';
    className?: string;
    title?: string;
}

export const Card = ({ children, variant = 'default', className = '', title }: CardProps) => {
    const variantStyles = {
        default: 'glass',
        green: 'glass-green',
        blue: 'glass-blue',
    };

    return (
        <div className={`rounded-2xl p-6 ${variantStyles[variant]} ${className}`}>
            {title && (
                <h3 className={`text-xl font-bold mb-4 ${variant === 'blue' ? 'text-bad-blue' : 'text-bad-green'}`}>
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};
