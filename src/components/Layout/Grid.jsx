import React from 'react';
import clsx from 'clsx';

const Grid = ({
    children,
    cols = 1,
    gap = 4,
    className,
    ...props
}) => {
    const colsClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };

    const gapClasses = {
        2: 'gap-2',
        4: 'gap-4',
        6: 'gap-6',
        8: 'gap-8'
    };

    return (
        <div
            className={clsx(
                'grid',
                colsClasses[cols],
                gapClasses[gap],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Grid;