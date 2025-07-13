import React, { useEffect, useRef } from 'react';
import { Camera, Video, Square, Circle, Play, Maximize, Download } from 'lucide-react';
import { useConnectionStore } from '../../store/connectionStore';
import { useStreamStore } from '../../store/streamStore';
import { useRecording } from '../../hooks/useRecording';
import { useWebSocket } from '../../hooks/useWebSocket';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import StatusIndicator from '../UI/StatusIndicator';
import { formatFileSize } from '../../services/fileDownload';

const StreamDisplay = () => {
    const { isConnected } = useConnectionStore();
    const {
        isStreaming,
        currentFrame,
        fps,
        frameCount,
        bytesReceived,
        connectStream,
        disconnectStream
    } = useStreamStore();
    const {
        isRecording,
        recordingTime,
        formatRecordingTime,
        startRecording,
        stopRecording,
        captureImage
    } = useRecording();

    const canvasRef = useRef(null);
    const { sendStream } = useWebSocket();

    // Initialize stream when connected
    useEffect(() => {
        if (isConnected) {
            connectStream();
        } else {
            disconnectStream();
        }

        return () => {
            disconnectStream();
        };
    }, [isConnected]);

    // Render frames to canvas
    useEffect(() => {
        if (currentFrame && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Set canvas dimensions to match image
                canvas.width = img.width;
                canvas.height = img.height;

                // Clear and draw new frame
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };

            img.src = `data:image/jpeg;base64,${currentFrame}`;
        }
    }, [currentFrame]);

    const handleStartRecording = async () => {
        try {
            await startRecording('h264');
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    };

    const handleStopRecording = async () => {
        try {
            await stopRecording();
        } catch (error) {
            console.error('Failed to stop recording:', error);
        }
    };

    const handleCapture = async () => {
        try {
            await captureImage();
        } catch (error) {
            console.error('Failed to capture image:', error);
        }
    };

    const handleFullscreen = () => {
        if (canvasRef.current) {
            canvasRef.current.requestFullscreen?.();
        }
    };

    return (
        <Card className="h-full flex flex-col">
            {/* Stream Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Video className="h-5 w-5 text-oak-400" />
                    <div>
                        <h3 className="text-lg font-medium text-white">
                            Live Stream
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <StatusIndicator
                                status={isStreaming ? 'streaming' : 'disconnected'}
                                label={isStreaming ? `${fps.toFixed(1)} FPS` : 'No Stream'}
                                size="sm"
                            />
                            {isStreaming && (
                                <>
                                    <span>•</span>
                                    <span>{frameCount} frames</span>
                                    <span>•</span>
                                    <span>{formatFileSize(bytesReceived)}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recording Status */}
                {isRecording && (
                    <div className="flex items-center space-x-2">
                        <Circle className="w-3 h-3 text-red-500 fill-current animate-pulse" />
                        <span className="text-red-400 font-mono text-sm">
                            REC {formatRecordingTime()}
                        </span>
                    </div>
                )}
            </div>

            {/* Stream Display */}
            <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden min-h-0">
                {isStreaming && currentFrame ? (
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-contain"
                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-400 mb-2">
                                {isConnected ? 'Starting Stream...' : 'No Camera Connected'}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {isConnected
                                    ? 'Waiting for video stream to begin'
                                    : 'Connect to your Oak Camera to view live stream'
                                }
                            </p>
                        </div>
                    </div>
                )}

                {/* Stream Overlay Controls */}
                {isStreaming && (
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {/* Capture Button */}
                                <Button
                                    onClick={handleCapture}
                                    variant="secondary"
                                    size="sm"
                                    icon={Camera}
                                    className="bg-black bg-opacity-50 hover:bg-opacity-75"
                                    title="Capture Image (C)"
                                />

                                {/* Recording Button */}
                                {!isRecording ? (
                                    <Button
                                        onClick={handleStartRecording}
                                        variant="danger"
                                        size="sm"
                                        icon={Circle}
                                        className="bg-black bg-opacity-50 hover:bg-opacity-75"
                                        title="Start Recording (R)"
                                    />
                                ) : (
                                    <Button
                                        onClick={handleStopRecording}
                                        variant="danger"
                                        size="sm"
                                        icon={Square}
                                        className="bg-red-800 bg-opacity-75 hover:bg-opacity-100"
                                        title="Stop Recording (R)"
                                    />
                                )}

                                {/* Fullscreen Button */}
                                <Button
                                    onClick={handleFullscreen}
                                    variant="secondary"
                                    size="sm"
                                    icon={Maximize}
                                    className="bg-black bg-opacity-50 hover:bg-opacity-75"
                                    title="Fullscreen"
                                />
                            </div>

                            {/* Stream Info */}
                            <div className="flex items-center space-x-4 text-sm text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                                <Badge variant="primary" size="sm">
                                    {fps.toFixed(1)} FPS
                                </Badge>
                                <span>1920x1440</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Stream Controls */}
            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-400">
                            Stream Quality: <Badge variant="success" size="sm">Excellent</Badge>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={connectStream}
                            disabled={!isConnected || isStreaming}
                        >
                            Reconnect Stream
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StreamDisplay;
