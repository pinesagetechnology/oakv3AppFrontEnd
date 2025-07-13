// frontend/src/components/UI/Modal.jsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
    isOpen = false,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlay = true,
    closeOnEscape = true,
    className,
    ...props
}) => {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl'
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (closeOnEscape && e.key === 'Escape') {
                onClose?.();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeOnEscape, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
                onClick={handleOverlayClick}
            >
                <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />

                <div className={clsx(
                    'relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6',
                    sizes[size],
                    className
                )}>
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between mb-4">
                            {title && (
                                <h3 className="text-lg font-medium leading-6 text-white">
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    icon={X}
                                    className="ml-auto"
                                />
                            )}
                        </div>
                    )}

                    <div className="text-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;