// frontend/src/services/api.js - Aligned with your backend API
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

// API Methods that match your backend exactly
export const apiMethods = {
    // System
    getSystemStatus: () => api.get('/status'),
    getHealth: () => api.get('/health'),

    // Camera Connection
    connectCamera: (ip_address, timeout = 10) =>
        api.post('/camera/connect', { ip_address, timeout }),
    disconnectCamera: () =>
        api.post('/camera/disconnect'),
    discoverCameras: () =>
        api.get('/camera/discover'),

    // Camera Settings
    getCameraSettings: () =>
        api.get('/camera/settings'),
    updateCameraSettings: (settings) =>
        api.put('/camera/settings', { settings }),

    // Focus Control
    triggerAutofocus: () =>
        api.post('/camera/focus/trigger'),
    setManualFocus: (position) =>
        api.post(`/camera/focus/manual/${position}`),

    // Recording
    startRecording: (codec = 'h264', filename = null) =>
        api.post('/recording/start', { codec, filename }),
    stopRecording: () =>
        api.post('/recording/stop'),

    // Capture
    captureImage: () =>
        api.post('/capture'),

    // File Management
    getFiles: () =>
        api.get('/files'),
    deleteFile: (file_type, filename) =>
        api.delete(`/files/${file_type}/${filename}`),
    cleanupFiles: () =>
        api.post('/files/cleanup'),
    downloadFile: (file_type, filename) =>
        `/api/download/${file_type}/${filename}`, // Returns URL for direct download
};

export default api;