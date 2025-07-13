import React from 'react';
import clsx from 'clsx';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    className,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';

    const variants = {
        primary: 'bg-oak-600 hover:bg-oak-700 focus:ring-oak-500 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
        success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
        outline: 'border border-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white',
        ghost: 'hover:bg-gray-700 focus:ring-gray-500 text-gray-300 hover:text-white'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

    return (
        <button
            className={clsx(
                baseClasses,
                variants[variant],
                sizes[size],
                disabled && disabledClasses,
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}

            {Icon && iconPosition === 'left' && !loading && (
                <Icon className={clsx('h-4 w-4', children && 'mr-2')} />
            )}

            {children}

            {Icon && iconPosition === 'right' && !loading && (
                <Icon className={clsx('h-4 w-4', children && 'ml-2')} />
            )}
        </button>
    );
};

export default Button;