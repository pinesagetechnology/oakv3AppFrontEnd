// frontend/src/components/UI/StatusIndicator.jsx
import React from 'react';
import clsx from 'clsx';

const StatusIndicator = ({
    status = 'disconnected',
    label,
    size = 'md',
    showLabel = true,
    animate = true,
    className
}) => {
    const statuses = {
        connected: {
            color: 'bg-green-500',
            label: 'Connected'
        },
        connecting: {
            color: 'bg-yellow-500',
            label: 'Connecting...'
        },
        disconnected: {
            color: 'bg-red-500',
            label: 'Disconnected'
        },
        error: {
            color: 'bg-red-600',
            label: 'Error'
        },
        recording: {
            color: 'bg-red-500',
            label: 'Recording'
        },
        streaming: {
            color: 'bg-blue-500',
            label: 'Streaming'
        }
    };

    const sizes = {
        sm: 'h-2 w-2',
        md: 'h-3 w-3',
        lg: 'h-4 w-4'
    };

    const statusConfig = statuses[status];
    const displayLabel = label || statusConfig?.label;

    return (
        <div className={clsx('flex items-center', className)}>
            <div className="relative">
                <div
                    className={clsx(
                        'rounded-full',
                        sizes[size],
                        statusConfig?.color || 'bg-gray-500'
                    )}
                />
                {animate && (status === 'recording' || status === 'connecting') && (
                    <div
                        className={clsx(
                            'absolute inset-0 rounded-full animate-ping',
                            sizes[size],
                            statusConfig?.color || 'bg-gray-500',
                            'opacity-75'
                        )}
                    />
                )}
            </div>

            {showLabel && displayLabel && (
                <span className="ml-2 text-sm text-gray-300">
                    {displayLabel}
                </span>
            )}
        </div>
    );
};

export default StatusIndicator;