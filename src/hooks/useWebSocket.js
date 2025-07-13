import { useEffect, useRef } from 'react';
import websocketService from '../services/websocket';
import { useConnectionStore } from '../store/connectionStore';
import { useCameraStore } from '../store/cameraStore';
import { useRecordingStore } from '../store/recordingStore';
import { useStreamStore } from '../store/streamStore';
import toast from 'react-hot-toast';

export const useWebSocket = () => {
    const connectionStore = useConnectionStore();
    const cameraStore = useCameraStore();
    const recordingStore = useRecordingStore();
    const streamStore = useStreamStore();

    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        // Setup WebSocket event listeners
        const setupListeners = () => {
            // Connection events
            websocketService.on('connected', () => {
                connectionStore.setWSConnected(true);
                toast.success('WebSocket connected');
            });

            websocketService.on('disconnected', () => {
                connectionStore.setWSConnected(false);
                toast.error('WebSocket disconnected');
            });

            websocketService.on('error', (error) => {
                console.error('WebSocket error:', error);
                toast.error('WebSocket connection error');
            });

            // Camera connection events
            websocketService.on('connection_result', (data) => {
                if (data.success) {
                    toast.success(data.message);
                    if (data.data?.camera_settings) {
                        cameraStore.handleSettingsUpdate(data.data);
                    }
                    if (data.data?.camera_status) {
                        cameraStore.handleStatusUpdate(data.data);
                    }
                } else {
                    toast.error(data.message);
                }
            });

            // Settings events
            websocketService.on('settings_update_result', (data) => {
                if (data.success) {
                    if (data.data) {
                        cameraStore.handleSettingsUpdate({ settings: data.data });
                    }
                } else {
                    toast.error(data.message);
                }
            });

            websocketService.on('settings_updated', (data) => {
                cameraStore.handleSettingsUpdate(data);
            });

            // Recording events
            websocketService.on('recording_result', (data) => {
                recordingStore.handleRecordingResult(data);

                if (data.success) {
                    const action = data.action === 'start' ? 'started' : 'stopped';
                    toast.success(`Recording ${action}${data.filename ? `: ${data.filename}` : ''}`);
                } else {
                    toast.error(data.message);
                }
            });

            websocketService.on('recording_status_update', (data) => {
                recordingStore.handleRecordingStatus(data);
            });

            // Capture events
            websocketService.on('capture_result', (data) => {
                if (data.success) {
                    toast.success(`Image captured: ${data.filename}`);
                    // Refresh files list
                    setTimeout(() => recordingStore.fetchFiles(), 1000);
                } else {
                    toast.error(data.message);
                }
            });

            // Focus events
            websocketService.on('focus_result', (data) => {
                if (data.success) {
                    toast.success(`Focus set to ${data.position}`);
                } else {
                    toast.error(data.message);
                }
            });

            websocketService.on('focus_updated', (data) => {
                cameraStore.handleSettingsUpdate({
                    settings: {
                        ...cameraStore.settings,
                        focus_position: data.position,
                        auto_focus: false
                    }
                });
            });

            websocketService.on('autofocus_result', (data) => {
                if (data.success) {
                    toast.success('Autofocus triggered');
                } else {
                    toast.error('Autofocus failed');
                }
            });

            // Status updates
            websocketService.on('status_update', (data) => {
                cameraStore.handleStatusUpdate(data);
            });

            websocketService.on('camera_status_update', (data) => {
                connectionStore.handleConnectionUpdate(data);
            });

            // Stream events
            websocketService.onStream('stream_connected', () => {
                streamStore.setStreamConnected(true);
                streamStore.setStreaming(true);
                toast.success('Video stream connected');
            });

            websocketService.onStream('stream_disconnected', () => {
                streamStore.setStreamConnected(false);
                streamStore.setStreaming(false);
                toast.error('Video stream disconnected');
            });

            websocketService.onStream('frame', (data) => {
                streamStore.handleFrame(data);
            });

            // Error events
            websocketService.on('error', (data) => {
                toast.error(data.message);
            });
        };

        // Initialize WebSocket connection
        setupListeners();
        websocketService.connect();

        // Cleanup on unmount
        return () => {
            websocketService.disconnect();
        };
    }, []);

    return {
        isConnected: connectionStore.wsConnected,
        send: websocketService.send.bind(websocketService),
        sendStream: websocketService.sendStream.bind(websocketService),
        connect: websocketService.connect.bind(websocketService),
        disconnect: websocketService.disconnect.bind(websocketService)
    };
};