import { create } from 'zustand';
import websocketService from '../services/websocket';

export const useStreamStore = create((set, get) => ({
    // State
    isStreaming: false,
    isStreamConnected: false,
    currentFrame: null,
    frameCount: 0,
    bytesReceived: 0,
    fps: 0,
    lastFrameTime: null,
    streamStartTime: null,

    // Stream quality metrics
    streamStats: {
        averageFPS: 0,
        totalFrames: 0,
        totalBytes: 0,
        droppedFrames: 0,
        latency: 0
    },

    // Actions
    connectStream: () => {
        websocketService.connectStream();
        set({ streamStartTime: Date.now() });
    },

    disconnectStream: () => {
        websocketService.streamWs?.close();
        set({
            isStreamConnected: false,
            isStreaming: false,
            currentFrame: null,
            streamStartTime: null
        });
    },

    setStreamConnected: (connected) => {
        set({ isStreamConnected: connected });
    },

    setStreaming: (streaming) => {
        set({ isStreaming: streaming });
        if (streaming) {
            set({ streamStartTime: Date.now() });
        }
    },

    handleFrame: (frameData) => {
        const now = Date.now();
        const currentTime = get().lastFrameTime;

        // Calculate FPS
        let fps = 0;
        if (currentTime) {
            fps = 1000 / (now - currentTime);
        }

        // Update frame data
        set({
            currentFrame: frameData.data, // base64 encoded frame
            frameCount: get().frameCount + 1,
            bytesReceived: get().bytesReceived + (frameData.size || 0),
            fps: Math.round(fps * 10) / 10,
            lastFrameTime: now
        });

        // Update stream stats
        const stats = get().streamStats;
        const totalFrames = stats.totalFrames + 1;
        const runtime = (now - get().streamStartTime) / 1000;

        set({
            streamStats: {
                ...stats,
                totalFrames,
                totalBytes: stats.totalBytes + (frameData.size || 0),
                averageFPS: totalFrames / runtime,
                latency: frameData.timestamp ? now - (frameData.timestamp * 1000) : 0
            }
        });
    },

    resetStats: () => {
        set({
            frameCount: 0,
            bytesReceived: 0,
            fps: 0,
            streamStats: {
                averageFPS: 0,
                totalFrames: 0,
                totalBytes: 0,
                droppedFrames: 0,
                latency: 0
            },
            streamStartTime: Date.now()
        });
    },

    getStreamQuality: () => {
        const stats = get().streamStats;
        const fps = get().fps;

        if (fps > 25) return 'excellent';
        if (fps > 20) return 'good';
        if (fps > 15) return 'fair';
        if (fps > 10) return 'poor';
        return 'very-poor';
    }
}));
