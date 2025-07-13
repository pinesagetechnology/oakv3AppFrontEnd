import React from 'react';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { useConnectionStore } from '../../store/connectionStore';
import { useStreamStore } from '../../store/streamStore';
import StatusIndicator from '../UI/StatusIndicator';
import Badge from '../UI/Badge';

const ConnectionStatus = ({
    showDetails = false,
    compact = false,
    className
}) => {
    const {
        isConnected,
        isConnecting,
        connectionStatus,
        cameraIP,
        wsConnected
    } = useConnectionStore();
    const { isStreamConnected, fps } = useStreamStore();

    if (compact) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <StatusIndicator
                    status={isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected'}
                    showLabel={false}
                    animate={isConnecting}
                />
                <span className="text-sm text-gray-300">
                    {isConnected ? cameraIP : connectionStatus}
                </span>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Camera Connection */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {isConnected ? (
                        <Wifi className="h-5 w-5 text-green-400" />
                    ) : (
                        <WifiOff className="h-5 w-5 text-red-400" />
                    )}
                    <div>
                        <div className="text-sm font-medium text-white">
                            Camera Connection
                        </div>
                        <div className="text-xs text-gray-400">
                            {connectionStatus}
                            {isConnected && cameraIP && ` • ${cameraIP}`}
                        </div>
                    </div>
                </div>
                <Badge
                    variant={isConnected ? 'success' : isConnecting ? 'warning' : 'danger'}
                    size="sm"
                >
                    {isConnected ? 'Connected' : isConnecting ? 'Connecting' : 'Disconnected'}
                </Badge>
            </div>

            {showDetails && isConnected && (
                <>
                    {/* WebSocket Connection */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {wsConnected ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            )}
                            <div>
                                <div className="text-sm text-gray-300">
                                    WebSocket
                                </div>
                            </div>
                        </div>
                        <Badge
                            variant={wsConnected ? 'success' : 'warning'}
                            size="sm"
                        >
                            {wsConnected ? 'Connected' : 'Disconnected'}
                        </Badge>
                    </div>

                    {/* Stream Connection */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {isStreamConnected ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            )}
                            <div>
                                <div className="text-sm text-gray-300">
                                    Video Stream
                                </div>
                                {isStreamConnected && fps > 0 && (
                                    <div className="text-xs text-gray-500">
                                        {fps.toFixed(1)} FPS
                                    </div>
                                )}
                            </div>
                        </div>
                        <Badge
                            variant={isStreamConnected ? 'success' : 'warning'}
                            size="sm"
                        >
                            {isStreamConnected ? 'Streaming' : 'No Stream'}
                        </Badge>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConnectionStatus;