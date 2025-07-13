import { useEffect, useCallback } from 'react';
import { useCameraStore } from '../store/cameraStore';
import { useConnectionStore } from '../store/connectionStore';
import { useWebSocket } from './useWebSocket';

export const useCamera = () => {
    const cameraStore = useCameraStore();
    const connectionStore = useConnectionStore();
    const { send } = useWebSocket();

    // Load settings when connected
    useEffect(() => {
        if (connectionStore.isConnected) {
            cameraStore.loadSettings();
        }
    }, [connectionStore.isConnected]);

    // Optimized setting updates
    const updateSetting = useCallback((key, value) => {
        return cameraStore.updateSingleSettingDebounced(key, value);
    }, []);

    const updateSettings = useCallback((settings) => {
        return cameraStore.updateSettings(settings);
    }, []);

    const resetSettings = useCallback(() => {
        return cameraStore.resetSettings();
    }, []);

    const triggerAutofocus = useCallback(() => {
        return cameraStore.triggerAutofocus();
    }, []);

    const setManualFocus = useCallback((position) => {
        return cameraStore.setManualFocus(position);
    }, []);

    // Request current status
    const refreshStatus = useCallback(() => {
        if (connectionStore.isConnected) {
            send({ type: 'get_status' });
        }
    }, [connectionStore.isConnected, send]);

    return {
        settings: cameraStore.settings,
        status: cameraStore.status,
        isUpdatingSettings: cameraStore.isUpdatingSettings,
        settingsError: cameraStore.settingsError,
        lastUpdated: cameraStore.lastUpdated,
        updateSetting,
        updateSettings,
        resetSettings,
        triggerAutofocus,
        setManualFocus,
        refreshStatus
    };
};