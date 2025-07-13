import React from 'react';
import clsx from 'clsx';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className,
    ...props
}) => {
    const variants = {
        default: 'bg-gray-600 text-gray-100',
        primary: 'bg-oak-600 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-yellow-600 text-white',
        danger: 'bg-red-600 text-white',
        info: 'bg-blue-600 text-white'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-full font-medium',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;