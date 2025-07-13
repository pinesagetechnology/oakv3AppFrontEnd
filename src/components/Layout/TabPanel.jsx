import React from 'react';
import clsx from 'clsx';

const TabPanel = ({
    children,
    isActive = false,
    className,
    ...props
}) => {
    if (!isActive) return null;

    return (
        <div
            className={clsx('h-full', className)}
            role="tabpanel"
            {...props}
        >
            {children}
        </div>
    );
};

export default TabPanel;