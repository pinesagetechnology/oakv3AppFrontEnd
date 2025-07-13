import { useEffect, useCallback, useRef } from 'react';
import { useRecordingStore } from '../store/recordingStore';
import { useConnectionStore } from '../store/connectionStore';

export const useRecording = () => {
    const recordingStore = useRecordingStore();
    const connectionStore = useConnectionStore();
    const intervalRef = useRef(null);

    // Load files when connected
    useEffect(() => {
        if (connectionStore.isConnected) {
            recordingStore.fetchFiles();
        }
    }, [connectionStore.isConnected]);

    // Periodic file refresh
    useEffect(() => {
        if (connectionStore.isConnected) {
            intervalRef.current = setInterval(() => {
                recordingStore.fetchFiles();
            }, 30000); // Refresh every 30 seconds
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [connectionStore.isConnected]);

    const startRecording = useCallback((codec = 'h264') => {
        if (!connectionStore.isConnected) {
            throw new Error('Camera not connected');
        }
        return recordingStore.startRecording(codec);
    }, [connectionStore.isConnected]);

    const stopRecording = useCallback(() => {
        return recordingStore.stopRecording();
    }, []);

    const captureImage = useCallback(() => {
        if (!connectionStore.isConnected) {
            throw new Error('Camera not connected');
        }
        return recordingStore.captureImage();
    }, [connectionStore.isConnected]);

    const deleteFile = useCallback((type, filename) => {
        return recordingStore.deleteFile(type, filename);
    }, []);

    const downloadFile = useCallback((type, filename) => {
        recordingStore.downloadFile(type, filename);
    }, []);

    const refreshFiles = useCallback(() => {
        return recordingStore.fetchFiles();
    }, []);

    return {
        isRecording: recordingStore.isRecording,
        recordingTime: recordingStore.recordingTime,
        recordingFilename: recordingStore.recordingFilename,
        recordingCodec: recordingStore.recordingCodec,
        files: recordingStore.files,
        isLoadingFiles: recordingStore.isLoadingFiles,
        totalSize: recordingStore.totalSize,
        totalCount: recordingStore.totalCount,
        lastRefresh: recordingStore.lastRefresh,
        formatRecordingTime: recordingStore.formatRecordingTime,
        startRecording,
        stopRecording,
        captureImage,
        deleteFile,
        downloadFile,
        refreshFiles,
        cleanupFiles: recordingStore.cleanupFiles
    };
};