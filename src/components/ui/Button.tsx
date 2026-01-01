import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

    const variants = {
        primary: 'bg-bad-green text-bad-black hover:bg-bad-green/90 shadow-[0_0_15px_rgba(77,161,99,0.3)] focus:ring-bad-green',
        secondary: 'bg-bad-blue text-bad-black hover:bg-bad-blue/90 shadow-[0_0_15px_rgba(0,212,255,0.3)] focus:ring-bad-blue',
        outline: 'border-2 border-bad-green text-bad-green hover:bg-bad-green/10 focus:ring-bad-green',
        ghost: 'text-foreground hover:bg-white/5 focus:ring-white/20',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
