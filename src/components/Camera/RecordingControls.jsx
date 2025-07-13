import React, { useState } from 'react';
import { Circle, Square, Camera, Video, Play, Pause, Download, Settings } from 'lucide-react';
import { useRecording } from '../../hooks/useRecording';
import { useConnectionStore } from '../../store/connectionStore';
import { VIDEO_CODECS } from '../../utils/constants';
import { formatFileSize } from '../../services/fileDownload';
import Button from '../UI/Button';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import StatusIndicator from '../UI/StatusIndicator';
import Stack from '../Layout/Stack';

const RecordingControls = () => {
    const { isConnected } = useConnectionStore();
    const {
        isRecording,
        recordingTime,
        recordingFilename,
        recordingCodec,
        totalSize,
        totalCount,
        formatRecordingTime,
        startRecording,
        stopRecording,
        captureImage
    } = useRecording();

    const [selectedCodec, setSelectedCodec] = useState('h264');

    const handleStartRecording = async () => {
        try {
            await startRecording(selectedCodec);
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

    if (!isConnected) {
        return (
            <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                    Camera Not Connected
                </h3>
                <p className="text-sm text-gray-500">
                    Connect to your camera to start recording
                </p>
            </div>
        );
    }

    return (
        <Stack spacing={6}>
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-2">Recording Controls</h2>
                <p className="text-sm text-gray-400">
                    Capture images and record videos with your Oak Camera
                </p>
            </div>

            {/* Recording Status */}
            <Card
                title={isRecording ? "Recording Active" : "Ready to Record"}
                icon={isRecording ? Circle : Video}
                className={isRecording ? "border-red-600" : ""}
            >
                <Stack spacing={4}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <StatusIndicator
                                status={isRecording ? 'recording' : 'disconnected'}
                                animate={isRecording}
                            />
                            <div>
                                <div className="text-sm font-medium text-white">
                                    {isRecording ? 'Recording...' : 'Standby'}
                                </div>
                                {isRecording && (
                                    <div className="text-xs text-gray-400">
                                        {recordingFilename}
                                    </div>
                                )}
                            </div>
                        </div>

                        {isRecording && (
                            <div className="text-right">
                                <div className="text-lg font-mono text-red-400">
                                    {formatRecordingTime()}
                                </div>
                                <Badge variant="danger" size="sm">
                                    {recordingCodec.toUpperCase()}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Recording Controls */}
                    <div className="flex items-center space-x-3">
                        {!isRecording ? (
                            <Button
                                onClick={handleStartRecording}
                                variant="danger"
                                icon={Circle}
                                className="flex-1"
                            >
                                Start Recording
                            </Button>
                        ) : (
                            <Button
                                onClick={handleStopRecording}
                                variant="danger"
                                icon={Square}
                                className="flex-1"
                            >
                                Stop Recording
                            </Button>
                        )}

                        <Button
                            onClick={handleCapture}
                            variant="primary"
                            icon={Camera}
                            disabled={!isConnected}
                        >
                            Capture
                        </Button>
                    </div>
                </Stack>
            </Card>

            {/* Recording Settings */}
            {!isRecording && (
                <Card title="Recording Settings" icon={Settings}>
                    <Stack spacing={4}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Video Codec
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {VIDEO_CODECS.map((codec) => (
                                    <button
                                        key={codec.value}
                                        onClick={() => setSelectedCodec(codec.value)}
                                        className={`p-2 text-sm rounded border transition-colors ${selectedCodec === codec.value
                                                ? 'border-oak-500 bg-oak-600 text-white'
                                                : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {codec.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                H.264: Best compatibility • H.265: Better compression • MJPEG: Lowest latency
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-gray-400">Resolution</div>
                                <div className="text-white font-mono">1920 × 1440</div>
                            </div>
                            <div>
                                <div className="text-gray-400">Frame Rate</div>
                                <div className="text-white font-mono">30 FPS</div>
                            </div>
                        </div>
                    </Stack>
                </Card>
            )}

            {/* Quick Stats */}
            <Card title="Storage Overview" icon={Download}>
                <Stack spacing={3}>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-gray-400">Total Files</div>
                            <div className="text-white font-mono">{totalCount}</div>
                        </div>
                        <div>
                            <div className="text-gray-400">Total Size</div>
                            <div className="text-white font-mono">{formatFileSize(totalSize)}</div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-700">
                        <div className="text-xs text-gray-500">
                            Files are automatically saved to the recordings directory.
                            Use the File Manager tab to view, download, or delete recordings.
                        </div>
                    </div>
                </Stack>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card title="Keyboard Shortcuts">
                <Stack spacing={2}>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Start/Stop Recording</span>
                        <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">R</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Capture Image</span>
                        <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">C</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Trigger Focus</span>
                        <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">F</kbd>
                    </div>
                </Stack>
            </Card>
        </Stack>
    );
};

export default RecordingControls;