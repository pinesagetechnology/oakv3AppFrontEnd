// frontend/src/components/UI/Toggle.jsx
import React from 'react';
import clsx from 'clsx';

const Toggle = ({
    checked = false,
    onChange,
    disabled = false,
    label,
    description,
    size = 'md',
    className,
    ...props
}) => {
    const sizes = {
        sm: {
            switch: 'h-4 w-8',
            thumb: 'h-3 w-3',
            translate: 'translate-x-4'
        },
        md: {
            switch: 'h-6 w-11',
            thumb: 'h-5 w-5',
            translate: 'translate-x-5'
        },
        lg: {
            switch: 'h-8 w-14',
            thumb: 'h-7 w-7',
            translate: 'translate-x-6'
        }
    };

    const sizeClasses = sizes[size];

    return (
        <div className={clsx('flex items-center', className)}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange?.(!checked)}
                className={clsx(
                    'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oak-500 focus:ring-offset-gray-900',
                    sizeClasses.switch,
                    checked ? 'bg-oak-600' : 'bg-gray-600',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
                {...props}
            >
                <span
                    className={clsx(
                        'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                        sizeClasses.thumb,
                        checked ? sizeClasses.translate : 'translate-x-0'
                    )}
                />
            </button>

            {(label || description) && (
                <div className="ml-3">
                    {label && (
                        <label className="text-sm font-medium text-gray-300">
                            {label}
                        </label>
                    )}
                    {description && (
                        <p className="text-sm text-gray-500">{description}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Toggle;