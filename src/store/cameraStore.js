import { create } from 'zustand';
import api from '../services/api';
import websocketService from '../services/websocket';
import { CAMERA_DEFAULTS } from '../utils/constants';
import { validateCameraSettings } from '../utils/validators';
import { debounce } from '../utils/helpers';

export const useCameraStore = create((set, get) => ({
    // State
    settings: { ...CAMERA_DEFAULTS },
    status: {
        connected: false,
        streaming: false,
        recording: false,
        ip_address: null,
        device_info: null,
        temperature: null,
        uptime: null
    },
    isUpdatingSettings: false,
    settingsError: null,
    lastUpdated: null,

    // Actions
    updateSettings: async (newSettings) => {
        const current = get().settings;
        const updated = { ...current, ...newSettings };

        // Validate settings
        const validation = validateCameraSettings(updated);
        if (!validation.isValid) {
            set({ settingsError: validation.errors });
            throw new Error('Invalid settings: ' + Object.values(validation.errors).join(', '));
        }

        set({
            isUpdatingSettings: true,
            settingsError: null
        });

        try {
            // Send via WebSocket for real-time update
            const wsSuccess = websocketService.send({
                type: 'update_settings',
                settings: updated
            });

            if (wsSuccess) {
                // Optimistically update state
                set({
                    settings: updated,
                    lastUpdated: new Date().toISOString()
                });

                set({ isUpdatingSettings: false });
                return true;
            } else {
                // Fallback to REST API
                const response = await api.put('/camera/settings', { settings: updated });

                if (response.data.success) {
                    set({
                        settings: updated,
                        isUpdatingSettings: false,
                        lastUpdated: new Date().toISOString()
                    });
                    return true;
                } else {
                    throw new Error('Failed to update settings');
                }
            }
        } catch (error) {
            console.error('Settings update error:', error);
            set({
                isUpdatingSettings: false,
                settingsError: error.response?.data?.detail || error.message
            });
            throw error;
        }
    },

    // Debounced update for real-time controls
    updateSettingsDebounced: debounce(async (newSettings) => {
        return get().updateSettings(newSettings);
    }, 150),

    updateSingleSetting: async (key, value) => {
        const current = get().settings;
        return get().updateSettings({ ...current, [key]: value });
    },

    updateSingleSettingDebounced: debounce(async (key, value) => {
        return get().updateSingleSetting(key, value);
    }, 150),

    resetSettings: async () => {
        return get().updateSettings(CAMERA_DEFAULTS);
    },

    triggerAutofocus: async () => {
        try {
            const wsSuccess = websocketService.send({ type: 'trigger_autofocus' });

            if (!wsSuccess) {
                const response = await api.post('/camera/focus/trigger');
                return response.data.success;
            }

            return true;
        } catch (error) {
            console.error('Autofocus error:', error);
            return false;
        }
    },

    setManualFocus: async (position) => {
        try {
            const wsSuccess = websocketService.send({
                type: 'set_manual_focus',
                position: position
            });

            if (wsSuccess) {
                // Optimistically update
                set({
                    settings: {
                        ...get().settings,
                        focus_position: position,
                        auto_focus: false
                    }
                });
                return true;
            } else {
                const response = await api.post(`/camera/focus/manual/${position}`);
                if (response.data.success) {
                    set({
                        settings: {
                            ...get().settings,
                            focus_position: position,
                            auto_focus: false
                        }
                    });
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Manual focus error:', error);
            return false;
        }
    },

    updateStatus: (newStatus) => {
        set({ status: { ...get().status, ...newStatus } });
    },

    loadSettings: async () => {
        try {
            const response = await api.get('/camera/settings');
            set({ settings: response.data });
        } catch (error) {
            console.error('Load settings error:', error);
        }
    },

    // Handle WebSocket updates
    handleSettingsUpdate: (data) => {
        if (data.settings) {
            set({
                settings: data.settings,
                lastUpdated: new Date().toISOString()
            });
        }
    },

    handleStatusUpdate: (data) => {
        if (data.camera_status) {
            set({ status: data.camera_status });
        }
    }
}));