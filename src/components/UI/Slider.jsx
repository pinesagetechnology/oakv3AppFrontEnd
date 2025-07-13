import React from 'react';
import clsx from 'clsx';

const Slider = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    label,
    unit,
    showValue = true,
    className,
    ...props
}) => {
    const handleChange = (e) => {
        const newValue = Number(e.target.value);
        onChange?.(newValue);
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={clsx('w-full', className)}>
            {label && (
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                        {label}
                    </label>
                    {showValue && (
                        <span className="text-sm text-gray-400">
                            {value}{unit && ` ${unit}`}
                        </span>
                    )}
                </div>
            )}

            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className={clsx(
                        'w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{
                        background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${percentage}%, #4b5563 ${percentage}%, #4b5563 100%)`
                    }}
                    {...props}
                />
            </div>
        </div>
    );
};

export default Slider;