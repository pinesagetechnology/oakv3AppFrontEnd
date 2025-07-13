import React from 'react';
import clsx from 'clsx';

const Card = ({
    children,
    title,
    subtitle,
    icon: Icon,
    actions,
    padding = 'md',
    className,
    ...props
}) => {
    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8'
    };

    return (
        <div
            className={clsx(
                'bg-gray-800 rounded-lg border border-gray-700',
                paddings[padding],
                className
            )}
            {...props}
        >
            {(title || subtitle || Icon || actions) && (
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        {Icon && (
                            <Icon className="h-5 w-5 text-oak-400 mr-3" />
                        )}
                        <div>
                            {title && (
                                <h3 className="text-lg font-medium text-white">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-400 mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className="flex items-center space-x-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            {children}
        </div>
    );
};

export default Card;