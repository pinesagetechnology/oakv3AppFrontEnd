import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({
    label,
    error,
    helperText,
    icon: Icon,
    iconPosition = 'left',
    size = 'md',
    variant = 'default',
    className,
    ...props
}, ref) => {
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    const variants = {
        default: 'bg-gray-700 border-gray-600 focus:border-oak-500',
        error: 'bg-gray-700 border-red-500 focus:border-red-500'
    };

    const inputVariant = error ? 'error' : variant;

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && iconPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}

                <input
                    ref={ref}
                    className={clsx(
                        'block w-full border rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-oak-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors',
                        sizes[size],
                        variants[inputVariant],
                        Icon && iconPosition === 'left' && 'pl-10',
                        Icon && iconPosition === 'right' && 'pr-10'
                    )}
                    {...props}
                />

                {Icon && iconPosition === 'right' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}

            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;