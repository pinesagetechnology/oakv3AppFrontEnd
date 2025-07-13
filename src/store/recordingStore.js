import { create } from 'zustand';
import api from '../services/api';
import websocketService from '../services/websocket';
import { downloadFile } from '../services/fileDownload';

export const useRecordingStore = create((set, get) => ({
    // State
    isRecording: false,
    recordingTime: 0,
    recordingFilename: null,
    recordingCodec: 'h264',

    files: {
        videos: [],
        images: []
    },
    isLoadingFiles: false,
    totalSize: 0,
    totalCount: 0,
    lastRefresh: null,

    // Recording timer
    recordingTimer: null,

    // Actions
    startRecording: async (codec = 'h264') => {
        try {
            const wsSuccess = websocketService.send({
                type: 'start_recording',
                codec: codec
            });

            if (!wsSuccess) {
                const response = await api.post('/recording/start', { codec });
                if (response.data.success) {
                    get().setRecordingState(true, response.data.filename, codec);
                    return response.data.filename;
                }
                return null;
            }

            // WebSocket response will be handled by listener
            set({ recordingCodec: codec });
            return true;
        } catch (error) {
            console.error('Start recording error:', error);
            return null;
        }
    },

    stopRecording: async () => {
        try {
            const wsSuccess = websocketService.send({ type: 'stop_recording' });

            if (!wsSuccess) {
                const response = await api.post('/recording/stop');
                if (response.data.success) {
                    get().setRecordingState(false, null);
                    return response.data.filename;
                }
                return null;
            }

            return true;
        } catch (error) {
            console.error('Stop recording error:', error);
            return null;
        }
    },

    captureImage: async () => {
        try {
            const wsSuccess = websocketService.send({ type: 'capture_image' });

            if (!wsSuccess) {
                const response = await api.post('/capture');
                if (response.data.success) {
                    // Refresh files list
                    setTimeout(() => get().fetchFiles(), 1000);
                    return response.data.filename;
                }
                return null;
            }

            return true;
        } catch (error) {
            console.error('Capture image error:', error);
            return null;
        }
    },

    setRecordingState: (recording, filename = null, codec = null) => {
        if (recording) {
            // Start timer
            const timer = setInterval(() => {
                set({ recordingTime: get().recordingTime + 1 });
            }, 1000);

            set({
                isRecording: true,
                recordingTime: 0,
                recordingFilename: filename,
                recordingCodec: codec || get().recordingCodec,
                recordingTimer: timer
            });
        } else {
            // Stop timer
            const timer = get().recordingTimer;
            if (timer) {
                clearInterval(timer);
            }

            set({
                isRecording: false,
                recordingTime: 0,
                recordingFilename: null,
                recordingTimer: null
            });

            // Refresh files list after recording
            setTimeout(() => get().fetchFiles(), 1000);
        }
    },

    fetchFiles: async () => {
        set({ isLoadingFiles: true });

        try {
            const response = await api.get('/files');
            const data = response.data;

            set({
                files: {
                    videos: data.videos || [],
                    images: data.images || []
                },
                totalSize: data.total_size || 0,
                totalCount: data.total_count || 0,
                isLoadingFiles: false,
                lastRefresh: new Date().toISOString()
            });
        } catch (error) {
            console.error('Fetch files error:', error);
            set({ isLoadingFiles: false });
        }
    },

    deleteFile: async (type, filename) => {
        try {
            const response = await api.delete(`/files/${type}/${filename}`);

            if (response.data.success) {
                // Remove from local state immediately
                const currentFiles = get().files;
                const updatedFiles = {
                    ...currentFiles,
                    [type]: currentFiles[type].filter(file => file.filename !== filename)
                };

                set({
                    files: updatedFiles,
                    totalCount: get().totalCount - 1
                });

                // Refresh to get accurate totals
                await get().fetchFiles();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Delete file error:', error);
            return false;
        }
    },

    downloadFile: (type, filename) => {
        downloadFile(type, filename);
    },

    cleanupFiles: async () => {
        try {
            const response = await api.post('/files/cleanup');

            if (response.data.success) {
                // Refresh files list after cleanup
                setTimeout(() => get().fetchFiles(), 2000);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Cleanup files error:', error);
            return false;
        }
    },

    // Handle WebSocket events
    handleRecordingStatus: (data) => {
        if (data.recording !== undefined) {
            get().setRecordingState(data.recording, data.filename);
        }
    },

    handleRecordingResult: (data) => {
        if (data.action === 'start' && data.success) {
            get().setRecordingState(true, data.filename);
        } else if (data.action === 'stop') {
            get().setRecordingState(false);
        }
    },

    formatRecordingTime: () => {
        const time = get().recordingTime;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}));