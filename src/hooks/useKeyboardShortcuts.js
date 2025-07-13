import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';
import { useCamera } from './useCamera';
import { useRecording } from './useRecording';

export const useKeyboardShortcuts = () => {
    const uiStore = useUIStore();
    const { triggerAutofocus } = useCamera();
    const { captureImage, startRecording, stopRecording, isRecording } = useRecording();

    useEffect(() => {
        const handleKeyDown = (event) => {
            const { key, ctrlKey, shiftKey, altKey, target } = event;

            // Don't handle shortcuts when typing in inputs
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }

            // Prevent default for our shortcuts
            const shouldPreventDefault = () => {
                if (ctrlKey) {
                    return ['k', ',', 'f', 'b'].includes(key);
                }
                return ['1', '2', '3', 'c', 'r', 'f', 'Escape', ' '].includes(key);
            };

            if (shouldPreventDefault()) {
                event.preventDefault();
            }

            // Handle shortcuts
            if (ctrlKey && !shiftKey && !altKey) {
                switch (key) {
                    case 'k':
                        uiStore.setShowConnectionModal(true);
                        break;
                    case ',':
                        uiStore.setShowSettingsModal(true);
                        break;
                    case 'f':
                        uiStore.toggleFileManager();
                        break;
                    case 'b':
                        uiStore.toggleSidebar();
                        break;
                }
            } else if (!ctrlKey && !shiftKey && !altKey) {
                switch (key) {
                    case '1':
                        uiStore.setActiveTab('camera');
                        break;
                    case '2':
                        uiStore.setActiveTab('recording');
                        break;
                    case '3':
                        uiStore.setActiveTab('files');
                        break;
                    case 'c':
                        captureImage().catch(console.error);
                        break;
                    case 'r':
                        if (isRecording) {
                            stopRecording().catch(console.error);
                        } else {
                            startRecording().catch(console.error);
                        }
                        break;
                    case 'f':
                        triggerAutofocus().catch(console.error);
                        break;
                    case 'Escape':
                        uiStore.setShowConnectionModal(false);
                        uiStore.setShowSettingsModal(false);
                        uiStore.setShowAboutModal(false);
                        break;
                    case ' ':
                        // Spacebar for focus/capture
                        if (shiftKey) {
                            captureImage().catch(console.error);
                        } else {
                            triggerAutofocus().catch(console.error);
                        }
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRecording, uiStore, triggerAutofocus, captureImage, startRecording, stopRecording]);
};