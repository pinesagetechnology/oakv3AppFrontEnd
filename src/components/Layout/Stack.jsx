import React from 'react';
import clsx from 'clsx';

const Stack = ({
    children,
    direction = 'vertical',
    spacing = 4,
    align = 'stretch',
    justify = 'start',
    className,
    ...props
}) => {
    const directions = {
        vertical: 'flex-col',
        horizontal: 'flex-row'
    };

    const spacings = {
        1: direction === 'vertical' ? 'space-y-1' : 'space-x-1',
        2: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
        3: direction === 'vertical' ? 'space-y-3' : 'space-x-3',
        4: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
        6: direction === 'vertical' ? 'space-y-6' : 'space-x-6',
        8: direction === 'vertical' ? 'space-y-8' : 'space-x-8'
    };

    const alignments = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch'
    };

    const justifications = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around'
    };

    return (
        <div
            className={clsx(
                'flex',
                directions[direction],
                spacings[spacing],
                alignments[align],
                justifications[justify],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Stack;