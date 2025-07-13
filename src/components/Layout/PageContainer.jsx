import React from 'react';
import clsx from 'clsx';

const PageContainer = ({
    children,
    title,
    subtitle,
    actions,
    padding = 'md',
    className,
    ...props
}) => {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div
            className={clsx(
                'h-full flex flex-col',
                paddings[padding],
                className
            )}
            {...props}
        >
            {(title || subtitle || actions) && (
                <div className="flex items-start justify-between mb-6">
                    <div>
                        {title && (
                            <h1 className="text-2xl font-bold text-white">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-gray-400 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex items-center space-x-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default PageContainer;